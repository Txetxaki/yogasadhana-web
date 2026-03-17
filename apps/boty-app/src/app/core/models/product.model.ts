import { ProductAttribute } from './attribute.model';

export interface Product {
  id: string;
  name: string;
  description: string;
  details: string;
  price: number;
  costPrice?: number; // Precio de coste B2B
  category: 'Esenciales' | 'Ambiente' | 'Vida' | 'Digital';
  stock: number;
  images: string[];
  thumbnail: string;
  benefits: string[];
  materials: string[];
  slug: string; // URL friendly for SEO
  isBestSeller?: boolean;
  isEcoFriendly?: boolean;
  brandId?: string; // Ref to Brand
  supplierId?: string; // Ref to Supplier
  attributes?: ProductAttribute[]; // e.g. Tallas, Colores
  sku?: string;
  weight?: number; // For shipping calcs
}
