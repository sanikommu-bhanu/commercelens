import { create } from 'zustand';
import { getItem, setItem, scopedKey } from '../lib/storage';

interface WishlistState {
  ids: string[];
  userId: string | null;
  load: (userId: string) => void;
  toggle: (productId: string) => boolean; // returns true if now liked
  isLiked: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  ids: [],
  userId: null,

  load: (userId) => {
    const ids = getItem<string[]>(scopedKey('cl_wishlist', userId), []);
    set({ userId, ids });
  },

  toggle: (productId) => {
    const { ids, userId } = get();
    const has = ids.includes(productId);
    const next = has ? ids.filter((id) => id !== productId) : [...ids, productId];
    set({ ids: next });
    if (userId) setItem(scopedKey('cl_wishlist', userId), next);
    return !has;
  },

  isLiked: (productId) => get().ids.includes(productId),
}));
