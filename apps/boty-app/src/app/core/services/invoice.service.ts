import { Injectable } from '@angular/core';
import { Order } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class InvoiceService {

  /**
   * Genera el HTML completo de una factura con el estilo de YogaSadhana.
   * Se puede abrir en nueva pestaña o enviar por email.
   */
  generateInvoiceHtml(order: Order): string {
    const orderDate = new Date(order.createdAt).toLocaleDateString('es-ES', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
    const paidDate = order.paidAt
      ? new Date(order.paidAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
      : '—';
    const taxRate = 0.21;
    const baseAmount = +(order.subtotal / (1 + taxRate)).toFixed(2);
    const taxAmount = +(order.subtotal - baseAmount).toFixed(2);

    const itemRows = order.items.map(item => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #f0ece6;">${item.productName}</td>
        <td style="padding:12px 0;border-bottom:1px solid #f0ece6;text-align:center;">${item.quantity}</td>
        <td style="padding:12px 0;border-bottom:1px solid #f0ece6;text-align:right;">${this.formatCurrency(item.price)}</td>
        <td style="padding:12px 0;border-bottom:1px solid #f0ece6;text-align:right;font-weight:600;">${this.formatCurrency(item.quantity * item.price)}</td>
      </tr>`
    ).join('');

    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Factura ${order.invoiceNumber} — YogaSadhana</title>
  <style>
    * { margin:0;padding:0;box-sizing:border-box; }
    body { font-family: 'Georgia', serif; color: #1c1c19; background: #faf8f5; }
    .page { max-width: 780px; margin: 0 auto; background: #fff; padding: 3rem; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 3rem; border-bottom: 3px solid #924a28; padding-bottom: 1.5rem; }
    .logo { font-size: 1.6rem; font-weight: 700; color: #924a28; letter-spacing: -0.02em; }
    .logo small { display: block; font-size: 0.75rem; font-weight: 400; color: #9b8b82; letter-spacing: 0.05em; text-transform: uppercase; }
    .invoice-meta { text-align: right; }
    .invoice-num { font-size: 1.25rem; font-weight: 700; color: #1c1c19; }
    .invoice-date { font-size: 0.875rem; color: #9b8b82; margin-top: 0.25rem; }
    .status-badge { display: inline-block; margin-top: 0.5rem; padding: 0.25rem 0.75rem; border-radius: 99px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
    .status-paid { background: #dcfce7; color: #166534; }
    .status-pending { background: #fef9c3; color: #854d0e; }
    .parties { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2.5rem; }
    .party h4 { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; color: #9b8b82; margin-bottom: 0.75rem; }
    .party p { font-size: 0.9rem; line-height: 1.7; }
    .party strong { display: block; font-size: 1rem; margin-bottom: 0.25rem; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 2rem; }
    thead th { background: #924a28; color: #fff; padding: 0.75rem 0; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.06em; }
    thead th:last-child, thead th:nth-child(3), thead th:nth-child(2) { text-align: right; }
    thead th:nth-child(2) { text-align: center; }
    .totals { margin-left: auto; width: 280px; }
    .totals-row { display: flex; justify-content: space-between; padding: 0.5rem 0; font-size: 0.9rem; color: #54433c; }
    .totals-row.total { border-top: 2px solid #924a28; margin-top: 0.5rem; padding-top: 0.75rem; font-size: 1.1rem; font-weight: 700; color: #1c1c19; }
    .bank-box { background: #f7f3ee; border-radius: 0.75rem; padding: 1.5rem; margin-top: 2.5rem; border-left: 4px solid #924a28; }
    .bank-box h4 { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; color: #924a28; margin-bottom: 1rem; }
    .bank-row { display: flex; justify-content: space-between; font-size: 0.875rem; margin-bottom: 0.5rem; }
    .bank-value { font-weight: 700; font-family: 'Courier New', monospace; }
    .footer { margin-top: 3rem; border-top: 1px solid #f0ece6; padding-top: 1.5rem; text-align: center; font-size: 0.75rem; color: #9b8b82; line-height: 1.8; }
    @media print { body { background: #fff; } }
  </style>
</head>
<body>
<div class="page">
  <div class="header">
    <div class="logo">
      YogaSadhana
      <small>Studio & Tienda</small>
    </div>
    <div class="invoice-meta">
      <div class="invoice-num">${order.invoiceNumber}</div>
      <div class="invoice-date">Emitida: ${orderDate}</div>
      <span class="status-badge ${order.status === 'Pagado' || order.status === 'Enviado' || order.status === 'Entregado' ? 'status-paid' : 'status-pending'}">
        ${order.status === 'Pagado' ? '✓ Pagado' : order.status === 'Enviado' ? '✓ Enviado' : order.status === 'Entregado' ? '✓ Entregado' : '⏳ Pendiente de pago'}
      </span>
    </div>
  </div>

  <div class="parties">
    <div class="party">
      <h4>Emisor</h4>
      <p>
        <strong>YogaSadhana Studio S.L.</strong>
        Calle Dharma 14, 28001 Madrid<br>
        NIF: B-12345678<br>
        hola@yogasadhana.com
      </p>
    </div>
    <div class="party">
      <h4>Cliente</h4>
      <p>
        <strong>${order.customerInfo.firstName} ${order.customerInfo.lastName}</strong>
        ${order.customerInfo.address}<br>
        ${order.customerInfo.postalCode} ${order.customerInfo.city}<br>
        ${order.customerInfo.country}<br>
        ${order.customerInfo.email}
      </p>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="text-align:left;padding-left:0;">Descripción</th>
        <th>Cant.</th>
        <th>Precio</th>
        <th>Importe</th>
      </tr>
    </thead>
    <tbody>${itemRows}</tbody>
  </table>

  <div class="totals">
    <div class="totals-row"><span>Base imponible:</span><span>${this.formatCurrency(baseAmount)}</span></div>
    <div class="totals-row"><span>IVA (21%):</span><span>${this.formatCurrency(taxAmount)}</span></div>
    <div class="totals-row"><span>Gastos de envío:</span><span>${order.shippingCost === 0 ? 'Gratis' : this.formatCurrency(order.shippingCost)}</span></div>
    <div class="totals-row total"><span>TOTAL:</span><span>${this.formatCurrency(order.total)}</span></div>
  </div>

  ${order.status === 'Pendiente_Pago' ? `
  <div class="bank-box">
    <h4>📌 Datos para la Transferencia Bancaria</h4>
    <div class="bank-row"><span>Beneficiario:</span><span class="bank-value">${order.bankTransferInfo.beneficiary}</span></div>
    <div class="bank-row"><span>IBAN:</span><span class="bank-value">${order.bankTransferInfo.iban}</span></div>
    <div class="bank-row"><span>Referencia (obligatoria):</span><span class="bank-value">${order.bankTransferInfo.reference}</span></div>
    <div class="bank-row"><span>Importe exacto:</span><span class="bank-value">${this.formatCurrency(order.total)}</span></div>
    <div class="bank-row"><span>Plazo de pago:</span><span>${new Date(order.bankTransferInfo.deadline).toLocaleDateString('es-ES', { day:'numeric', month:'long', year:'numeric' })}</span></div>
  </div>` : ''}

  <div class="footer">
    YogaSadhana Studio S.L. — Calle Dharma 14, 28001 Madrid — NIF B-12345678<br>
    Factura generada automáticamente el ${new Date().toLocaleDateString('es-ES')}
    ${order.paidAt ? ` · Pago recibido el ${paidDate}` : ''}
  </div>
</div>
</body>
</html>`;
  }

  /** Abre la factura en una nueva pestaña del navegador */
  openInvoiceInNewTab(order: Order): void {
    const html = this.generateInvoiceHtml(order);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  }

  private formatCurrency(value: number): string {
    return value.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
  }
}
