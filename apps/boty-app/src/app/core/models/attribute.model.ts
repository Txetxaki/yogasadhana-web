export interface ProductAttribute {
  name: string; // e.g., 'Color', 'Talla', 'Material'
  values: string[]; // e.g., ['Rojo', 'Azul'], ['S', 'M', 'L']
}

// Global attribute definition for the store
export interface GlobalAttribute {
  id: string;
  name: string;
  options: string[];
}
