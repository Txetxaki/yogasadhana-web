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
  isEditing = signal(false);
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
    });
  }

  onSubmit() {
    if (this.supplierForm.invalid) {
      this.supplierForm.markAllAsTouched();
      return;
    }

    const supplierData = this.supplierForm.value;
    const id = this.currentSupplierId();

    if (this.isEditing() && id) {
      this.supplierService.updateSupplier(id, supplierData).then(() => {
        this.resetForm();
      });
    } else {
      this.supplierService.addSupplier(supplierData).then(() => {
        this.resetForm();
      });
    }
  }

  editSupplier(supplier: Supplier) {
    this.isEditing.set(true);
    this.currentSupplierId.set(supplier.id);
    this.supplierForm.patchValue(supplier);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteSupplier(id: string) {
    if(confirm('¿Seguro que quieres eliminar este proveedor? Se mantendrá en los productos que ya lo tengan pero ya no podrá usarse.')) {
      this.supplierService.deleteSupplier(id);
    }
  }

  resetForm() {
    this.isEditing.set(false);
    this.currentSupplierId.set(null);
    this.supplierForm.reset();
  }
}
