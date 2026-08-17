import { apiFetch } from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import type { StoredUser } from "@/lib/storage";

// The backend's public user is { id, email, phone, role, status, displayName }
// with role as the RAW uppercase enum ("BUYER" | "FARMER"). The app stores a
// flatter user with a lowercase role and a `fullName`, so every auth response
// is normalized through here before it touches the store.
function normalizeUser(raw: any, fallbackEmail?: string): NonNullable<StoredUser> {
  const role =
    String(raw?.role ?? "").toUpperCase() === "FARMER" ? "farmer" : "buyer";
  return {
    id: raw?.id ?? "",
    email: raw?.email ?? fallbackEmail ?? "",
    fullName: raw?.displayName ?? raw?.fullName ?? "",
    role,
  };
}

export type RegisterInput = {
  email: string;
  password: string;
  fullName: string;
  role: "buyer" | "farmer";
  phone?: string;
  // Farmer-only profile fields.
  farmName?: string;
  location?: string;
};

export const AuthService = {
  // Hard gate: the backend creates a PENDING user, issues NO token, and fires a
  // SIGNUP OTP. Response is { ok, otpRequired, purpose:"SIGNUP", email }. The
  // client routes to the OTP screen; verifying the code flips the account
  // ACTIVE, after which the user logs in to obtain a token.
  register: async (data: RegisterInput) => {
    const payload: Record<string, unknown> = {
      email: data.email,
      password: data.password,
      fullName: data.fullName,
      role: data.role === "farmer" ? "FARMER" : "BUYER",
    };
    if (data.phone) payload.phone = data.phone;
    if (data.farmName) payload.farmName = data.farmName;
    if (data.location) payload.location = data.location;

    const response = await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    // No token/user comes back under the hard gate. Stash the email so the OTP
    // screen knows who is verifying, then let the caller route to it.
    useAuthStore.getState().setPendingEmail(data.email);

    return response;
  },

  // (Re)issue an OTP for an email. Called on the OTP screen to guarantee a
  // fresh code exists (register fires one too, but this removes any race and
  // powers the "Resend code" button).
  resendOtp: async (
    email: string,
    purpose: "LOGIN" | "SIGNUP" = "SIGNUP"
  ) => {
    return apiFetch("/auth/otp/resend", {
      method: "POST",
      body: JSON.stringify({ email, purpose }),
    });
  },

  // Hard gate: an ACTIVE account gets { ok, accessToken, user } which we persist.
  // A PENDING account is rejected with 403 { otpRequired, purpose:"LOGIN", email }
  // (the backend fires a LOGIN OTP); we surface that as a structured result so the
  // screen can route to OTP verification instead of treating it as a thrown error.
  login: async (email: string, password: string) => {
    try {
      const response = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      // ACTIVE path: persist the REAL user so the router sends farmers/buyers to
      // the correct stack.
      const user = normalizeUser(response?.user, email);
      if (response?.ok && response?.accessToken) {
        useAuthStore.getState().setAuth(user, response.accessToken);
      }
      return { ...response, user };
    } catch (err: any) {
      if (err?.status === 403 && err?.data?.otpRequired) {
        useAuthStore.getState().setPendingEmail(err.data.email ?? email);
        return {
          ok: false as const,
          otpRequired: true as const,
          purpose: (err.data.purpose ?? "LOGIN") as "LOGIN" | "SIGNUP",
          email: (err.data.email ?? email) as string,
        };
      }
      throw err;
    }
  },

  verifyOTP: async (email: string, otp: string, purpose: "LOGIN" | "SIGNUP") => {
    const response = await apiFetch("/auth/otp/verify", {
      method: "POST",
      body: JSON.stringify({ email, purpose, otp }),
    });

    if (response?.ok) {
      useAuthStore.getState().setPendingEmail(email);
    }

    return response;
  },

  logout: () => {
    useAuthStore.getState().clearAuth();
  },
};
