import { create } from 'zustand';

type AppUser = {
  id: string;
  email: string;
  fullName: string;
  role: 'buyer' | 'farmer';
} | null;

interface AuthState {
  user: AppUser;
  token: string | null;
  pendingEmail: string | null;
  
  setAuth: (user: AppUser, token: string) => void;
  clearAuth: () => void;
  setPendingEmail: (email: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  pendingEmail: null,
  
  setAuth: (user, token) => set({ user, token }),
  clearAuth: () => set({ user: null, token: null }),
  setPendingEmail: (email) => set({ pendingEmail: email }),
}));
