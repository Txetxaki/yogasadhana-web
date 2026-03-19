import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../core/services/cart/cart.service';
import { OrderService } from '../../core/services/order.service';
import { EmailService } from '../../core/services/email.service';
import { Order } from '../../core/models/order.model';

import { AuthService } from '../../yoga-sadhana/auth/auth.service';
import { AddressService } from '../../core/services/address.service';
import { Address } from '../../core/models/address.model';

type CheckoutStep = 'auth' | 'form' | 'review' | 'confirmed';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit {
  private cart = inject(CartService);
  private orderService = inject(OrderService);
  private emailService = inject(EmailService);
  authService = inject(AuthService);
  private addressService = inject(AddressService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  cartItems = this.cart.cartItems;
  subtotal = this.cart.subtotal;
  shippingCost = computed(() => (this.subtotal() >= 60 ? 0 : 4.95));
  total = computed(() => +(this.subtotal() + this.shippingCost()).toFixed(2));
  tax = computed(() => +(this.total() - (this.total() / 1.21)).toFixed(2));

  step = signal<CheckoutStep>('auth');
  isSubmitting = signal(false);
  confirmedOrder = signal<Order | null>(null);
  savedAddresses = signal<Address[]>([]);
  selectedSavedAddressId = signal<string | null>(null);

  customerForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.minLength(9)]],
    address: ['', Validators.required],
    city: ['', Validators.required],
    postalCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
    country: ['España', Validators.required],
    dni: [''],
    saveAddressControl: [true],
    addressName: ['Dirección 1']
  });

  ngOnInit() {
    if (this.cartItems().length === 0) {
      this.router.navigate(['/yoga-sadhana/tienda']);
      return;
    }

    this.customerForm.valueChanges.subscribe(() => {
      this.selectedSavedAddressId.set(null);
    });

    if (this.authService.isLoggedIn()) {
      this.prefillForm();
      this.step.set('form');
    } else {
      this.step.set('auth');
    }
  }

  prefillForm() {
    const user = this.authService.currentUser();
    if (user) {
      const names = user.name ? user.name.split(' ') : [''];
      const firstName = names[0];
      const lastName = names.length > 1 ? names.slice(1).join(' ') : '';
      
      this.customerForm.patchValue({
        firstName: firstName,
        lastName: lastName,
        email: user.email,
      });

      this.addressService.getUserAddresses(user.id).subscribe(addresses => {
        this.savedAddresses.set(addresses);
        const def = addresses.find(a => a.isDefault);
        if (def) this.selectAddress(def);
      });
    }
  }

  selectAddress(addr: Address) {
    this.selectedSavedAddressId.set(addr.id);
    this.customerForm.patchValue({
      firstName: addr.firstName,
      lastName: addr.lastName,
      phone: addr.phone,
      address: addr.street,
      city: addr.city,
      postalCode: addr.postalCode,
      country: addr.country,
      dni: addr.dni || '',
      saveAddressControl: false,
    }, { emitEvent: false });
  }

  continueAsGuest() {
    this.step.set('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  loginAndReturn() {
    this.router.navigate(['/yoga-sadhana/login'], { queryParams: { returnUrl: '/yoga-sadhana/checkout' } });
  }

  goToReview() {
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      return;
    }
    this.step.set('review');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async placeOrder() {
    this.isSubmitting.set(true);
    try {
      const form = this.customerForm.value;
      const user = this.authService.currentUser();
      const items = this.cartItems().map(ci => ({
        productId: ci.product.id,
        productName: ci.product.name,
        quantity: ci.quantity,
        price: ci.product.price,
        thumbnail: ci.product.thumbnail,
      }));

      const payload: any = {
        customerInfo: form,
        items,
        subtotal: this.subtotal(),
        shippingCost: this.shippingCost(),
        tax: this.tax(),
        total: this.total(),
        status: 'Pendiente_Pago',
        paymentMethod: 'Transferencia',
      };
      
      if (user) {
        payload.userId = user.id;
      }

      const orderId = await this.orderService.createOrder(payload);

      // Save the address if the user is authenticated, checked the box, and hasn't selected an existing one
      if (user && form.saveAddressControl && !this.selectedSavedAddressId()) {
        await this.addressService.addAddress({
          userId: user.id,
          name: form.addressName || 'Dirección 1',
          firstName: form.firstName,
          lastName: form.lastName,
          street: form.address,
          city: form.city,
          postalCode: form.postalCode,
          country: form.country,
          phone: form.phone,
          dni: form.dni || undefined,
          isDefault: this.savedAddresses().length === 0
        } as any);
      }

      // Fetch the created order to get auto-generated fields
      const order = await new Promise<Order>((resolve) => {
        this.orderService.getOrder(orderId).subscribe(o => resolve(o));
      });

      // Send emails
      if (order) {
        try {
          await this.emailService.sendOrderConfirmation(order);
          await this.emailService.sendAdminNewOrder(order);
        } catch (emailErr) {
          console.error('⚠️ Error CORS o API Key al enviar email:', emailErr);
        }
      }

      this.cart.clearCart();
      this.confirmedOrder.set(order);
      this.step.set('confirmed');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error creating order:', err);
    } finally {
      this.isSubmitting.set(false);
    }
  }

  getControlError(name: string): boolean {
    const c = this.customerForm.get(name);
    return !!(c?.invalid && c?.touched);
  }
}
