export interface ProductAttribute {
  name: string;
  values: string[];
}

export type AttributeType = 'text' | 'color';

export interface GlobalAttribute {
  id: string;
  name: string;
  type: AttributeType;
  options: string[];
}
