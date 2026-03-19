import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrandService } from '../../core/services/brand.service';
import { Brand } from '../../core/models/brand.model';

@Component({
  selector: 'app-brands-manage',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './brands-manage.component.html',
  styleUrl: './brands-manage.component.css'
})
export class BrandsManageComponent implements OnInit {
  private brandService = inject(BrandService);
  private fb = inject(FormBuilder);

  brands = signal<Brand[]>([]);
  loading = signal(true);
  isEditing = signal(false);
  isModalOpen = signal(false);
  currentBrandId = signal<string | null>(null);

  brandForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    countryOfOrigin: ['', Validators.required],
    description: ['', Validators.required],
    logoUrl: ['']
  });

  ngOnInit() {
    this.brandService.getBrands().subscribe((data: Brand[]) => {
      this.brands.set(data);
      this.loading.set(false);
    });
  }

  openModal(brand?: Brand) {
    if (brand) {
      this.isEditing.set(true);
      this.currentBrandId.set(brand.id);
      this.brandForm.patchValue(brand);
    } else {
      this.isEditing.set(false);
      this.currentBrandId.set(null);
      this.brandForm.reset();
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
    if (this.brandForm.invalid) { this.brandForm.markAllAsTouched(); return; }
    const id = this.currentBrandId();
    if (this.isEditing() && id) {
      this.brandService.updateBrand(id, this.brandForm.value).then(() => this.closeModal());
    } else {
      this.brandService.addBrand(this.brandForm.value).then(() => this.closeModal());
    }
  }

  editBrand(brand: Brand) { this.openModal(brand); }

  deleteBrand(id: string) {
    if (confirm('¿Seguro que quieres eliminar esta marca?')) {
      this.brandService.deleteBrand(id);
    }
  }

  resetForm() {
    this.isEditing.set(false);
    this.currentBrandId.set(null);
    this.brandForm.reset();
  }
}
