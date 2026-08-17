import { create } from 'zustand';
import {
  saveToken,
  saveUser,
  clearAuthStorage,
  getToken,
  getUser,
  type StoredUser,
} from '@/lib/storage';

type AppUser = StoredUser;

interface AuthState {
  user: AppUser;
  token: string | null;
  pendingEmail: string | null;
  pendingOtp: string | null;
  // Held only in memory for the LOGIN-OTP flow: when a PENDING account tries to
  // log in, the backend gates it behind an OTP. We stash the password here so
  // that, once the OTP verifies (PENDING -> ACTIVE), we can transparently retry
  // the login to obtain a token. NEVER persisted to disk.
  pendingPassword: string | null;

  // True once we've attempted to restore auth from persistent storage.
  // The router waits for this so it doesn't bounce a logged-in user to splash.
  hydrated: boolean;

  hydrate: () => Promise<void>;
  setAuth: (user: AppUser, token: string) => void;
  clearAuth: () => void;
  setPendingEmail: (email: string) => void;
  setPendingOtp: (otp: string) => void;
  clearPendingOtp: () => void;
  setPendingPassword: (password: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  pendingEmail: null,
  pendingOtp: null,
  pendingPassword: null,
  hydrated: false,

  hydrate: async () => {
    try {
      const [token, user] = await Promise.all([getToken(), getUser()]);
      set({ token: token ?? null, user: user ?? null });
    } catch {
      // Corrupt/unavailable storage — start logged out rather than crash.
      set({ token: null, user: null });
    } finally {
      set({ hydrated: true });
    }
  },

  setAuth: (user, token) => {
    set({ user, token });
    // Persist in the background; UI doesn't need to await disk writes.
    void saveToken(token);
    void saveUser(user);
  },

  clearAuth: () => {
    set({
      user: null,
      token: null,
      pendingEmail: null,
      pendingOtp: null,
      pendingPassword: null,
    });
    void clearAuthStorage();
  },

  setPendingEmail: (email) => set({ pendingEmail: email }),
  setPendingOtp: (otp) => set({ pendingOtp: otp }),
  clearPendingOtp: () => set({ pendingOtp: null }),
  setPendingPassword: (password) => set({ pendingPassword: password }),
}));
