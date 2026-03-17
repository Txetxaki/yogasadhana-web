import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { environment } from '../../../environments/environment';

export interface YogaUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  avatar?: string;
  joinDate: string;
  favoriteStyle?: string;
}

// Firebase project-level admin emails
const ADMIN_EMAILS = ['admin@yogasadhana.xyz', 'raquel@yogasadhana.xyz'];

// Initialize Firebase (lazy singleton)
let _auth: Auth | null = null;
function getFirebaseAuth(): Auth {
  if (!_auth) {
    const app = initializeApp(environment.firebase);
    _auth = getAuth(app);
  }
  return _auth;
}

function firebaseUserToYoga(user: FirebaseUser): YogaUser {
  const email = user.email ?? '';
  const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase());
  return {
    id: user.uid,
    email,
    name: user.displayName ?? email.split('@')[0],
    role: isAdmin ? 'admin' : 'user',
    avatar: (user.displayName ?? email)
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2),
    joinDate: user.metadata.creationTime
      ? new Date(user.metadata.creationTime).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    favoriteStyle: undefined,
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);

  private _currentUser = signal<YogaUser | null>(null);
  private _loading = signal<boolean>(true);

  readonly currentUser = this._currentUser.asReadonly();
  readonly isLoading = this._loading.asReadonly();
  readonly isLoggedIn = computed(() => this._currentUser() !== null);
  readonly isAdmin = computed(() => this._currentUser()?.role === 'admin');
  readonly isUser = computed(() => this._currentUser()?.role === 'user');

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const auth = getFirebaseAuth();
      onAuthStateChanged(auth, (fbUser) => {
        this._currentUser.set(fbUser ? firebaseUserToYoga(fbUser) : null);
        this._loading.set(false);
      });
    } else {
      this._loading.set(false);
    }
  }

  async login(
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const auth = getFirebaseAuth();
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (err: unknown) {
      return {
        success: false,
        error: this.mapFirebaseError(err),
      };
    }
  }

  async logout(): Promise<void> {
    const auth = getFirebaseAuth();
    await signOut(auth);
    this._currentUser.set(null);
    this.router.navigate(['/yoga-sadhana']);
  }

  async register(data: {
    name: string;
    email: string;
    password: string;
    favoriteStyle: string;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const auth = getFirebaseAuth();
      const cred = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      await updateProfile(cred.user, { displayName: data.name });
      return { success: true };
    } catch (err: unknown) {
      return {
        success: false,
        error: this.mapFirebaseError(err),
      };
    }
  }

  private mapFirebaseError(err: unknown): string {
    const code = (err as { code?: string }).code ?? '';
    const map: Record<string, string> = {
      'auth/invalid-email': 'El correo no tiene un formato válido.',
      'auth/user-not-found': 'No existe una cuenta con ese correo.',
      'auth/wrong-password': 'Contraseña incorrecta.',
      'auth/invalid-credential': 'Email o contraseña incorrectos.',
      'auth/email-already-in-use': 'Ya existe una cuenta con ese correo.',
      'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
      'auth/too-many-requests': 'Demasiados intentos. Espera un momento.',
      'auth/network-request-failed': 'Error de red. Comprueba tu conexión.',
    };
    return map[code] ?? 'Ha ocurrido un error. Inténtalo de nuevo.';
  }
}
