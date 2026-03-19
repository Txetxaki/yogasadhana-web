import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Product } from '../../models/product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  private cartItemsSignal = signal<CartItem[]>([]);
  private isDrawerOpenSignal = signal<boolean>(false);

  cartItems = this.cartItemsSignal.asReadonly();
  isDrawerOpen = this.isDrawerOpenSignal.asReadonly();

  totalItems = computed(() => this.cartItemsSignal().reduce((acc, item) => acc + item.quantity, 0));
  subtotal = computed(() => this.cartItemsSignal().reduce((acc, item) => acc + (item.product.price * item.quantity), 0));

  constructor() {
    this.loadFromLocalStorage();
  }

  addToCart(product: Product, quantity: number = 1) {
    this.cartItemsSignal.update(items => {
      const existing = items.find(i => i.product.id === product.id);
      if (existing) {
        return items.map(i => i.product.id === product.id
          ? { ...i, quantity: i.quantity + quantity }
          : i
        );
      }
      return [...items, { product, quantity }];
    });
    this.saveToLocalStorage();
    this.openDrawer();
  }

  removeFromCart(productId: string) {
    this.cartItemsSignal.update(items => items.filter(i => i.product.id !== productId));
    this.saveToLocalStorage();
  }

  updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    this.cartItemsSignal.update(items =>
      items.map(i => i.product.id === productId ? { ...i, quantity } : i)
    );
    this.saveToLocalStorage();
  }

  clearCart() {
    this.cartItemsSignal.set([]);
    this.saveToLocalStorage();
  }

  openDrawer() {
    this.isDrawerOpenSignal.set(true);
    if (this.isBrowser) document.body.style.overflow = 'hidden';
  }

  closeDrawer() {
    this.isDrawerOpenSignal.set(false);
    if (this.isBrowser) document.body.style.overflow = '';
  }

  toggleDrawer() {
    if (this.isDrawerOpenSignal()) {
      this.closeDrawer();
    } else {
      this.openDrawer();
    }
  }

  private saveToLocalStorage() {
    if (!this.isBrowser) return;
    try {
      localStorage.setItem('yogasadhana_cart', JSON.stringify(this.cartItemsSignal()));
    } catch (e) {
      console.warn('Could not save cart to local storage', e);
    }
  }

  private loadFromLocalStorage() {
    if (!this.isBrowser) return;
    try {
      const saved = localStorage.getItem('yogasadhana_cart');
      if (saved) {
        this.cartItemsSignal.set(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Could not load cart from local storage', e);
    }
  }
}
