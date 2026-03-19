import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { environment } from '../../../environments/environment';
import { initializeApp, getApp, getApps } from 'firebase/app';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  joinDate: string;
  favoriteStyle?: string;
  classesAttended: number;
  status: 'activa' | 'inactiva' | 'bono';
  phone?: string;
  initials?: string;
}

// Lazy singleton
let _db: Firestore | null = null;
function getDb(): Firestore {
  if (!_db) {
    const app = !getApps().length ? initializeApp(environment.firebase) : getApp();
    _db = getFirestore(app);
  }
  return _db;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  
  // Guardar un usuario nuevo o actualizar al hacer login con Google
  async saveUser(user: Partial<UserProfile> & { id: string, email: string }): Promise<void> {
    const db = getDb();
    const docRef = doc(db, 'users', user.id);
    const snap = await getDoc(docRef);
    
    if (!snap.exists()) {
      // Crear base
      const initials = (user.name || user.email).split(' ').map(n => n.charAt(0)).join('').toUpperCase().substring(0, 2);
      await setDoc(docRef, {
        id: user.id,
        email: user.email,
        name: user.name || user.email.split('@')[0],
        role: user.role || 'user',
        joinDate: user.joinDate || new Date().toISOString().split('T')[0],
        favoriteStyle: user.favoriteStyle || 'Hatha Yoga',
        classesAttended: 0,
        status: 'activa',
        initials
      } as UserProfile);
    } else if (user.name && snap.data()['name'] !== user.name) {
      // Solo actualizar nombre si cambió
      await updateDoc(docRef, { name: user.name });
    }
  }

  // Obtener todos los usuarios
  async getAllUsers(): Promise<UserProfile[]> {
    console.log('[UserService] getAllUsers iniciando...');
    const db = getDb();
    const colRef = collection(db, 'users');
    
    // Si Firestore está colgado offline, throw error en 5 segundos
    const snapPromise = getDocs(colRef);
    const timeoutPromise = new Promise<any>((_, reject) => setTimeout(() => reject(new Error('Timeout de Firestore (5s)')), 5000));
    
    console.log('[UserService] Esperando getDocs...');
    const snap = await Promise.race([snapPromise, timeoutPromise]);
    
    console.log('[UserService] getDocs completado. Documentos:', snap.docs?.length);
    const users = snap.docs.map((doc: any) => doc.data() as UserProfile);
    // Sort localmente para evitar ocultar documentos sin joinDate
    return (users as UserProfile[]).sort((a: UserProfile, b: UserProfile) => {
      const dateA = a.joinDate || '';
      const dateB = b.joinDate || '';
      return dateB.localeCompare(dateA);
    });
  }

  // Actualizar perfil desde admin
  async updateUser(id: string, data: Partial<UserProfile>): Promise<void> {
    const db = getDb();
    const docRef = doc(db, 'users', id);
    // Si cambia el nombre, actualizar initials
    if (data.name) {
      data.initials = data.name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().substring(0, 2);
    }
    await updateDoc(docRef, data);
  }

  // Crear usuario manualmente desde admin (solo en Firestore, no en Firebase Auth)
  async createUser(data: UserProfile): Promise<void> {
    const db = getDb();
    const docRef = doc(db, 'users', data.id);
    data.initials = (data.name || data.email).split(' ').map(n => n.charAt(0)).join('').toUpperCase().substring(0, 2);
    await setDoc(docRef, data);
  }

  // Eliminar usuario desde admin (solo Firestore)
  async deleteUser(id: string): Promise<void> {
    const db = getDb();
    const docRef = doc(db, 'users', id);
    await deleteDoc(docRef);
  }
}
