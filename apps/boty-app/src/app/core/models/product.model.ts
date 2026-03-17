export interface Product {
  id: string;
  name: string;
  description: string;
  details: string;
  price: number;
  category: 'Esenciales' | 'Ambiente' | 'Vida' | 'Digital';
  stock: number;
  images: string[];
  thumbnail: string;
  benefits: string[];
  materials: string[];
  slug: string; // URL friendly for SEO
  isBestSeller?: boolean;
  isEcoFriendly?: boolean;
}
