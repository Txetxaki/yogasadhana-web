import { Injectable, inject } from '@angular/core';
import {
  Firestore, collection, collectionData, doc, docData,
  addDoc, updateDoc, deleteDoc, query, where, getDocs, writeBatch
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Address } from '../models/address.model';

@Injectable({ providedIn: 'root' })
export class AddressService {
  private firestore = inject(Firestore);
  private addressesCollection = collection(this.firestore, 'addresses');

  getUserAddresses(userId: string): Observable<Address[]> {
    const q = query(this.addressesCollection, where('userId', '==', userId));
    return collectionData(q, { idField: 'id' }) as Observable<Address[]>;
  }

  getAddress(id: string): Observable<Address> {
    return docData(doc(this.firestore, `addresses/${id}`), { idField: 'id' }) as Observable<Address>;
  }

  async addAddress(addressData: Omit<Address, 'id' | 'createdAt'>): Promise<string> {
    // Si es la primera u obligada a ser default, quitamos defaults previos
    if (addressData.isDefault) {
      await this.unsetOtherDefaults(addressData.userId);
    }
    const docRef = await addDoc(this.addressesCollection, {
      ...addressData,
      createdAt: Date.now()
    });
    return docRef.id;
  }

  async updateAddress(id: string, updates: Partial<Address>): Promise<void> {
    if (updates.isDefault && updates.userId) {
       await this.unsetOtherDefaults(updates.userId, id);
    }
    return updateDoc(doc(this.firestore, `addresses/${id}`), updates as Record<string, unknown>);
  }

  deleteAddress(id: string): Promise<void> {
    return deleteDoc(doc(this.firestore, `addresses/${id}`));
  }

  async setDefaultAddress(userId: string, addressId: string): Promise<void> {
    await this.unsetOtherDefaults(userId, addressId);
    return updateDoc(doc(this.firestore, `addresses/${addressId}`), { isDefault: true });
  }

  private async unsetOtherDefaults(userId: string, excludeId?: string): Promise<void> {
    const q = query(this.addressesCollection, where('userId', '==', userId), where('isDefault', '==', true));
    const snapshot = await getDocs(q);
    const batch = writeBatch(this.firestore);
    
    snapshot.docs.forEach(docSnap => {
      // Ignoramos el id exluido si es que lo hay (evita quitarle el default a la misma direcición si se está actualizando)
      if (docSnap.id !== excludeId) {
        batch.update(docSnap.ref, { isDefault: false });
      }
    });

    await batch.commit();
  }
}
