import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminShopService } from '../../core/services/admin-shop/admin-shop.service';
import { BrandService } from '../../core/services/brand.service';
import { SupplierService } from '../../core/services/supplier.service';
import { AttributeService } from '../../core/services/attribute.service';
import { Product } from '../../core/models/product.model';
import { Brand } from '../../core/models/brand.model';
import { Supplier } from '../../core/models/supplier.model';
import { GlobalAttribute, ProductAttribute } from '../../core/models/attribute.model';

@Component({
  selector: 'app-shop-manage',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shop-manage.html',
  styleUrls: ['./shop-manage.css']
})
export class ShopManage implements OnInit {
  private adminShopService = inject(AdminShopService);
  private brandService = inject(BrandService);
  private supplierService = inject(SupplierService);
  private attributeService = inject(AttributeService);
  
  // Data
  products = signal<Product[]>([]);
  totalProducts = computed(() => this.products().length);
  lowStockCount = computed(() => this.products().filter(p => !p.stock || p.stock < 5).length);
  lowStockProducts = computed(() => this.products().filter(p => !p.stock || p.stock < 5));
  avgPrice = computed(() => {
    const prods = this.products();
    if (!prods.length) return null;
    const sum = prods.reduce((acc, p) => acc + (Number(p.price) || 0), 0);
    return sum / prods.length;
  });
  brands = signal<Brand[]>([]);
  suppliers = signal<Supplier[]>([]);
  globalAttributes = signal<GlobalAttribute[]>([]);

  loading = signal(true);
  isDrawerOpen = signal(false);
  showLowStock = signal(false);
  searchQuery = signal('');

