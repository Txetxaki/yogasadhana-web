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
  isEditing = signal(false);
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
    });
  }

  onSubmit() {
    if (this.brandForm.invalid) {
      this.brandForm.markAllAsTouched();
      return;
    }

    const brandData = this.brandForm.value;
    const id = this.currentBrandId();

    if (this.isEditing() && id) {
      this.brandService.updateBrand(id, brandData).then(() => {
        this.resetForm();
      });
    } else {
      this.brandService.addBrand(brandData).then(() => {
        this.resetForm();
      });
    }
  }

  editBrand(brand: Brand) {
    this.isEditing.set(true);
    this.currentBrandId.set(brand.id);
    this.brandForm.patchValue(brand);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteBrand(id: string) {
    if(confirm('¿Seguro que quieres eliminar esta marca? Se mantendrá en los productos que ya la tenham pero ya no podrá usarse.')) {
      this.brandService.deleteBrand(id);
    }
  }

  resetForm() {
    this.isEditing.set(false);
    this.currentBrandId.set(null);
    this.brandForm.reset();
  }
}
