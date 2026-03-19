import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule, KeyValuePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../core/services/order.service';
import { EmailService } from '../../core/services/email.service';
import { InvoiceService } from '../../core/services/invoice.service';
import { Order, OrderStatus } from '../../core/models/order.model';

@Component({
  selector: 'app-orders-manage',
  standalone: true,
  imports: [CommonModule, FormsModule, KeyValuePipe],
  templateUrl: './orders-manage.component.html',
  styleUrl: './orders-manage.component.css'
})
export class OrdersManageComponent implements OnInit {
  private orderService = inject(OrderService);
  private emailService = inject(EmailService);
  private invoiceService = inject(InvoiceService);

  allOrders = signal<Order[]>([]);
  loading = signal(true);
  statusFilter = signal<string>('Todos');
  selectedOrder = signal<Order | null>(null);

  orders = computed(() => {
    const f = this.statusFilter();
    return f === 'Todos' ? this.allOrders() : this.allOrders().filter(o => o.status === f);
  });

  // Edit form state
  editStatus = signal<OrderStatus>('Pendiente_Pago');
  editTracking = signal<string>('');
  editNotes = signal<string>('');
  isSaving = signal(false);
  sendEmailOnStatusChange = signal(true);

  readonly STATUS_OPTIONS: OrderStatus[] = ['Pendiente_Pago', 'Pagado', 'Enviado', 'Entregado', 'Cancelado'];
  readonly STATUS_LABELS: Record<OrderStatus, string> = {
    'Pendiente_Pago': 'Pendiente de pago',
    'Pagado': 'Pagado',
    'Enviado': 'Enviado',
    'Entregado': 'Entregado',
    'Cancelado': 'Cancelado',
  };

  ngOnInit() {
    this.orderService.getOrders().subscribe(data => {
      this.allOrders.set(data);
      this.loading.set(false);
      const current = this.selectedOrder();
      if (current) {
        const updated = data.find(o => o.id === current.id);
        if (updated) this.selectedOrder.set(updated);
      }
    });
  }

  selectOrder(order: Order) {
    this.selectedOrder.set(order);
    this.editStatus.set(order.status);
    this.editTracking.set(order.trackingNumber || '');
    this.editNotes.set(order.adminNotes || '');
  }

  closeOrder() { this.selectedOrder.set(null); }

  async updateOrder() {
    const order = this.selectedOrder();
    if (!order) return;
    this.isSaving.set(true);

    try {
      const newStatus = this.editStatus();
      const newTracking = this.editTracking();
      const newNotes = this.editNotes();

      const updates: Partial<Order> = {};
      const statusChanged = newStatus !== order.status;

      if (statusChanged) {
        await this.orderService.updateOrderStatus(order.id, newStatus);
        updates.status = newStatus;

        if (this.sendEmailOnStatusChange()) {
          const updatedOrder = { ...order, ...updates, trackingNumber: newTracking || order.trackingNumber };
          try {
            if (newStatus === 'Pagado') await this.emailService.sendPaymentConfirmed(updatedOrder as Order);
            if (newStatus === 'Enviado') await this.emailService.sendOrderShipped(updatedOrder as Order);
          } catch (e) {
            console.warn('⚠️ No se pudo enviar el email debido a restricciones CORS de Resend. Se requiere un backend.', e);
          }
        }
      }
      if (newTracking !== (order.trackingNumber || '')) {
        await this.orderService.updateTracking(order.id, newTracking);
      }
      if (newNotes !== (order.adminNotes || '')) {
        await this.orderService.updateAdminNotes(order.id, newNotes);
      }

      this.selectedOrder.update(o => o ? { ...o, status: newStatus, trackingNumber: newTracking, adminNotes: newNotes } : null);
    } finally {
      this.isSaving.set(false);
    }
  }

  async markAsPaid() {
    const order = this.selectedOrder();
    if (!order) return;
    this.editStatus.set('Pagado');
    await this.updateOrder();
  }

  openInvoice() {
    const order = this.selectedOrder();
    if (order) this.invoiceService.openInvoiceInNewTab(order);
  }

  async resendEmail() {
    const order = this.selectedOrder();
    if (!order) return;
    try {
      if (order.status === 'Pendiente_Pago') await this.emailService.sendOrderConfirmation(order);
      else if (order.status === 'Pagado') await this.emailService.sendPaymentConfirmed(order);
      else if (order.status === 'Enviado') await this.emailService.sendOrderShipped(order);
      alert('Petición de email procesada.');
    } catch (e) {
      console.warn(e);
      alert('⚠️ Resend bloquea peticiones CORS desde el navegador. Revisa la consola.');
    }
  }

  deleteOrder(id: string) {
    if (confirm('¿Seguro que quieres eliminar este pedido permanentemente?')) {
      this.orderService.deleteOrder(id);
      if (this.selectedOrder()?.id === id) this.selectedOrder.set(null);
    }
  }

  formatDate(ts: number): string {
    return new Date(ts).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  getStatusClass(status: OrderStatus | string): string {
    const map: Record<string, string> = {
      'Pendiente_Pago': 'status-pending',
      'Pagado': 'status-paid',
      'Enviado': 'status-shipped',
      'Entregado': 'status-delivered',
      'Cancelado': 'status-cancelled',
    };
    return map[status] ?? 'status-default';
  }

  /** Safe label lookup for template string iteration */
  getStatusLabel(status: string): string {
    return this.STATUS_LABELS[status as OrderStatus] ?? status;
  }
}
