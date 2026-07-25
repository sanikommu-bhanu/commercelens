import { create } from 'zustand';
import { getItem, setItem } from '../lib/storage';

export type Theme = 'light' | 'dark' | 'system';

export interface Toast {
  id: number;
  message: string;
  tone?: 'default' | 'success' | 'error';
}

interface UiState {
  theme: Theme;
  toasts: Toast[];
  currency: string;
  language: string;
  initTheme: () => void;
  setTheme: (t: Theme) => void;
  pushToast: (message: string, tone?: Toast['tone']) => void;
  dismissToast: (id: number) => void;
  setCurrency: (c: string) => void;
  setLanguage: (l: string) => void;
}

function applyTheme(theme: Theme) {
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', isDark);
}

let toastId = 0;

export const useUiStore = create<UiState>((set, get) => ({
  theme: getItem<Theme>('cl_theme', 'light'),
  toasts: [],
  currency: getItem<string>('cl_currency', 'USD ($)'),
  language: getItem<string>('cl_language', 'English'),

  initTheme: () => {
    applyTheme(get().theme);
  },

  setTheme: (t) => {
    setItem('cl_theme', t);
    applyTheme(t);
    set({ theme: t });
  },

  pushToast: (message, tone = 'default') => {
    const id = ++toastId;
    set({ toasts: [...get().toasts, { id, message, tone }] });
    setTimeout(() => get().dismissToast(id), 2600);
  },

  dismissToast: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),

  setCurrency: (c) => {
    setItem('cl_currency', c);
    set({ currency: c });
  },
  setLanguage: (l) => {
    setItem('cl_language', l);
    set({ language: l });
  },
}));
