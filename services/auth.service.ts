import { apiFetch, setAuthToken } from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";

export const AuthService = {
  register: async (data: any) => {
    const response = await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response;
  },

  login: async (email: string, password: string) => {
    const response = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (!response.error && response.data) {
      const { token, user } = response.data;
      if (token) {
        await setAuthToken(token);
        useAuthStore.getState().setAuth(user, token);
      }
    }

    return response;
  },

  verifyOTP: async (email: string, otp: string) => {
    const response = await apiFetch("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    });

    if (!response.error && response.data) {
      const { token, user } = response.data;
      if (token) {
        await setAuthToken(token);
        useAuthStore.getState().setAuth(user, token);
      }
    }

    return response;
  },

  logout: () => {
    useAuthStore.getState().clearAuth();
  },
};
