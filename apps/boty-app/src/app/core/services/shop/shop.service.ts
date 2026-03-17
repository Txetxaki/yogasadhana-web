import { Injectable, inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Firestore, collection, collectionData, doc, docData, query, where, setDoc } from '@angular/fire/firestore';
import { Product } from '../../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  private readonly HARDCODED_PRODUCTS: Product[] = [
    { id: '1', slug: 'esterilla-pro-corcho', name: 'Esterilla Earth Cork PRO', description: 'Corcho natural y caucho biodegradable.', details: 'Diseñada para máximo agarre ecológico. Superficie antimicrobiana.', price: 65, category: 'Esenciales', stock: 10, images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&q=80&w=800'], thumbnail: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&q=80&w=800', benefits: ['Antideslizante extremo', '100% Ecológico'], materials: ['Corcho', 'Caucho'], isEcoFriendly: true, isBestSeller: true },
    { id: '2', slug: 'zafu-meditacion-lino', name: 'Zafu Meditación Lino', description: 'Relleno de cáscara de espelta orgánica.', details: 'Zafu tradicional hecho a mano. Lino lavado para textura suave.', price: 42, category: 'Esenciales', stock: 15, images: ['https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?auto=format&fit=crop&q=80&w=800'], thumbnail: 'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?auto=format&fit=crop&q=80&w=800', benefits: ['Ergonomía superior', 'Lavable'], materials: ['Lino', 'Espelta'] },
    { id: '3', slug: 'aceite-sandalo', name: 'Aceite Ritual Sándalo', description: 'Pureza terapéutica, 15ml.', details: 'Extraído por destilación. Promueve la relajación mental profunda.', price: 28, category: 'Ambiente', stock: 20, images: ['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800'], thumbnail: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800', benefits: ['Calmante', 'Aroma maderado'], materials: ['100% Aceite Esencial'], isBestSeller: true },
    { id: '4', slug: 'libro-yoga-camino', name: 'Yoga: El Camino Interior', description: 'Edición especial en papel reciclado.', details: 'Una guía filosófica y práctica a través de los 8 pasos de Patanjali.', price: 34, category: 'Vida', stock: 5, images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800'], thumbnail: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800', benefits: [], materials: [], isEcoFriendly: true },
    { id: '5', slug: 'bloques-roble', name: 'Set Bloques de Roble', description: 'Madera certificada, tacto sedoso.', details: 'Bloques de alta durabilidad para alinear tus posturas más exigentes.', price: 55, category: 'Esenciales', stock: 12, images: ['https://images.unsplash.com/photo-1588286840104-e43eee4271e5?auto=format&fit=crop&q=80&w=800'], thumbnail: 'https://images.unsplash.com/photo-1588286840104-e43eee4271e5?auto=format&fit=crop&q=80&w=800', benefits: ['Apoyo firme', 'Estética natural'], materials: ['Madera Roble FSC'] },
    { id: '6', slug: 'incienso-morning-dew', name: 'Incienso Morning Dew', description: 'Hecho a mano con resinas naturales.', details: 'Aroma fresco que evoca el rocío de la mañana. Sin tóxicos.', price: 18.5, category: 'Ambiente', stock: 30, images: ['https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&q=80&w=800'], thumbnail: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&q=80&w=800', benefits: [], materials: [] },
    { id: '7', slug: 'cinturon-yoga-algodon', name: 'Cinturón Algodón Orgánico', description: 'Ayuda para posturas avanzadas.', details: 'Con hebilla metálica resistente (D-ring) y 2.5 metros de longitud.', price: 12, category: 'Esenciales', stock: 40, images: ['https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800'], thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800', benefits: ['Extiende alcance', 'Mejora flexibilidad'], materials: ['Algodón orgánico'] },
    { id: '8', slug: 'bolster-cilindrico', name: 'Bolster Restaurativo', description: 'Funda lavable, relleno firme.', details: 'El soporte ideal para posturas pasivas y apertura de pecho.', price: 45, category: 'Esenciales', stock: 8, images: ['https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539?auto=format&fit=crop&q=80&w=800'], thumbnail: 'https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539?auto=format&fit=crop&q=80&w=800', benefits: ['Soporte lumbar', 'Relajación profunda'], materials: ['Algodón', 'Fibras naturales'] },
    { id: '9', slug: 'bolso-mat-impermeable', name: 'Bolso Mat Impermeable', description: 'Múltiples bolsillos para accesorios.', details: 'Correa ajustable y tejido repelente al agua. Espacio para bloque y botella.', price: 28, category: 'Vida', stock: 25, images: ['https://images.unsplash.com/photo-1522845015757-50bce044e5da?auto=format&fit=crop&q=80&w=800'], thumbnail: 'https://images.unsplash.com/photo-1522845015757-50bce044e5da?auto=format&fit=crop&q=80&w=800', benefits: ['Práctico', 'Duradero'], materials: ['Nylon reciclado'] },
    { id: '10', slug: 'toalla-microfibra-grip', name: 'Toalla Microfibra Grip', description: 'Antideslizante para Hot Yoga.', details: 'Absorbe la humedad y fija el agarre en prácticas de alta sudoración.', price: 20, category: 'Esenciales', stock: 30, images: ['https://images.unsplash.com/photo-1533090368676-1fd25485db88?auto=format&fit=crop&q=80&w=800'], thumbnail: 'https://images.unsplash.com/photo-1533090368676-1fd25485db88?auto=format&fit=crop&q=80&w=800', benefits: ['Súper absorbente'], materials: ['Microfibra'] },
    { id: '11', slug: 'cuencos-tibetanos', name: 'Cuenco Tibetano 7 Metales', description: 'Hecho a mano en Nepal.', details: 'Produce frecuencias curativas (432Hz) ideales para terapia de sonido.', price: 120, category: 'Ambiente', stock: 4, images: ['https://images.unsplash.com/photo-1519782806821-65f5e933eb97?auto=format&fit=crop&q=80&w=800'], thumbnail: 'https://images.unsplash.com/photo-1519782806821-65f5e933eb97?auto=format&fit=crop&q=80&w=800', benefits: ['Equilibra chakras', 'Terapia sonora'], materials: ['Aleación 7 metales'] },
    { id: '12', slug: 'mala-rudraksha-108', name: 'Mala Rudraksha 108', description: 'Para tu práctica de Japa Mala.', details: 'Semillas auténticas ensartadas a mano con hilo de seda.', price: 25, category: 'Vida', stock: 15, images: ['https://images.unsplash.com/photo-1598409395982-1e9bf25e2d63?auto=format&fit=crop&q=80&w=800'], thumbnail: 'https://images.unsplash.com/photo-1598409395982-1e9bf25e2d63?auto=format&fit=crop&q=80&w=800', benefits: ['Foco mental'], materials: ['Semilla Rudraksha', 'Seda'] },
    { id: '13', slug: 'palo-santo-premium', name: 'Palo Santo Premium', description: 'Origen ético certificado. Pack 100g.', details: 'Purifica espacios y energías densas con humo blanco dulce y leñoso.', price: 14, category: 'Ambiente', stock: 45, images: ['https://images.unsplash.com/photo-1621683412586-baee23aa9e3f?auto=format&fit=crop&q=80&w=800'], thumbnail: 'https://images.unsplash.com/photo-1621683412586-baee23aa9e3f?auto=format&fit=crop&q=80&w=800', benefits: ['Purificación estelar'], materials: ['Madera natural sostenible'] },
    { id: '14', slug: 'difusor-ultrasonico', name: 'Difusor Ultrasónico', description: 'Luz LED ambiental, 300ml.', details: 'Difunde aceites esenciales sin calentarlos, conservando propiedades.', price: 40, category: 'Ambiente', stock: 10, images: ['https://images.unsplash.com/photo-1608620857342-9ee6887550f7?auto=format&fit=crop&q=80&w=800'], thumbnail: 'https://images.unsplash.com/photo-1608620857342-9ee6887550f7?auto=format&fit=crop&q=80&w=800', benefits: ['Humidificador'], materials: ['Cerámica', 'Madera'] },
    { id: '15', slug: 'leggings-alta-compresion', name: 'Leggings Flow Sculpt', description: 'Alta compresión sin costuras.', details: 'Tejido técnico que abraza sin apretar. Opaco en sentadillas (Squat proof).', price: 45, category: 'Vida', stock: 22, images: ['https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800'], thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800', benefits: ['Transpirable', 'Efecto vientre plano'], materials: ['Nylon', 'Spandex'], isBestSeller: true },
    { id: '16', slug: 'top-sadhana', name: 'Top Sadhana Breath', description: 'Soporte medio, muy transpirable.', details: 'Escote en la espalda y copas removibles. Diseño elegante y funcional.', price: 30, category: 'Vida', stock: 28, images: ['https://images.unsplash.com/photo-1549643194-e699f7d46ffc?auto=format&fit=crop&q=80&w=800'], thumbnail: 'https://images.unsplash.com/photo-1549643194-e699f7d46ffc?auto=format&fit=crop&q=80&w=800', benefits: ['Libertad movimiento'], materials: ['Nylon', 'Elastano'] },
    { id: '17', slug: 'sudadera-mindful', name: 'Sudadera Mindful Eco', description: 'Algodón orgánico supersuave.', details: 'Corte oversize ideal para antes y después de tu práctica o relajación.', price: 55, category: 'Vida', stock: 15, images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800'], thumbnail: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800', benefits: ['Tacto cálido'], materials: ['100% Algodón Peinado Orgánico'], isEcoFriendly: true },
    { id: '18', slug: 'curso-ashtanga', name: 'Iniciación Ashtanga', description: 'Curso digital. Acceso vitalicio.', details: '12 módulos en vídeo HD para dominar la primera serie del Ashtanga Vinyasa.', price: 89, category: 'Digital', stock: 999, images: ['https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&q=80&w=800'], thumbnail: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&q=80&w=800', benefits: ['Aprende a tu ritmo', 'Certificado final'], materials: [] },
    { id: '19', slug: 'masterclass-pranayama', name: 'Taller de Pranayama', description: 'Masterclass digital sobre respiración.', details: 'Descubre los secretos del control vital. 3 horas de contenido teórico-práctico.', price: 60, category: 'Digital', stock: 999, images: ['https://images.unsplash.com/photo-1506544777-64cfbe1142df?auto=format&fit=crop&q=80&w=800'], thumbnail: 'https://images.unsplash.com/photo-1506544777-64cfbe1142df?auto=format&fit=crop&q=80&w=800', benefits: ['Clonación estrés', 'Vitalidad'], materials: [] },
    { id: '20', slug: 'retiro-virtual-detox', name: 'Retiro 7 Días Detox', description: 'Retiro virtual guiado.', details: 'Medita, purifica y revitaliza cuerpo y mente durante 7 días intensivos desde casa.', price: 45, category: 'Digital', stock: 999, images: ['https://images.unsplash.com/photo-1447452001602-7090c7ab2db3?auto=format&fit=crop&q=80&w=800'], thumbnail: 'https://images.unsplash.com/photo-1447452001602-7090c7ab2db3?auto=format&fit=crop&q=80&w=800', benefits: ['Reset mental', 'Material PDF'], materials: [] }
  ];

  private firestore = inject(Firestore);
  private productsCollection = collection(this.firestore, 'products');

  // Seed the database with hardcoded products
  async seedDatabase(): Promise<void> {
    for (const p of this.HARDCODED_PRODUCTS) {
      const docRef = doc(this.firestore, `products/${p.id}`);
      await setDoc(docRef, p);
    }
    console.log('Database seeded with hardcoded products!');
  }

  // Get all products
  getProducts(): Observable<Product[]> {
    return collectionData(this.productsCollection, { idField: 'id' }).pipe(
      map(data => data as Product[])
    );
  }

  // Get products by category
  getProductsByCategory(category: string): Observable<Product[]> {
    const q = query(this.productsCollection, where('category', '==', category));
    return collectionData(q, { idField: 'id' }).pipe(
      map(data => data as Product[])
    );
  }

  // Get single product by ID (slug support requires a query, simpler to just use ID for now)
  getProductById(id: string): Observable<Product> {
    const docRef = doc(this.firestore, `products/${id}`);
    return docData(docRef, { idField: 'id' }).pipe(
      map(data => {
        if (!data) throw new Error('Product not found');
        return data as Product;
      })
    );
  }

  // Get Best Sellers
  getBestSellers(): Observable<Product[]> {
    const q = query(this.productsCollection, where('isBestSeller', '==', true));
    return collectionData(q, { idField: 'id' }).pipe(
      map(data => data as Product[])
    );
  }
}
