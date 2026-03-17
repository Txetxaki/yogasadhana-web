import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';

export interface YogaUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  avatar?: string;
  joinDate: string;
  favoriteStyle?: string;
}

const MOCK_USERS: Array<YogaUser & { password: string }> = [
  {
    id: 'admin-001',
    email: 'admin@yogasadhana.xyz',
    password: 'admin123',
    name: 'Raquel García',
    role: 'admin',
    avatar: 'RG',
    joinDate: '2020-01-15',
    favoriteStyle: 'Hatha Yoga',
  },
  {
    id: 'user-001',
    email: 'alumna@yogasadhana.xyz',
    password: 'yoga123',
    name: 'Laura Martínez',
    role: 'user',
    avatar: 'LM',
    joinDate: '2024-09-10',
    favoriteStyle: 'Vinyasa Flow',
  },
  {
    id: 'user-002',
    email: 'maria@yogasadhana.xyz',
    password: 'yoga123',
    name: 'María Sánchez',
    role: 'user',
    avatar: 'MS',
    joinDate: '2025-01-20',
    favoriteStyle: 'Yin Yoga',
  },
];

const STORAGE_KEY = 'ys_session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _currentUser = signal<YogaUser | null>(this.loadSession());

  readonly currentUser = this._currentUser.asReadonly();
  readonly isLoggedIn = computed(() => this._currentUser() !== null);
  readonly isAdmin = computed(() => this._currentUser()?.role === 'admin');
  readonly isUser = computed(() => this._currentUser()?.role === 'user');

  constructor(private router: Router) {}

  login(email: string, password: string): { success: boolean; error?: string } {
    const found = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) {
      return { success: false, error: 'Email o contraseña incorrectos.' };
    }
    const { password: _pwd, ...user } = found;
    this._currentUser.set(user);
    this.saveSession(user);
    return { success: true };
  }

  logout(): void {
    this._currentUser.set(null);
    sessionStorage.removeItem(STORAGE_KEY);
    this.router.navigate(['/yoga-sadhana/login']);
  }

  register(data: {
    name: string;
    email: string;
    password: string;
    favoriteStyle: string;
  }): { success: boolean; error?: string } {
    const exists = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === data.email.toLowerCase()
    );
    if (exists) {
      return { success: false, error: 'Ya existe una cuenta con ese email.' };
    }
    const newUser: YogaUser = {
      id: `user-${Date.now()}`,
      email: data.email,
      name: data.name,
      role: 'user',
      avatar: data.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2),
      joinDate: new Date().toISOString().split('T')[0],
      favoriteStyle: data.favoriteStyle,
    };
    MOCK_USERS.push({ ...newUser, password: data.password });
    this._currentUser.set(newUser);
    this.saveSession(newUser);
    return { success: true };
  }

  private saveSession(user: YogaUser): void {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }

  private loadSession(): YogaUser | null {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as YogaUser) : null;
    } catch {
      return null;
    }
  }
}
