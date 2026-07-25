export type Category = 'T-Shirt' | 'Pant' | 'Dress' | 'Jacket' | 'Shoes' | 'Bag';
export type Gender = 'Men' | 'Women' | 'Unisex';

export interface VariantStock {
  size: string;
  color: string;
  stock: number;
}

export interface PricePoint {
  date: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: Category;
  gender: Gender;
  price: number;
  compareAtPrice: number | null;
  sizes: string[];
  colors: string[];
  images: string[];
  variantStock: VariantStock[];
  totalStock: number;
  rating: number;
  reviewCount: number;
  description: string;
  createdAt: string;
  priceHistory: PricePoint[];
  competitorPrice: number;
}
