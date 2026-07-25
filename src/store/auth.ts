import { create } from 'zustand';
import { getItem, setItem, removeItem } from '../lib/storage';
import { sha256 } from '../lib/hash';
import type { User, Session } from '../types/user';

interface AuthState {
  user: User | null;
  isAuthed: boolean;
  isReady: boolean;
  error: string | null;
  initAuth: () => void;
  signUp: (data: { name: string; email: string; password: string }) => Promise<{ ok: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  completeOnboarding: (businessName: string, industry: string) => void;
  logOut: () => void;
  clearError: () => void;
}

function getUsers(): User[] {
  return getItem<User[]>('cl_users', []);
}
function saveUsers(users: User[]) {
  setItem('cl_users', users);
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthed: false,
  isReady: false,
  error: null,

  initAuth: () => {
    const session = getItem<Session | null>('cl_session', null);
    if (session) {
      const users = getUsers();
      const user = users.find((u) => u.id === session.userId) || null;
      if (user) {
        set({ user, isAuthed: true, isReady: true });
        return;
      }
    }
    set({ isReady: true });
  },

  signUp: async ({ name, email, password }) => {
    const users = getUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      const error = 'An account with this email already exists.';
      set({ error });
      return { ok: false, error };
    }
    const passwordHash = await sha256(password);
    const user: User = {
      id: `u${Date.now()}`,
      name,
      email,
      passwordHash,
      businessName: '',
      industry: '',
      avatar: `https://i.pravatar.cc/150?u=${email}`,
      createdAt: new Date().toISOString(),
    };
    saveUsers([...users, user]);
    setItem<Session>('cl_session', { userId: user.id, loggedInAt: new Date().toISOString() });
    set({ user, isAuthed: true, error: null });
    return { ok: true };
  },

  signIn: async (email, password) => {
    const users = getUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      const error = 'No account found with this email.';
      set({ error });
      return { ok: false, error };
    }
    const hash = await sha256(password);
    if (hash !== user.passwordHash) {
      const error = 'Incorrect password. Please try again.';
      set({ error });
      return { ok: false, error };
    }
    setItem<Session>('cl_session', { userId: user.id, loggedInAt: new Date().toISOString() });
    set({ user, isAuthed: true, error: null });
    return { ok: true };
  },

  completeOnboarding: (businessName, industry) => {
    const { user } = get();
    if (!user) return;
    const users = getUsers();
    const updated = { ...user, businessName, industry };
    saveUsers(users.map((u) => (u.id === user.id ? updated : u)));
    set({ user: updated });
  },

  logOut: () => {
    removeItem('cl_session');
    set({ user: null, isAuthed: false });
  },

  clearError: () => set({ error: null }),
}));
