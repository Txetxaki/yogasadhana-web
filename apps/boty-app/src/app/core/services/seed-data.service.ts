import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, setDoc, getDoc, getDocs } from '@angular/fire/firestore';

/**
 * SeedDataService — Seeds Firestore with realistic test data.
 * Safe to call multiple times: it only creates docs that don't already exist.
 * Call seedAll() from the admin dashboard or a dev route.
 */
@Injectable({ providedIn: 'root' })
export class SeedDataService {
  private fs = inject(Firestore);

  async seedAll(): Promise<void> {
    console.group('🌱 YogaSadhana Seed — Starting...');
    await this.seedBrands();
    await this.seedSuppliers();
    await this.seedAttributes();
    await this.seedUsers();
    await this.seedOrders();
    console.groupEnd();
    console.log('✅ Seed complete!');
  }

  // ── Brands ──────────────────────────────────────────────────────────────
  private async seedBrands(): Promise<void> {
    const brands = [
      { id: 'brand-manduka', name: 'Manduka', countryOfOrigin: 'USA', description: 'La marca de referencia mundial en esterillas de yoga de alta gama. Fundada en 1997, conocida por su PRO Mat con garantía de por vida.', logoUrl: 'https://images.unsplash.com/photo-1588286840104-e43eee4271e5?w=80&h=80&fit=crop' },
      { id: 'brand-jade', name: 'Jade Yoga', countryOfOrigin: 'USA', description: 'Esterillas de caucho natural sostenible. Por cada esterilla vendida, Jade planta un árbol. Certificadas libres de PVC y derivados del petróleo.', logoUrl: '' },
      { id: 'brand-lotuscrafts', name: 'Lotuscrafts', countryOfOrigin: 'Austria', description: 'Marca austríaca especializada en accesorios de yoga y meditación de materiales naturales y ecológicos. GOTS y OEKO-TEX certificados.' , logoUrl: '' },
      { id: 'brand-yogistar', name: 'Yogistar', countryOfOrigin: 'Germany', description: 'Fabricante alemán con más de 20 años de experiencia en el sector. Amplia gama de productos para todo nivel de práctica.' , logoUrl: '' },
      { id: 'brand-ys', name: 'YogaSadhana', countryOfOrigin: 'España', description: 'Nuestra línea propia. Productos diseñados con la filosofía del estudio: calidad, sostenibilidad y estética cuidada.' , logoUrl: '' },
    ];
    await this.batchSeed('brands', brands);
    console.log(`  ✓ Brands: ${brands.length} seeded`);
  }

  // ── Suppliers ────────────────────────────────────────────────────────────
  private async seedSuppliers(): Promise<void> {
    const suppliers = [
      { id: 'sup-ecoyoga', name: 'EcoYoga Distribution S.L.', contactName: 'Rafael Moreno', phone: '+34 915 234 567', email: 'pedidos@ecoyoga-dist.es', address: 'Polígono Industrial Norte, Nave 14, 28100 Alcobendas, Madrid', notes: 'Distribuidor oficial Manduka y Jade para España y Portugal. Mínimo de pedido 500€. Plazos 15-20 días.' },
      { id: 'sup-namaste', name: 'Namaste Wholesale GmbH', contactName: 'Lena Schneider', phone: '+49 89 4521 890', email: 'orders@namaste-wholesale.de', address: 'Leopoldstraße 48, 80802 München, Germany', notes: 'Proveedor europeo de Lotuscrafts y Yogistar. Envíos DHL Express. Factura en EUR.' },
      { id: 'sup-aranya', name: 'Aranya Crafts India Pvt Ltd', contactName: 'Suresh Patel', phone: '+91 98765 43210', email: 'export@aranyacrafts.in', address: '23 MG Road, Rishikesh, Uttarakhand 249201, India', notes: 'Proveedor de cuencos tibetanos, malas y artesanía espiritual. Tiempo de envío 4-6 semanas. Pago 50% por adelantado.' },
    ];
    await this.batchSeed('suppliers', suppliers);
    console.log(`  ✓ Suppliers: ${suppliers.length} seeded`);
  }

