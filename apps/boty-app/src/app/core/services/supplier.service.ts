import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Supplier } from '../models/supplier.model';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private firestore = inject(Firestore);
  private suppliersCollection = collection(this.firestore, 'suppliers');

  getSuppliers(): Observable<Supplier[]> {
    return collectionData(this.suppliersCollection, { idField: 'id' }) as Observable<Supplier[]>;
  }

  getSupplier(id: string): Observable<Supplier> {
    const docRef = doc(this.firestore, `suppliers/${id}`);
    return docData(docRef, { idField: 'id' }) as Observable<Supplier>;
  }

  addSupplier(supplier: Omit<Supplier, 'id'>): Promise<any> {
    return addDoc(this.suppliersCollection, { ...supplier, createdAt: Date.now() });
  }

  updateSupplier(id: string, data: Partial<Supplier>): Promise<void> {
    const docRef = doc(this.firestore, `suppliers/${id}`);
    return updateDoc(docRef, data);
  }

  deleteSupplier(id: string): Promise<void> {
    const docRef = doc(this.firestore, `suppliers/${id}`);
    return deleteDoc(docRef);
  }
}
