import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Order } from '../models/order.model';
import { InvoiceService } from './invoice.service';

@Injectable({ providedIn: 'root' })
export class EmailService {
  private http = inject(HttpClient);
  private invoiceService = inject(InvoiceService);

  private readonly FROM = `YogaSadhana <${environment.shopEmail}>`;
  private readonly ADMIN = environment.adminEmail;
  private readonly API_KEY = environment.resendApiKey;

  /** Envía un email genérico via Resend. En dev, loguea en consola si no hay API key. */
  private async send(to: string, subject: string, html: string): Promise<void> {
    if (!this.API_KEY || this.API_KEY === 'RESEND_API_KEY_HERE') {
      console.group(`📧 EMAIL (simulado — añade tu Resend API key para enviar realmente)`);
      console.log(`TO: ${to}`);
      console.log(`SUBJECT: ${subject}`);
      console.log(`BODY (HTML):`, html.substring(0, 300) + '...');
      console.groupEnd();
      return;
    }

    const body = { from: this.FROM, to, subject, html };
    await firstValueFrom(
      this.http.post('https://api.resend.com/emails', body, {
        headers: new HttpHeaders({ Authorization: `Bearer ${this.API_KEY}`, 'Content-Type': 'application/json' })
      })
    );
  }

  // ── Plantillas ──────────────────────────────────────────────────────────

