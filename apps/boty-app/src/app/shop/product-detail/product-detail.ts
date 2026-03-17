import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { ShopService } from '../../core/services/shop/shop.service';
import { CartService } from '../../core/services/cart/cart.service';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.css']
})
export class ProductDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private shopService = inject(ShopService);
  private cartService = inject(CartService);
  private title = inject(Title);
  private meta = inject(Meta);

  product = signal<Product | null>(null);
  loading = signal(true);
  quantity = signal(1);
  activeImageIndex = signal(0);
  addingToCart = signal(false);

  goBack() {
    const cat = this.product()?.category;
    if (cat) {
      this.router.navigate(['/yoga-sadhana/tienda'], {queryParams: {category: cat}});
    } else {
      this.router.navigate(['/yoga-sadhana/tienda']);
    }
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const idOrSlug = params.get('id');
      if (idOrSlug) {
        this.loadProduct(idOrSlug);
      } else {
        this.router.navigate(['/yoga-sadhana/tienda']);
      }
    });
  }

  loadProduct(id: string) {
    this.loading.set(true);
    // Since Firebase might not be seeded, we simulate getting by ID using the hardcoded list first if no product is fully fetched
    this.shopService.getProductById(id).subscribe(
      data => {
        if (data) {
          this.setProductAndSeo(data);
        } else {
          // fallback to fetching all and filtering (useful for hardcoded data)
          this.shopService.getProducts().subscribe(allProducts => {
            const found = allProducts?.find(p => p.id === id || p.slug === id) || this.getHardcodedProduct(id);
            if (found) {
              this.setProductAndSeo(found);
            } else {
              this.router.navigate(['/yoga-sadhana/tienda']);
            }
          });
        }
      },
      error => {
        const found = this.getHardcodedProduct(id);
        if (found) this.setProductAndSeo(found);
        else this.router.navigate(['/yoga-sadhana/tienda']);
      }
    );
  }

  private setProductAndSeo(product: Product) {
    this.product.set(product);
    this.loading.set(false);
    this.activeImageIndex.set(0);
    this.quantity.set(1);

    this.title.setTitle(`${product.name} | Tienda YogaSadhana`);
    this.meta.updateTag({ name: 'description', content: product.description });

    // SEO Structured Data (JSON-LD) for Single Product
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "image": product.images || [product.thumbnail],
      "description": product.description,
      "offers": {
        "@type": "Offer",
        "url": `https://yogasadhana.com/tienda/${product.slug || product.id}`,
        "priceCurrency": "EUR",
        "price": product.price,
        "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
      }
    };
    
    // Replace old JSON-LD script if it exists
    let script = document.getElementById('json-ld-product') as HTMLScriptElement;
    if (script) {
      document.head.removeChild(script);
    }
    script = document.createElement('script');
    script.id = 'json-ld-product';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(jsonLd);
    document.head.appendChild(script);
  }

  incrementQuantity() {
    if (this.product() && this.quantity() < (this.product()?.stock || 99)) {
      this.quantity.update(q => q + 1);
    }
  }

  decrementQuantity() {
    if (this.quantity() > 1) {
      this.quantity.update(q => q - 1);
    }
  }

  setActiveImage(index: number) {
    this.activeImageIndex.set(index);
  }

  addToCart() {
    const p = this.product();
    if (p) {
      this.addingToCart.set(true);
      this.cartService.addToCart(p, this.quantity());
      
      setTimeout(() => {
        this.addingToCart.set(false);
        // Optional: show a mini-cart overlay or Toast notification here
      }, 600);
    }
  }

  private getHardcodedProduct(idOrSlug: string): Product | null {
    const hardcoded: Product[] = [
      { id: '1', slug: 'esterilla-pro-corcho', name: 'Esterilla Earth Cork PRO', description: 'Corcho natural y caucho biodegradable.', details: 'Nuestra esterilla más avanzada diseñada para ofrecer el máximo agarre sin sacrificar el compromiso ecológico. 4mm de grosor absorben el impacto, y su superficie de corcho mejora el agarre cuanto más se suda.', price: 65, category: 'Esenciales', stock: 10, images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuB3rzuJgR_UZWHGA4HdvBglXgzyyotMGGjdRKIk_4lekN6DAmwl3R0mRLQINRtWhghsWSNPSuWxR5K1XPkKGCofBtQVcwutrXQbNB_v7L2AD-FCAUAeqWWA5VBuGTLh5M8-FXNrC41bjrtVT2jkhTGvVRYVKA9bjIdAhgxUBYL_WOHnJZACz4-jZHhJXhgTuv9ZqoJsLusPKJPpVKOY-dEeOIXZf-pwqtcexf4sF3CLZvfyVwsr6cVaNRp7TksOPbxWmNzesQRkIIQ', 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3rzuJgR_UZWHGA4HdvBglXgzyyotMGGjdRKIk_4lekN6DAmwl3R0mRLQINRtWhghsWSNPSuWxR5K1XPkKGCofBtQVcwutrXQbNB_v7L2AD-FCAUAeqWWA5VBuGTLh5M8-FXNrC41bjrtVT2jkhTGvVRYVKA9bjIdAhgxUBYL_WOHnJZACz4-jZHhJXhgTuv9ZqoJsLusPKJPpVKOY-dEeOIXZf-pwqtcexf4sF3CLZvfyVwsr6cVaNRp7TksOPbxWmNzesQRkIIQ'], thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3rzuJgR_UZWHGA4HdvBglXgzyyotMGGjdRKIk_4lekN6DAmwl3R0mRLQINRtWhghsWSNPSuWxR5K1XPkKGCofBtQVcwutrXQbNB_v7L2AD-FCAUAeqWWA5VBuGTLh5M8-FXNrC41bjrtVT2jkhTGvVRYVKA9bjIdAhgxUBYL_WOHnJZACz4-jZHhJXhgTuv9ZqoJsLusPKJPpVKOY-dEeOIXZf-pwqtcexf4sF3CLZvfyVwsr6cVaNRp7TksOPbxWmNzesQRkIIQ', benefits: ['Antideslizante extremo', 'Antimicrobiano natural', '100% Ecológico'], materials: ['Corcho portugués', 'Caucho de árbol natural'], isEcoFriendly: true },
      { id: '2', slug: 'zafu-meditacion-lino', name: 'Zafu Meditación Lino', description: 'Relleno de cáscara de espelta orgánica.', details: 'Zafu tradicional hecho a mano en España. El lino lavado ofrece una textura suave, y el relleno de espelta se amolda a tu anatomía garantizando una postura erguida durante horas.', price: 42, category: 'Esenciales', stock: 15, images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAQKau3oA4aMOs3dgboOgUaLEyhmrTE6b-5ivoIz53DDn55aC-PHI80Xs8C64s_oF_QHyD9Z9epVXDNNRqkHEwis6dCgM-RMFstwKHpRJcaNMpl7hDL3LatMwzztSiNrgctJsh3m2ofS5TEwIq6cBIxwYiRw_qY45IBFrnmZm-MHH-SdeAg-MzVx15NbN9vMH2tfm0udt1KuIMXOShY3MrcHutiFELSVLsOxqkVLv6g4cykbIHWvdI2IqPJ8T5pzB5LTVQZMypDy8E'], thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQKau3oA4aMOs3dgboOgUaLEyhmrTE6b-5ivoIz53DDn55aC-PHI80Xs8C64s_oF_QHyD9Z9epVXDNNRqkHEwis6dCgM-RMFstwKHpRJcaNMpl7hDL3LatMwzztSiNrgctJsh3m2ofS5TEwIq6cBIxwYiRw_qY45IBFrnmZm-MHH-SdeAg-MzVx15NbN9vMH2tfm0udt1KuIMXOShY3MrcHutiFELSVLsOxqkVLv6g4cykbIHWvdI2IqPJ8T5pzB5LTVQZMypDy8E', benefits: ['Ergonomía superior', 'Transpirable', 'Lavable'], materials: ['100% Lino Europeo', 'Espelta Ecológica'] },
    ];
    return hardcoded.find(p => p.id === idOrSlug || p.slug === idOrSlug) || null;
  }
}
