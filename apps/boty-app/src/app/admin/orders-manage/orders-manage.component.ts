import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../core/services/order.service';
import { Order } from '../../core/models/order.model';

@Component({
  selector: 'app-orders-manage',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders-manage.component.html',
  styleUrl: './orders-manage.component.css'
})
export class OrdersManageComponent implements OnInit {
  private orderService = inject(OrderService);

  orders = signal<Order[]>([]);
  selectedOrder = signal<Order | null>(null);
  
  // State for the edit form
  editStatus = signal<Order['status']>('Pendiente');
  editTracking = signal<string>('');

  ngOnInit() {
    this.orderService.getOrders().subscribe(data => {
      // Sort by newest first
      this.orders.set(data.sort((a, b) => b.createdAt - a.createdAt));
      // Update selected order if it exists in the new data
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  closeOrder() {
    this.selectedOrder.set(null);
  }

  updateOrder() {
    const order = this.selectedOrder();
    if (!order) return;

    const newStatus = this.editStatus();
    const newTracking = this.editTracking();

    if (newStatus !== order.status) {
      this.orderService.updateOrderStatus(order.id, newStatus);
    }

    if (newTracking !== (order.trackingNumber || '')) {
      this.orderService.addTrackingNumber(order.id, newTracking);
    }
    
    // Optimistic UI update
    this.selectedOrder.update(o => o ? { ...o, status: newStatus, trackingNumber: newTracking } : null);
  }

  deleteOrder(id: string) {
    if(confirm('ATENCIÓN: ¿Seguro que quieres eliminar este pedido permanentemente? Solo deberías hacerlo para pedidos de prueba.')) {
      this.orderService.deleteOrder(id);
      if (this.selectedOrder()?.id === id) {
        this.selectedOrder.set(null);
      }
    }
  }

  formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString('es-ES', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  getStatusColor(status: string): string {
    switch(status) {
      case 'Pendiente': return 'status-pending';
      case 'Pagado': return 'status-paid';
      case 'Enviado': return 'status-shipped';
      case 'Entregado': return 'status-delivered';
      case 'Cancelado': return 'status-cancelled';
      default: return 'status-default';
    }
  }
}