  /** Email al cliente: pedido creado, pendiente de pago por transferencia */
  async sendOrderConfirmation(order: Order): Promise<void> {
    const subject = `Pedido ${order.invoiceNumber} recibido — Pendiente de pago`;
    const itemsHtml = order.items.map(i => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #f0ece6;">${i.productName} × ${i.quantity}</td>
        <td style="padding:8px 0;border-bottom:1px solid #f0ece6;text-align:right;">${this.fmt(i.price * i.quantity)}</td>
      </tr>`).join('');

    const deadline = new Date(order.bankTransferInfo.deadline).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

    const html = this.wrapEmail(`
      <h2 style="color:#924a28;margin-bottom:0.5rem;">Pedido recibido con éxito</h2>
      <p style="color:#54433c;margin-bottom:1.5rem;">Hola <strong>${order.customerInfo.firstName}</strong>, hemos recibido tu pedido y está pendiente de confirmación de pago.</p>

      <div style="background:#f7f3ee;border-radius:0.75rem;padding:1.25rem;margin-bottom:1.5rem;">
        <div style="display:flex;justify-content:space-between;margin-bottom:0.5rem;">
          <span style="color:#9b8b82;font-size:0.85rem;">Nº Pedido</span>
          <strong>${order.invoiceNumber}</strong>
        </div>
        <div style="display:flex;justify-content:space-between;">
          <span style="color:#9b8b82;font-size:0.85rem;">Total</span>
          <strong style="color:#924a28;font-size:1.1rem;">${this.fmt(order.total)}</strong>
        </div>
      </div>

      <table style="width:100%;border-collapse:collapse;margin-bottom:1.5rem;">
        <tbody>${itemsHtml}</tbody>
      </table>

      <div style="background:#fff;border:2px solid #924a28;border-radius:0.75rem;padding:1.5rem;margin-bottom:1.5rem;">
        <h3 style="color:#924a28;margin-bottom:1rem;font-size:1rem;">📌 Datos para la transferencia</h3>
        <p style="margin-bottom:0.5rem;font-size:0.9rem;"><strong>Beneficiario:</strong> ${order.bankTransferInfo.beneficiary}</p>
        <p style="margin-bottom:0.5rem;font-size:0.9rem;"><strong>IBAN:</strong> <code style="background:#f7f3ee;padding:2px 6px;border-radius:4px;">${order.bankTransferInfo.iban}</code></p>
        <p style="margin-bottom:0.5rem;font-size:0.9rem;"><strong>Referencia (obligatoria):</strong> <code style="background:#f7f3ee;padding:2px 6px;border-radius:4px;color:#924a28;">${order.bankTransferInfo.reference}</code></p>
        <p style="margin-bottom:0;font-size:0.9rem;"><strong>Importe exacto:</strong> ${this.fmt(order.total)}</p>
        <p style="margin-top:0.75rem;padding:0.6rem;background:#fef9c3;border-radius:0.5rem;font-size:0.8rem;color:#854d0e;">
          ⏳ Realiza la transferencia antes del <strong>${deadline}</strong>. Incluye siempre la referencia.
        </p>
      </div>

      <p style="font-size:0.85rem;color:#9b8b82;">Una vez confirmemos el pago, recibirás tu factura y confirmación de envío. Si tienes dudas, escríbenos a <a href="mailto:${environment.shopEmail}" style="color:#924a28;">${environment.shopEmail}</a>.</p>
    `);

    await this.send(order.customerInfo.email, subject, html);
  }

  /** Email al cliente: pago confirmado + factura adjunta */
  async sendPaymentConfirmed(order: Order): Promise<void> {
    const subject = `✅ Pago confirmado — ${order.invoiceNumber}`;
    const invoiceHtml = this.invoiceService.generateInvoiceHtml(order);

    const html = this.wrapEmail(`
      <h2 style="color:#166534;margin-bottom:0.5rem;">¡Pago confirmado!</h2>
      <p style="color:#54433c;margin-bottom:1.5rem;">Hola <strong>${order.customerInfo.firstName}</strong>, hemos confirmado la recepción de tu pago. Pronto comenzaremos a preparar tu pedido.</p>

      <div style="background:#dcfce7;border-radius:0.75rem;padding:1.25rem;margin-bottom:1.5rem;text-align:center;">
        <div style="font-size:2rem;margin-bottom:0.5rem;">✅</div>
        <strong style="color:#166534;font-size:1.1rem;">${order.invoiceNumber} — ${this.fmt(order.total)}</strong>
        <div style="color:#166534;margin-top:0.25rem;font-size:0.85rem;">Pago recibido el ${new Date(order.paidAt!).toLocaleDateString('es-ES')}</div>
      </div>

      <p style="font-size:0.9rem;color:#54433c;margin-bottom:1rem;">Tu factura está adjunta a continuación. También puedes acceder a tu historial de pedidos en tu perfil.</p>
      <p style="font-size:0.85rem;color:#9b8b82;">¿Alguna pregunta? Escríbenos a <a href="mailto:${environment.shopEmail}" style="color:#924a28;">${environment.shopEmail}</a></p>
    `);

    await this.send(order.customerInfo.email, subject, html);
  }

  /** Email al cliente: pedido enviado con tracking */
  async sendOrderShipped(order: Order): Promise<void> {
    const subject = `🚚 Tu pedido está en camino — ${order.invoiceNumber}`;
    const html = this.wrapEmail(`
      <h2 style="color:#924a28;margin-bottom:0.5rem;">¡Tu pedido está en camino!</h2>
      <p style="color:#54433c;margin-bottom:1.5rem;">Hola <strong>${order.customerInfo.firstName}</strong>, tu pedido ha sido enviado y está en camino.</p>

      ${order.trackingNumber ? `
      <div style="background:#f7f3ee;border-radius:0.75rem;padding:1.25rem;margin-bottom:1.5rem;text-align:center;">
        <div style="font-size:0.8rem;color:#9b8b82;margin-bottom:0.25rem;text-transform:uppercase;letter-spacing:0.05em;">Número de seguimiento</div>
        <div style="font-size:1.25rem;font-weight:700;font-family:monospace;color:#924a28;">${order.trackingNumber}</div>
      </div>` : ''}

      <p style="font-size:0.875rem;color:#54433c;">El paquete se entregará en: <strong>${order.customerInfo.address}, ${order.customerInfo.city}</strong></p>
      <p style="margin-top:1rem;font-size:0.85rem;color:#9b8b82;">¿Necesitas ayuda? Escríbenos a <a href="mailto:${environment.shopEmail}" style="color:#924a28;">${environment.shopEmail}</a></p>
    `);

    await this.send(order.customerInfo.email, subject, html);
  }

  /** Email al admin: nuevo pedido recibido */
  async sendAdminNewOrder(order: Order): Promise<void> {
    const subject = `🛒 Nuevo pedido — ${order.invoiceNumber} (${this.fmt(order.total)})`;
    const itemsList = order.items.map(i => `• ${i.productName} × ${i.quantity} = ${this.fmt(i.price * i.quantity)}`).join('\n');

    const html = this.wrapEmail(`
      <h2 style="color:#924a28;">Nuevo pedido recibido</h2>
      <p><strong>${order.invoiceNumber}</strong> · ${this.fmt(order.total)} · Transferencia bancaria</p>

      <div style="background:#f7f3ee;border-radius:0.75rem;padding:1.25rem;margin:1rem 0;">
        <strong>Cliente:</strong> ${order.customerInfo.firstName} ${order.customerInfo.lastName}<br>
        <strong>Email:</strong> <a href="mailto:${order.customerInfo.email}" style="color:#924a28;">${order.customerInfo.email}</a><br>
        <strong>Teléfono:</strong> ${order.customerInfo.phone}<br>
        <strong>Dirección:</strong> ${order.customerInfo.address}, ${order.customerInfo.postalCode} ${order.customerInfo.city}
      </div>

      <div style="background:#fff;border:1px solid #e0d6cc;border-radius:0.75rem;padding:1.25rem;margin:1rem 0;">
        <strong>Artículos:</strong>
        <pre style="font-family:inherit;margin:0.5rem 0;color:#54433c;font-size:0.875rem;">${itemsList}</pre>
        <strong style="color:#924a28;">Total: ${this.fmt(order.total)}</strong>
      </div>

      <p style="color:#9b8b82;font-size:0.85rem;">La referencia de pago es: <code style="background:#f7f3ee;padding:2px 8px;border-radius:4px;">${order.bankTransferInfo.reference}</code></p>
      <p style="font-size:0.85rem;">Gestiona el pedido desde el <a href="https://yogasadhana-web-agency.web.app/yoga-sadhana/admin/tienda/pedidos" style="color:#924a28;">panel de administración</a>.</p>
    `);

    await this.send(this.ADMIN, subject, html);
  }

  // ── Email wrapper (same branded header/footer) ──────────────────────────
  private wrapEmail(content: string): string {
    return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#faf8f5;font-family:Georgia,serif;">
  <div style="max-width:600px;margin:0 auto;padding:2rem 1rem;">
    <!-- Header -->
    <div style="text-align:center;padding:2rem 0 1.5rem;border-bottom:3px solid #924a28;margin-bottom:2rem;">
      <div style="font-size:1.75rem;font-weight:700;color:#924a28;letter-spacing:-0.02em;">YogaSadhana</div>
      <div style="font-size:0.7rem;color:#9b8b82;letter-spacing:0.15em;text-transform:uppercase;margin-top:0.25rem;">Studio & Tienda</div>
    </div>

    <!-- Content -->
    <div style="background:#fff;border-radius:1rem;padding:2rem;border:1px solid #e8e1da;">
      ${content}
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding:2rem 0;font-size:0.75rem;color:#9b8b82;line-height:2;">
      YogaSadhana Studio S.L. · Calle Dharma 14, 28001 Madrid<br>
      <a href="mailto:${environment.shopEmail}" style="color:#924a28;text-decoration:none;">${environment.shopEmail}</a>
      · <a href="https://yogasadhana-web-agency.web.app" style="color:#924a28;text-decoration:none;">yogasadhana.com</a>
    </div>
  </div>
</body>
</html>`;
  }

  private fmt(v: number): string {
    return v.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
  }
}
