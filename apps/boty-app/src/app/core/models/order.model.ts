export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  selectedAttributes?: { [key: string]: string };
  thumbnail?: string;
}

export type OrderStatus =
  | 'Pendiente_Pago'
  | 'Pagado'
  | 'Enviado'
  | 'Entregado'
  | 'Cancelado';

export type PaymentMethod = 'Transferencia';

export interface Order {
  id: string;
  userId?: string;
  invoiceNumber: string;          // YS-2024-0001
  paymentReference: string;       // YS-REF-XXXXXX (para transferencia)
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dni?: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;                    // IVA 21% sobre subtotal
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  bankTransferInfo: {
    iban: string;
    beneficiary: string;
    reference: string;
    deadline: string;             // Timestamp ISO
  };
  createdAt: number;
  paidAt?: number;
  shippedAt?: number;
  trackingNumber?: string;
  adminNotes?: string;
  invoiceHtml?: string;           // HTML de la factura generada
  emailSent?: boolean;
}