  filteredProducts = computed(() => {
    let list = this.products();
    if (this.showLowStock()) {
      list = list.filter(p => !p.stock || p.stock < 5);
    }
    const q = this.searchQuery().toLowerCase().trim();
    if (q) {
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) || 
        (p.sku && p.sku.toLowerCase().includes(q))
      );
    }
    return list;
  });
  
  // Form State
  editingProduct = signal<Partial<Product> | null>(null);
  
  // UI helpers for dynamic fields
  newImageUrl = signal('');
  newBenefit = signal('');
  newMaterial = signal('');
  
  // Attribute Form state
  selectedGlobalAttrId = signal('');
  selectedGlobalAttrOptions = signal<string[]>([]);
  attrValuesToAdd = signal<string[]>([]);

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);
    
    // Call services concurrently
    // For now we will just subscribe to each 
    this.adminShopService.getProductsForAdmin().subscribe((data: Product[]) => {
       this.products.set(data);
       this.loading.set(false);
    });
    
    this.brandService.getBrands().subscribe(data => this.brands.set(data));
    this.supplierService.getSuppliers().subscribe(data => this.suppliers.set(data));
    this.attributeService.getAttributes().subscribe(data => this.globalAttributes.set(data));
  }

  deleteProduct(id: string) {
    if (confirm('ATENCIÓN: ¿Estás seguro de que deseas eliminar este producto permanentemente?')) {
      this.adminShopService.deleteProduct(id).then(() => {
         this.products.update((list: Product[]) => list.filter((p: Product) => p.id !== id));
      });
    }
  }

  openDrawer(product?: Product) {
    if (product) {
      this.editingProduct.set({ ...product, attributes: product.attributes ? [...product.attributes] : [], images: [...product.images], materials: [...product.materials], benefits: [...product.benefits] });
    } else {
      this.editingProduct.set({
        name: '',
        description: '',
        details: '',
        price: 0,
        costPrice: 0,
        category: 'Esenciales',
        stock: 0,
        images: [],
        thumbnail: '',
        benefits: [],
        materials: [],
        slug: '',
        sku: '',
        weight: 0,
        attributes: []
      });
    }
    
    this.isDrawerOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  closeDrawer() {
    this.isDrawerOpen.set(false);
    this.editingProduct.set(null);
    document.body.style.overflow = '';
  }

  saveProduct() {
    const product = this.editingProduct() as Product;
    if (!product.name || !product.price) {
      alert('Por favor, completa los campos obligatorios (Nombre, Precio).');
      return;
    }
    
    if (!product.slug) {
      product.slug = product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    if (product.id) {
       this.adminShopService.updateProduct(product.id, product).then(() => {
         this.products.update((list: Product[]) => list.map((p: Product) => p.id === product.id ? product : p));
         this.closeDrawer();
       });
    } else {
       this.adminShopService.addProduct(product).then(() => {
         // Re-fetch or manually add. The easiest is loadData since we don't have the generated ID here easily without changing the service method to return it, 
         // but wait, AdminShopService.addProduct adds the ID inside but doesn't return it.
         // Let's just reload data for simplicity and consistency.
         this.loadData();
         this.closeDrawer();
       });
    }
  }

  // Arrays Management
  addImage() {
    if (this.newImageUrl()) {
      const p = this.editingProduct();
      if (p && p.images) {
        p.images.push(this.newImageUrl());
        if (!p.thumbnail) { p.thumbnail = this.newImageUrl(); }
        this.newImageUrl.set('');
        this.editingProduct.set({...p});
      }
    }
  }

  removeImage(index: number) {
    const p = this.editingProduct();
    if (p && p.images) {
      p.images.splice(index, 1);
      this.editingProduct.set({...p});
    }
  }

  addBenefit() {
    if (this.newBenefit()) {
      const p = this.editingProduct();
      if (p && p.benefits) {
        p.benefits.push(this.newBenefit());
        this.newBenefit.set('');
        this.editingProduct.set({...p});
      }
    }
  }

  removeBenefit(index: number) {
    const p = this.editingProduct();
    if (p && p.benefits) {
      p.benefits.splice(index, 1);
      this.editingProduct.set({...p});
    }
  }

  addMaterial() {
    if (this.newMaterial()) {
      const p = this.editingProduct();
      if (p && p.materials) {
        p.materials.push(this.newMaterial());
        this.newMaterial.set('');
        this.editingProduct.set({...p});
      }
    }
  }

  removeMaterial(index: number) {
    const p = this.editingProduct();
    if (p && p.materials) {
      p.materials.splice(index, 1);
      this.editingProduct.set({...p});
    }
  }

  // Attributes Management
  onGlobalAttrSelect(event: Event) {
    const id = (event.target as HTMLSelectElement).value;
    const attr = this.globalAttributes().find(a => a.id === id);
    if (attr) {
      this.selectedGlobalAttrOptions.set(attr.options);
    } else {
      this.selectedGlobalAttrOptions.set([]);
    }
    this.attrValuesToAdd.set([]);
  }

  toggleAttrValue(opt: string) {
    const current = this.attrValuesToAdd();
    if (current.includes(opt)) {
      this.attrValuesToAdd.set(current.filter(val => val !== opt));
    } else {
      this.attrValuesToAdd.set([...current, opt]);
    }
  }

  addAttributeToProduct() {
    const attrId = this.selectedGlobalAttrId();
    const values = this.attrValuesToAdd();
    
    if (!attrId || values.length === 0) return;
    
    const attrInfo = this.globalAttributes().find(a => a.id === attrId);
    if (!attrInfo) return;
    
    const p = this.editingProduct();
    if (!p) return;
    
    if (!p.attributes) p.attributes = [];
    
    const existingIndex = p.attributes.findIndex(a => a.name === attrInfo.name);
    if (existingIndex >= 0) {
       // Merge values
       const merged = Array.from(new Set([...p.attributes[existingIndex].values, ...values]));
       p.attributes[existingIndex].values = merged;
    } else {
       p.attributes.push({ name: attrInfo.name, values: values });
    }
    
    this.editingProduct.set({...p});
    
    // Reset selection
    this.selectedGlobalAttrId.set('');
    this.selectedGlobalAttrOptions.set([]);
    this.attrValuesToAdd.set([]);
  }

  removeAttributeFromProduct(index: number) {
     const p = this.editingProduct();
     if (p && p.attributes) {
       p.attributes.splice(index, 1);
       this.editingProduct.set({...p});
     }
  }
}
