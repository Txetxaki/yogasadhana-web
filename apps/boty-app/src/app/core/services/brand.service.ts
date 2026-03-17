import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Brand } from '../models/brand.model';

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  private firestore = inject(Firestore);
  private brandsCollection = collection(this.firestore, 'brands');

  getBrands(): Observable<Brand[]> {
    return collectionData(this.brandsCollection, { idField: 'id' }) as Observable<Brand[]>;
  }

  getBrand(id: string): Observable<Brand> {
    const docRef = doc(this.firestore, `brands/${id}`);
    return docData(docRef, { idField: 'id' }) as Observable<Brand>;
  }

  addBrand(brand: Omit<Brand, 'id'>): Promise<any> {
    return addDoc(this.brandsCollection, { ...brand, createdAt: Date.now() });
  }

  updateBrand(id: string, data: Partial<Brand>): Promise<void> {
    const docRef = doc(this.firestore, `brands/${id}`);
    return updateDoc(docRef, data);
  }

  deleteBrand(id: string): Promise<void> {
    const docRef = doc(this.firestore, `brands/${id}`);
    return deleteDoc(docRef);
  }
}
