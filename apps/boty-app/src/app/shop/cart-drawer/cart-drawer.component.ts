import { Component, inject, effect } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartService } from '../../core/services/cart/cart.service';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe],
  template: `
    <!-- Overlay -->
    @if (cart.isDrawerOpen()) {
      <div class="cart-overlay" (click)="cart.closeDrawer()"></div>
    }

    <!-- Drawer -->
    <aside class="cart-drawer" [class.open]="cart.isDrawerOpen()">
      <div class="drawer-header">
        <h2 class="drawer-title">Tu Bolsa <span class="cart-count">({{ cart.totalItems() }})</span></h2>
        <button class="btn-close" (click)="cart.closeDrawer()" aria-label="Cerrar bolsa">
          <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
            <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <div class="drawer-content">
        @if (cart.cartItems().length === 0) {
          <div class="cart-empty">
            <p class="cart-empty-text">Tu bolsa está vacía.</p>
            <button class="btn-discover" (click)="goToShop()">Explorar Tienda</button>
          </div>
        } @else {
          <ul class="cart-items">
            @for (item of cart.cartItems(); track item.product.id) {
              <li class="cart-item">
                <a [routerLink]="['/yoga-sadhana/tienda', item.product.id]" class="item-img-link" (click)="cart.closeDrawer()">
                  <img [src]="item.product.thumbnail" [alt]="item.product.name" class="item-img">
                </a>
                <div class="item-info">
                  <div class="item-header">
                    <a [routerLink]="['/yoga-sadhana/tienda', item.product.id]" class="item-name" (click)="cart.closeDrawer()">
                      {{ item.product.name }}
                    </a>
                    <button class="btn-remove" (click)="cart.removeFromCart(item.product.id)" aria-label="Eliminar item">
                      <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      </svg>
                    </button>
                  </div>
                  <div class="item-price">{{ item.product.price | currency:'EUR' }}</div>
                  
                  <div class="item-actions">
                    <div class="qty-control">
                      <button class="qty-btn" (click)="cart.updateQuantity(item.product.id, item.quantity - 1)" [disabled]="item.quantity <= 1">-</button>
                      <span class="qty-display">{{ item.quantity }}</span>
                      <button class="qty-btn" (click)="cart.updateQuantity(item.product.id, item.quantity + 1)">+</button>
                    </div>
                  </div>
                </div>
              </li>
            }
          </ul>
        }
      </div>

      @if (cart.cartItems().length > 0) {
        <div class="drawer-footer">
          <div class="summary-line total-line">
            <span class="total-label">Subtotal</span>
            <span class="total-amount">{{ cart.subtotal() | currency:'EUR' }}</span>
          </div>
          <p class="shipping-note">Impuestos incluidos. Envío calculado en el checkout.</p>
          <button class="btn-checkout" (click)="goToCart()">
            Ver Carrito
            <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      }
    </aside>
  `,
  styleUrls: ['./cart-drawer.component.css']
})
export class CartDrawerComponent {
  cart = inject(CartService);
  router = inject(Router);

  goToCart() {
    this.cart.closeDrawer();
    this.router.navigate(['/yoga-sadhana/carrito']);
  }

  goToShop() {
    this.cart.closeDrawer();
    this.router.navigate(['/yoga-sadhana/tienda']);
  }
}
