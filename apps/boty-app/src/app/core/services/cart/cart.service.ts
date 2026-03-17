import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../../models/product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // Using Signals for maximum reactivity
  private cartItemsSignal = signal<CartItem[]>([]);
  
  // Public readonly access
  cartItems = this.cartItemsSignal.asReadonly();
  
  // Computed values
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

  private saveToLocalStorage() {
    try {
      localStorage.setItem('yogasadhana_cart', JSON.stringify(this.cartItemsSignal()));
    } catch (e) {
      console.warn('Could not save cart to local storage', e);
    }
  }

  private loadFromLocalStorage() {
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
