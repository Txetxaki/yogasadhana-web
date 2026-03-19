import { Component, OnInit, inject, signal, PLATFORM_ID, computed } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
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
  private platformId = inject(PLATFORM_ID);

  allProducts = signal<Product[]>([]);
  products = signal<Product[]>([]);
  loading = signal(true);
  categories = ['Todos', 'Esterillas', 'Zafus & Cojines', 'Aceites Esenciales', 'Libros & Diarios'];
  activeCategory = signal('Todos');

  categoryCounts = computed(() => {
    const all = this.allProducts();
    const counts: Record<string, number> = { 'Todos': all.length };
    this.categories.slice(1).forEach(cat => {
      counts[cat] = all.filter(p => p.category === cat).length;
    });
    return counts;
  });

  ngOnInit() {
    this.title.setTitle('Tienda Online | YogaSadhana');
    this.meta.updateTag({ name: 'description', content: 'Descubre nuestros productos esenciales de Yoga y Sadhana. Esterillas de corcho ecológico, zafus de meditación, inciensos naturales y mucho más.' });

    if (isPlatformBrowser(this.platformId)) {
      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Store',
        'name': 'YogaSadhana Shop',
        'description': 'Artículos para yoga, meditación y bienestar.',
        'url': 'https://yogasadhana.com/tienda'
      };
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    this.loadProducts();
  }

  loadProducts() {
    this.loading.set(true);
    this.shopService.getProducts().subscribe(data => {
      const list = data?.length ? data : [];
      this.allProducts.set(list);
      this.products.set(list);
      this.loading.set(false);
    });
  }

  filterByCategory(category: string) {
    this.activeCategory.set(category);
    const all = this.allProducts();
    if (category === 'Todos') {
      this.products.set(all);
    } else {
      this.products.set(all.filter(p => p.category === category));
    }
  }
}
