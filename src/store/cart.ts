import { create } from 'zustand';
import { getItem, setItem, scopedKey } from '../lib/storage';
import type { Product } from '../types/product';

export interface CartLine {
  productId: string;
  name: string;
  image: string;
  price: number;
  size: string;
  color: string;
  qty: number;
}

interface CartState {
  lines: CartLine[];
  userId: string | null;
  load: (userId: string) => void;
  addToCart: (product: Product, size: string, color: string, qty?: number) => void;
  removeLine: (index: number) => void;
  setQty: (index: number, qty: number) => void;
  clear: () => void;
  subtotal: () => number;
}

function persist(userId: string | null, lines: CartLine[]) {
  if (!userId) return;
  setItem(scopedKey('cl_cart', userId), lines);
}

export const useCartStore = create<CartState>((set, get) => ({
  lines: [],
  userId: null,

  load: (userId) => {
    const lines = getItem<CartLine[]>(scopedKey('cl_cart', userId), []);
    set({ userId, lines });
  },

  addToCart: (product, size, color, qty = 1) => {
    const { lines, userId } = get();
    const idx = lines.findIndex((l) => l.productId === product.id && l.size === size && l.color === color);
    let next: CartLine[];
    if (idx >= 0) {
      next = lines.map((l, i) => (i === idx ? { ...l, qty: l.qty + qty } : l));
    } else {
      next = [
        ...lines,
        { productId: product.id, name: product.name, image: product.images[0], price: product.price, size, color, qty },
      ];
    }
    set({ lines: next });
    persist(userId, next);
  },

  removeLine: (index) => {
    const { lines, userId } = get();
    const next = lines.filter((_, i) => i !== index);
    set({ lines: next });
    persist(userId, next);
  },

  setQty: (index, qty) => {
    const { lines, userId } = get();
    const next = lines.map((l, i) => (i === index ? { ...l, qty: Math.max(1, qty) } : l));
    set({ lines: next });
    persist(userId, next);
  },

  clear: () => {
    const { userId } = get();
    set({ lines: [] });
    persist(userId, []);
  },

  subtotal: () => get().lines.reduce((sum, l) => sum + l.price * l.qty, 0),
}));
