export interface Address {
  id: string;
  userId: string;
  name?: string;
  firstName: string;
  lastName: string;
  street: string;
  apartment?: string; // Puerta, piso, bloque (opcional)
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  dni?: string;
  isDefault: boolean;
  createdAt: number;
}
