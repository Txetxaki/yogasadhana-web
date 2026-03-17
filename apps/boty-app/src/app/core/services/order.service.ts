import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private firestore = inject(Firestore);
  private ordersCollection = collection(this.firestore, 'orders');

  getOrders(): Observable<Order[]> {
    return collectionData(this.ordersCollection, { idField: 'id' }) as Observable<Order[]>;
  }

  getOrder(id: string): Observable<Order> {
    const docRef = doc(this.firestore, `orders/${id}`);
    return docData(docRef, { idField: 'id' }) as Observable<Order>;
  }

  createOrder(order: Omit<Order, 'id'>): Promise<any> {
    return addDoc(this.ordersCollection, { ...order, createdAt: Date.now(), status: 'Pendiente' });
  }

  updateOrderStatus(id: string, newStatus: Order['status']): Promise<void> {
    const docRef = doc(this.firestore, `orders/${id}`);
    return updateDoc(docRef, { status: newStatus });
  }

  addTrackingNumber(id: string, trackingNumber: string): Promise<void> {
    const docRef = doc(this.firestore, `orders/${id}`);
    return updateDoc(docRef, { trackingNumber });
  }

  deleteOrder(id: string): Promise<void> {
    const docRef = doc(this.firestore, `orders/${id}`);
    return deleteDoc(docRef);
  }
}
