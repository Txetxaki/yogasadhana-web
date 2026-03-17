export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  selectedAttributes?: { [key: string]: string }; // e.g. { 'Color': 'Rojo', 'Talla': 'M' }
  thumbnail?: string;
}

export interface Order {
  id: string;
  userId?: string; // Optional if guest checkout
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  status: 'Pendiente' | 'Pagado' | 'Enviado' | 'Entregado' | 'Cancelado';
  createdAt: number;
  trackingNumber?: string;
  paymentMethod: 'CreditCard' | 'PayPal' | 'Transferencia';
}
