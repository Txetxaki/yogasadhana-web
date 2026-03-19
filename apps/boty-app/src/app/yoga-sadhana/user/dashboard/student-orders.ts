import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/order.service';
import { AuthService } from '../../auth/auth.service';
import { Order } from '../../../core/models/order.model';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
@Component({
  selector: 'app-student-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-orders.html',
  styleUrl: './student-orders.css',
})
export class StudentOrders implements OnInit {
  private orderService = inject(OrderService);
  private auth = inject(AuthService);

  orders = signal<Order[]>([]);
  loading = signal<boolean>(true);

  ngOnInit() {
    const uid = this.auth.currentUser()?.id;
    if (!uid) return;
    this.orderService.getOrdersByUser(uid).subscribe(data => {
      this.orders.set(data);
      this.loading.set(false);
    });
  }

  downloadInvoice(order: Order) {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(40, 40, 40);
    doc.text('YogaSadhana', 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Factura: ' + order.invoiceNumber, 14, 30);
    doc.text('Fecha: ' + new Date(order.createdAt).toLocaleDateString(), 14, 36);
    doc.text('Estado: ' + order.status.replace('_', ' '), 14, 42);
    
    // Customer Info
    doc.setFontSize(12);
    doc.setTextColor(40);
    doc.text('Facturado a:', 14, 55);
    doc.setFontSize(10);
    doc.setTextColor(100);
    const c = order.customerInfo;
    doc.text(`${c.firstName} ${c.lastName}`, 14, 61);
    if (c.dni) {
      doc.text(`DNI / CIF: ${c.dni}`, 14, 67);
      doc.text(`${c.address}`, 14, 73);
      doc.text(`${c.postalCode} ${c.city}, ${c.country}`, 14, 79);
      doc.text(`${c.email} | ${c.phone}`, 14, 85);
    } else {
      doc.text(`${c.address}`, 14, 67);
      doc.text(`${c.postalCode} ${c.city}, ${c.country}`, 14, 73);
      doc.text(`${c.email} | ${c.phone}`, 14, 79);
    }
    
    // Items table
    const tableBody = order.items.map(item => {
      const basePrice = item.price / 1.21;
      const rowIva = item.price - basePrice;
      const baseTotal = item.price * item.quantity; // We show total with IVA here per row
      return [
        item.productName, 
        item.quantity.toString(), 
        `${basePrice.toFixed(2)} €`, 
        `${rowIva.toFixed(2)} €`,
        `${baseTotal.toFixed(2)} €`
      ];
    });

    if (order.shippingCost && order.shippingCost > 0) {
      const shippingBase = order.shippingCost / 1.21;
      const shippingIva = order.shippingCost - shippingBase;
      tableBody.push([
        'Gastos de Envío',
        '1',
        `${shippingBase.toFixed(2)} €`,
        `${shippingIva.toFixed(2)} €`,
        `${order.shippingCost.toFixed(2)} €`
      ]);
    }

    autoTable(doc, {
      startY: 95,
      head: [['Concepto', 'Cant.', 'Base Ud.', 'Valor IVA', 'Total']],
      body: tableBody,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 4 },
      headStyles: { fillColor: [85, 95, 85], textColor: 255 },
      alternateRowStyles: { fillColor: [248, 248, 248] },
    });

    const finalY = (doc as any).lastAutoTable.finalY || 95;

    // Totals
    const baseImponible = order.total / 1.21;
    const ivaAmount = order.total - baseImponible;

    doc.setFontSize(10);
    doc.setTextColor(80);
    doc.text(`Suma Base Imponible: ${baseImponible.toFixed(2)} €`, 130, finalY + 14);
    doc.text(`Cuota IVA (21%): ${ivaAmount.toFixed(2)} €`, 130, finalY + 20);
    
    doc.setFontSize(14);
    doc.setTextColor(30);
    doc.setFont('helvetica', 'bold');
    doc.text(`TOTAL FACTURA: ${order.total.toFixed(2)} €`, 130, finalY + 30);
    doc.setFont('helvetica', 'normal');

    // Footer messages
    if (order.status === 'Pendiente_Pago' && order.paymentMethod === 'Transferencia') {
      doc.setFontSize(10);
      doc.setTextColor(180, 50, 50);
      doc.text('Atención: Pendiente de Transferencia Bancaria', 14, finalY + 12);
      doc.setTextColor(100);
      doc.text(`Por favor, importe ${order.total.toFixed(2)} € a la cuenta:`, 14, finalY + 18);
      if (order.bankTransferInfo) {
        doc.text(`IBAN: ${order.bankTransferInfo.iban}`, 14, finalY + 24);
        doc.text(`Concepto / Referencia: ${order.paymentReference}`, 14, finalY + 30);
      }
    }
    
    doc.save(`Factura_${order.invoiceNumber}.pdf`);
  }

  requestChange(order: Order) {
    window.location.href = `mailto:hola@yogasadhana.es?subject=Consulta sobre pedido ${order.invoiceNumber}`;
  }
}
