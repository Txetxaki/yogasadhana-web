import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../../models/product.model';
import { ShopService } from '../shop/shop.service';

@Injectable({
  providedIn: 'root'
})
export class AdminShopService {
  private shopService = inject(ShopService);

  getProductsForAdmin(): Observable<Product[]> {
    return this.shopService.getProducts();
  }

  deleteProduct(id: string): Promise<void> {
    console.log('Mock deleting product', id);
    return Promise.resolve();
  }
}

