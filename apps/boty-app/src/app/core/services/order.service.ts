import { Injectable, inject } from '@angular/core';
import {
  Firestore, collection, collectionData, doc, docData,
  addDoc, updateDoc, deleteDoc, query, orderBy, where, getDocs
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Order, OrderStatus } from '../models/order.model';

const BANK_IBAN = 'ES91 2100 0418 4502 0005 1332';
const BANK_BENEFICIARY = 'YogaSadhana Studio S.L.';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private firestore = inject(Firestore);
  private ordersCollection = collection(this.firestore, 'orders');

  // ── Reads ──────────────────────────────────────────────────────────────
  getOrders(): Observable<Order[]> {
    const q = query(this.ordersCollection, orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Order[]>;
  }

  getOrder(id: string): Observable<Order> {
    return docData(doc(this.firestore, `orders/${id}`), { idField: 'id' }) as Observable<Order>;
  }

  getOrdersByUser(userId: string): Observable<Order[]> {
    const q = query(this.ordersCollection, where('userId', '==', userId));
    return (collectionData(q, { idField: 'id' }) as Observable<Order[]>).pipe(
      map(orders => orders.sort((a, b) => b.createdAt - a.createdAt))
    );
  }

  // ── Create ─────────────────────────────────────────────────────────────
  async createOrder(orderData: Omit<Order, 'id' | 'invoiceNumber' | 'paymentReference' | 'createdAt' | 'bankTransferInfo'>): Promise<string> {
    const invoiceNumber = await this.generateInvoiceNumber();
    const paymentReference = this.generatePaymentReference(invoiceNumber);
    const deadline = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(); // 5 días

    const fullOrder: Omit<Order, 'id'> = {
      ...orderData,
      invoiceNumber,
      paymentReference,
      createdAt: Date.now(),
      status: 'Pendiente_Pago',
      paymentMethod: 'Transferencia',
      bankTransferInfo: {
        iban: BANK_IBAN,
        beneficiary: BANK_BENEFICIARY,
        reference: paymentReference,
        deadline,
      },
    };

    const docRef = await addDoc(this.ordersCollection, fullOrder);
    return docRef.id;
  }

  // ── Update ─────────────────────────────────────────────────────────────
  updateOrderStatus(id: string, status: OrderStatus, extra?: Partial<Order>): Promise<void> {
    const updates: Partial<Order> & { paidAt?: number; shippedAt?: number } = { status, ...extra };
    if (status === 'Pagado') updates.paidAt = Date.now();
    if (status === 'Enviado') updates.shippedAt = Date.now();
    return updateDoc(doc(this.firestore, `orders/${id}`), updates as Record<string, unknown>);
  }

  updateAdminNotes(id: string, adminNotes: string): Promise<void> {
    return updateDoc(doc(this.firestore, `orders/${id}`), { adminNotes });
  }

  updateTracking(id: string, trackingNumber: string): Promise<void> {
    return updateDoc(doc(this.firestore, `orders/${id}`), { trackingNumber });
  }

  saveInvoiceHtml(id: string, invoiceHtml: string): Promise<void> {
    return updateDoc(doc(this.firestore, `orders/${id}`), { invoiceHtml });
  }

  markEmailSent(id: string): Promise<void> {
    return updateDoc(doc(this.firestore, `orders/${id}`), { emailSent: true });
  }

  // ── Delete ─────────────────────────────────────────────────────────────
  deleteOrder(id: string): Promise<void> {
    return deleteDoc(doc(this.firestore, `orders/${id}`));
  }

  // ── Helpers ────────────────────────────────────────────────────────────
  private async generateInvoiceNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const snap = await getDocs(this.ordersCollection);
    const count = snap.size + 1;
    return `YS-${year}-${String(count).padStart(4, '0')}`;
  }

  private generatePaymentReference(invoiceNumber: string): string {
    const code = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `YS-REF-${code}`;
  }
}
