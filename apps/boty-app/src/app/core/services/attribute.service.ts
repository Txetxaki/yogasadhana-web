import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { GlobalAttribute } from '../models/attribute.model';

@Injectable({
  providedIn: 'root'
})
export class AttributeService {
  private firestore = inject(Firestore);
  private attributesCollection = collection(this.firestore, 'attributes');

  getAttributes(): Observable<GlobalAttribute[]> {
    return collectionData(this.attributesCollection, { idField: 'id' }) as Observable<GlobalAttribute[]>;
  }

  getAttribute(id: string): Observable<GlobalAttribute> {
    const docRef = doc(this.firestore, `attributes/${id}`);
    return docData(docRef, { idField: 'id' }) as Observable<GlobalAttribute>;
  }

  addAttribute(attribute: Omit<GlobalAttribute, 'id'>): Promise<any> {
    return addDoc(this.attributesCollection, attribute);
  }

  updateAttribute(id: string, data: Partial<GlobalAttribute>): Promise<void> {
    const docRef = doc(this.firestore, `attributes/${id}`);
    return updateDoc(docRef, data);
  }

  deleteAttribute(id: string): Promise<void> {
    const docRef = doc(this.firestore, `attributes/${id}`);
    return deleteDoc(docRef);
  }
}
