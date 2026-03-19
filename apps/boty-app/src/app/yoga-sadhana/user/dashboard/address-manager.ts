import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddressService } from '../../../core/services/address.service';
import { AuthService } from '../../auth/auth.service';
import { Address } from '../../../core/models/address.model';

@Component({
  selector: 'app-address-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './address-manager.html',
  styleUrl: './address-manager.css',
})
export class AddressManager implements OnInit {
  private addressService = inject(AddressService);
  private auth = inject(AuthService);

  addresses = signal<Address[]>([]);
  loading = signal<boolean>(true);
  
  isEditing = signal<boolean>(false);
  editingAddress = signal<Partial<Address>>({});

  ngOnInit() {
    this.loadAddresses();
  }

  loadAddresses() {
    const uid = this.auth.currentUser()?.id;
    if (!uid) return;
    this.addressService.getUserAddresses(uid).subscribe(data => {
      const sorted = data.sort((a, b) => {
        if (a.isDefault && !b.isDefault) return -1;
        if (!a.isDefault && b.isDefault) return 1;
        return ((b as any).createdAt || 0) - ((a as any).createdAt || 0);
      });
      this.addresses.set(sorted);
      this.loading.set(false);
    });
  }

  addNew() {
    this.isEditing.set(true);
    this.editingAddress.set({
      userId: this.auth.currentUser()?.id,
      country: 'España',
      isDefault: this.addresses().length === 0
    });
  }

  edit(address: Address) {
    this.isEditing.set(true);
    this.editingAddress.set({ ...address });
  }

  async save() {
    const data = this.editingAddress() as Address;
    if (!data.street || !data.city || !data.postalCode) return;
    
    try {
      if (data.id) {
        await this.addressService.updateAddress(data.id, data);
      } else {
        await this.addressService.addAddress(data);
      }
      this.isEditing.set(false);
    } catch (err) {
      console.error('Error saving address:', err);
    }
  }

  async deleteAddress(id: string) {
    if (confirm('¿Eliminar esta dirección?')) {
      await this.addressService.deleteAddress(id);
    }
  }

  async setAsDefault(id: string) {
    const uid = this.auth.currentUser()?.id;
    if (uid) {
      await this.addressService.setDefaultAddress(uid, id);
    }
  }

  cancel() {
    this.isEditing.set(false);
  }
}
