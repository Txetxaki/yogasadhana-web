import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupplierService } from '../../core/services/supplier.service';
import { Supplier } from '../../core/models/supplier.model';

@Component({
  selector: 'app-suppliers-manage',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './suppliers-manage.component.html',
  styleUrl: './suppliers-manage.component.css'
})
export class SuppliersManageComponent implements OnInit {
  private supplierService = inject(SupplierService);
  private fb = inject(FormBuilder);

  suppliers = signal<Supplier[]>([]);
  loading = signal(true);
  isEditing = signal(false);
  isModalOpen = signal(false);
  currentSupplierId = signal<string | null>(null);

  supplierForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    contactName: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    address: ['', Validators.required],
    notes: ['']
  });

  ngOnInit() {
    this.supplierService.getSuppliers().subscribe((data: Supplier[]) => {
      this.suppliers.set(data);
      this.loading.set(false);
    });
  }

  openModal(supplier?: Supplier) {
    if (supplier) {
      this.isEditing.set(true);
      this.currentSupplierId.set(supplier.id);
      this.supplierForm.patchValue(supplier);
    } else {
      this.isEditing.set(false);
      this.currentSupplierId.set(null);
      this.supplierForm.reset();
    }
    this.isModalOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.isModalOpen.set(false);
    document.body.style.overflow = '';
    this.resetForm();
  }

  onSubmit() {
    if (this.supplierForm.invalid) { this.supplierForm.markAllAsTouched(); return; }
    const id = this.currentSupplierId();
    if (this.isEditing() && id) {
      this.supplierService.updateSupplier(id, this.supplierForm.value).then(() => this.closeModal());
    } else {
      this.supplierService.addSupplier(this.supplierForm.value).then(() => this.closeModal());
    }
  }

  editSupplier(supplier: Supplier) { this.openModal(supplier); }

  deleteSupplier(id: string) {
    if (confirm('¿Seguro que quieres eliminar este proveedor?')) {
      this.supplierService.deleteSupplier(id);
    }
  }

  resetForm() {
    this.isEditing.set(false);
    this.currentSupplierId.set(null);
    this.supplierForm.reset();
  }
}
