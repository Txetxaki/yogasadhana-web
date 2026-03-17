import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartService } from '../../core/services/cart/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class Cart {
  cartService = inject(CartService);
  private router = inject(Router);

  get cartItems() {
    return this.cartService.cartItems;
  }

  get cartTotal() {
    return this.cartService.subtotal;
  }

  get cartCount() {
    return this.cartService.totalItems;
  }

  updateQuantity(productId: string, newQuantity: number) {
    if (newQuantity > 0) {
      this.cartService.updateQuantity(productId, newQuantity);
    }
  }

  removeItem(productId: string) {
    this.cartService.removeFromCart(productId);
  }

  clearCart() {
    if (confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
      this.cartService.clearCart();
    }
  }

  proceedToCheckout() {
    // Basic implementation: simulate checkout for now
    if (this.cartCount() > 0) {
      alert('Implementación de Pasarela de Pago (Stripe/Paypal) iría aquí. Redirigiendo a checkout...');
      // this.router.navigate(['/tienda/checkout']);
    }
  }
}
