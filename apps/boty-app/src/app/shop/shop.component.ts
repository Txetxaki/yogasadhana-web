import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { ShopService } from '../core/services/shop/shop.service';
import { Product } from '../core/models/product.model';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css'
})
export class ShopComponent implements OnInit {
  private shopService = inject(ShopService);
  private meta = inject(Meta);
  private title = inject(Title);

  products = signal<Product[]>([]);
  loading = signal(true);
  categories = ['Todos', 'Esenciales', 'Ambiente', 'Vida', 'Digital'];
  activeCategory = signal('Todos');

  ngOnInit() {
    this.title.setTitle('Tienda Online | YogaSadhana');
    this.meta.updateTag({ name: 'description', content: 'Descubre nuestros productos esenciales de Yoga y Sadhana. Esterillas de corcho ecológico, zafus de meditación, inciensos naturales y mucho más.' });
    
    // SEO Structured Data (JSON-LD)
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Store",
      "name": "YogaSadhana Shop",
      "description": "Artículos para yoga, meditación y bienestar.",
      "url": "https://yogasadhana.com/tienda"
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(jsonLd);
    document.head.appendChild(script);

    this.loadProducts();
  }

  loadProducts() {
    this.loading.set(true);
    // Temporary hardcoded seed if firestore is empty
    this.shopService.getProducts().subscribe(data => {
      if (data && data.length > 0) {
        this.products.set(data);
      } else {
        this.products.set([]);
      }
      this.loading.set(false);
    });
  }

  filterByCategory(category: string) {
    this.activeCategory.set(category);
    // Real implementation would call shopService.getProductsByCategory if not "Todos"
    // For now we filter locally to be fast
    this.loading.set(true);
    this.shopService.getProducts().subscribe(data => {
      const all = (data && data.length > 0) ? data : [];
      if (category === 'Todos') {
        this.products.set(all);
      } else {
        this.products.set(all.filter(p => p.category === category));
      }
      this.loading.set(false);
    });
  }
}
