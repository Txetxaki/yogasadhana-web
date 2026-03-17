import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminShopService } from '../../core/services/admin-shop/admin-shop.service';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-shop-manage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shop-manage.html',
  styleUrls: ['./shop-manage.css']
})
export class ShopManage implements OnInit {
  adminShopService = inject(AdminShopService);
  
  products = signal<Product[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading.set(true);
    // Ideally this calls Firebase via adminShopService
    // Using setTimeout as mockup loader
    setTimeout(() => {
        this.adminShopService.getProductsForAdmin().subscribe({
          next: (data: Product[]) => {
            this.products.set(data || []);
            this.loading.set(false);
          },
          error: (err: Error) => {
            console.error(err);
            this.loading.set(false);
          }
        });
    }, 500);
  }

  deleteProduct(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto permanentemente?')) {
      this.adminShopService.deleteProduct(id).then(() => {
         this.products.update(list => list.filter(p => p.id !== id));
      });
    }
  }

  // Placeholder for the "Add product" modal / form
  addProduct() {
    alert('Esta función abrirá un modal para añadir un producto (Nombre, Precio, Categoría, Fotos) y lo subirá a Firebase Storage/Firestore.');
  }
}
