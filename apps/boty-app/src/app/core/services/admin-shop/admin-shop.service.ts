import { Injectable, inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Firestore, collection, doc, collectionData, docData, setDoc, deleteDoc, updateDoc } from '@angular/fire/firestore';
import { Product } from '../../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class AdminShopService {
  private firestore: Firestore = inject(Firestore);

  // Reference to the 'products' collection
  private get productsCollection() {
    return collection(this.firestore, 'products');
  }

  // Get all products
  getProductsForAdmin(): Observable<Product[]> {
    return collectionData(this.productsCollection, { idField: 'id' }).pipe(
      map(data => data as Product[])
    );
  }

  // Add a new product
  addProduct(product: Partial<Product>): Promise<void> {
    const newDocRef = doc(this.productsCollection); // Auto-generates an ID
    const productWithId = { ...product, id: newDocRef.id };
    return setDoc(newDocRef, productWithId);
  }

  // Update an existing product
  updateProduct(id: string, productData: Partial<Product>): Promise<void> {
    const docRef = doc(this.firestore, `products/${id}`);
    return updateDoc(docRef, productData);
  }

  // Delete a product
  deleteProduct(id: string): Promise<void> {
    const docRef = doc(this.firestore, `products/${id}`);
    return deleteDoc(docRef);
  }
}