  // ── Attributes ───────────────────────────────────────────────────────────
  private async seedAttributes(): Promise<void> {
    const attributes = [
      { id: 'attr-talla', name: 'Talla', type: 'text', options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
      { id: 'attr-color', name: 'Color', type: 'color', options: ['#1a1a1a', '#924a28', '#4a7c59', '#b8860b', '#5c7a9e', '#f5f0e8', '#c4a882'] },
      { id: 'attr-material', name: 'Material', type: 'text', options: ['Corcho', 'Caucho Natural', 'Algodón Orgánico', 'Lino', 'Lana', 'Bambú'] },
      { id: 'attr-grosor', name: 'Grosor', type: 'text', options: ['3mm', '4mm', '5mm', '6mm', '8mm'] },
      { id: 'attr-longitud', name: 'Longitud', type: 'text', options: ['183cm', '185cm', '200cm', '215cm'] },
    ];
    await this.batchSeed('attributes', attributes);
    console.log(`  ✓ Attributes: ${attributes.length} seeded`);
  }

  // ── Users ───────────────────────────────────────────────────────────────
  private async seedUsers(): Promise<void> {
    const users = [
      { id: 'test-user-ana', name: 'Ana García Solano', email: 'ana@yogasadhana.test', role: 'user', joinDate: '2023-11-15', favoriteStyle: 'Hatha Yoga', classesAttended: 14, status: 'activa', initials: 'AG', phone: '+34 612 111 222' },
      { id: 'test-user-marcos', name: 'Marcos Vidal Ruiz', email: 'marcos@yogasadhana.test', role: 'user', joinDate: '2024-01-10', favoriteStyle: 'Ashtanga', classesAttended: 5, status: 'activa', initials: 'MV', phone: '+34 622 333 444' },
      { id: 'test-user-lucia', name: 'Lucía Fernández Castro', email: 'lucia@yogasadhana.test', role: 'user', joinDate: '2022-05-20', favoriteStyle: 'Vinyasa Flow', classesAttended: 42, status: 'bono', initials: 'LF', phone: '+34 634 555 666' },
      { id: 'test-user-david', name: 'David Silva', email: 'david@yogasadhana.test', role: 'user', joinDate: '2024-02-01', favoriteStyle: 'Yin Yoga', classesAttended: 1, status: 'inactiva', initials: 'DS' },
      { id: 'test-admin-carmen', name: 'Carmen Directora', email: 'carmen@yogasadhana.test', role: 'admin', joinDate: '2020-01-01', favoriteStyle: 'Todos', classesAttended: 999, status: 'activa', initials: 'CD' }
    ];
    await this.batchSeed('users', users);
    console.log(`  ✓ Users: ${users.length} seeded`);
  }

  // ── Sample Orders ────────────────────────────────────────────────────────
  private async seedOrders(): Promise<void> {
    const ref = collection(this.fs, 'orders');
    const snap = await getDocs(ref);
    if (snap.size > 0) {
      console.log('  ↷ Orders already exist, skipping seed');
      return;
    }

    const now = Date.now();
    const orders = [
      {
        id: 'order-sample-001',
        invoiceNumber: 'YS-2024-0001',
        paymentReference: 'YS-REF-ANA01',
        userId: 'test-user-ana',
        customerInfo: { firstName: 'Ana', lastName: 'García Solano', email: 'ana@yogasadhana.test', phone: '+34 612 111 222', address: 'Calle Mayor 12, 3ºB', city: 'Madrid', postalCode: '28013', country: 'España' },
        items: [
          { productId: '1', productName: 'Esterilla Earth Cork PRO', quantity: 1, price: 65, thumbnail: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&q=80&w=200' },
          { productId: '3', productName: 'Aceite Ritual Sándalo', quantity: 2, price: 28, thumbnail: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=200' },
        ],
        subtotal: 121, shippingCost: 0, tax: 25.41, total: 121,
        status: 'Entregado', paymentMethod: 'Transferencia',
        bankTransferInfo: { iban: 'ES91 2100 0418 4502 0005 1332', beneficiary: 'YogaSadhana Studio S.L.', reference: 'YS-REF-ANA01', deadline: new Date(now - 10 * 86400000).toISOString() },
        createdAt: now - 15 * 86400000, paidAt: now - 12 * 86400000, shippedAt: now - 8 * 86400000, emailSent: true,
      },
      {
        id: 'order-sample-002',
        invoiceNumber: 'YS-2024-0002',
        paymentReference: 'YS-REF-MAR02',
        userId: 'test-user-marcos',
        customerInfo: { firstName: 'Marcos', lastName: 'Vidal Ruiz', email: 'marcos@yogasadhana.test', phone: '+34 622 333 444', address: 'Av. de la Constitución 44, 2ºA', city: 'Sevilla', postalCode: '41001', country: 'España' },
        items: [
          { productId: '18', productName: 'Iniciación Ashtanga', quantity: 1, price: 89, thumbnail: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&q=80&w=200' },
        ],
        subtotal: 89, shippingCost: 0, tax: 18.69, total: 89,
        status: 'Pendiente_Pago', paymentMethod: 'Transferencia',
        bankTransferInfo: { iban: 'ES91 2100 0418 4502 0005 1332', beneficiary: 'YogaSadhana Studio S.L.', reference: 'YS-REF-MAR02', deadline: new Date(now + 3 * 86400000).toISOString() },
        createdAt: now - 2 * 86400000, emailSent: true,
      },
      {
        id: 'order-sample-003',
        invoiceNumber: 'YS-2024-0003',
        paymentReference: 'YS-REF-LU03',
        customerInfo: { firstName: 'Lucía', lastName: 'Fernández Castro', email: 'lucia@yogasadhana.test', phone: '+34 634 555 666', address: 'Carrer de Valencia 98, 1º', city: 'Barcelona', postalCode: '08013', country: 'España' },
        items: [
          { productId: '2', productName: 'Zafu Meditación Lino', quantity: 1, price: 42, thumbnail: 'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?auto=format&fit=crop&q=80&w=200' },
          { productId: '15', productName: 'Leggings Flow Sculpt', quantity: 1, price: 45, thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=200' },
          { productId: '13', productName: 'Palo Santo Premium', quantity: 2, price: 14, thumbnail: 'https://images.unsplash.com/photo-1621683412586-baee23aa9e3f?auto=format&fit=crop&q=80&w=200' },
        ],
        subtotal: 115, shippingCost: 0, tax: 24.15, total: 115,
        status: 'Pagado', paymentMethod: 'Transferencia',
        bankTransferInfo: { iban: 'ES91 2100 0418 4502 0005 1332', beneficiary: 'YogaSadhana Studio S.L.', reference: 'YS-REF-LU03', deadline: new Date(now - 1 * 86400000).toISOString() },
        createdAt: now - 5 * 86400000, paidAt: now - 3 * 86400000, emailSent: true,
        adminNotes: 'Cliente habitual. Confirmar antes de enviar.',
      },
    ];

    for (const o of orders) {
      const { id, ...data } = o;
      await setDoc(doc(this.fs, `orders/${id}`), data);
    }
    console.log(`  ✓ Orders: ${orders.length} seeded`);
  }

  // ── Generic batch seed helper ────────────────────────────────────────────
  private async batchSeed(collectionName: string, items: Array<{ id: string } & Record<string, unknown>>): Promise<void> {
    for (const item of items) {
      const { id, ...data } = item;
      const ref = doc(this.fs, `${collectionName}/${id}`);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        await setDoc(ref, data);
      }
    }
  }
}
