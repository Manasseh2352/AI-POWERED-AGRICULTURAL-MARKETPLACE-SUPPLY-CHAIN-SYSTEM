import { apiFetch } from "@/lib/axios";

// Backend profile/dashboard contracts (production-backend):
//   GET  /buyer/profile     -> { ok, profile }
//   GET  /buyer/dashboard   -> { ok, dashboard }
//   GET  /farmer/profile    -> { ok, profile }
//   GET  /farmer/dashboard  -> { ok, dashboard }
//   POST /buyer/profile-image  (multipart "image")  -> { ok, profile }
//   POST /farmer/profile-image (multipart "image")  -> { ok, profile }
// Money fields are Prisma Decimal(18,2), which serialize to STRINGS in JSON —
// hence the `number | string` types and the Number()-coercing formatter below.

export type BuyerProfile = {
  id: string;
  userId: string;
  displayName: string;
  status: string;
  profileImageUrl: string | null;
  profileImagePublicId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type FarmerProfile = BuyerProfile & {
  farmName: string | null;
  location: string | null;
};

export type BuyerDashboard = {
  totalOrders: number;
  activeOrders: number;
  totalSpent: number | string;
  wishlistCount: number;
  savedProductsCount: number;
};

export type FarmerDashboard = {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number | string;
  activeShipments: number;
};

// Build the React Native multipart file part for an on-device image URI.
// RN's FormData accepts a { uri, name, type } object for file fields.
function imageFilePart(uri: string) {
  const name = uri.split("/").pop() || `upload-${Date.now()}.jpg`;
  const ext = (/\.(\w+)$/.exec(name)?.[1] || "jpg").toLowerCase();
  const type =
    ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
  return { uri, name, type } as any;
}

export const ProfileService = {
  getBuyerProfile: async (): Promise<BuyerProfile | null> => {
    const res = await apiFetch("/buyer/profile");
    return res?.profile ?? null;
  },
  getFarmerProfile: async (): Promise<FarmerProfile | null> => {
    const res = await apiFetch("/farmer/profile");
    return res?.profile ?? null;
  },
  getBuyerDashboard: async (): Promise<BuyerDashboard | null> => {
    const res = await apiFetch("/buyer/dashboard");
    return res?.dashboard ?? null;
  },
  getFarmerDashboard: async (): Promise<FarmerDashboard | null> => {
    const res = await apiFetch("/farmer/dashboard");
    return res?.dashboard ?? null;
  },

  // Upload a new avatar (local image URI) and return the updated profile.
  uploadFarmerProfileImage: async (
    uri: string
  ): Promise<FarmerProfile | null> => {
    const form = new FormData();
    form.append("image", imageFilePart(uri));
    const res = await apiFetch("/farmer/profile-image", {
      method: "POST",
      body: form,
    });
    return res?.profile ?? null;
  },
  uploadBuyerProfileImage: async (
    uri: string
  ): Promise<BuyerProfile | null> => {
    const form = new FormData();
    form.append("image", imageFilePart(uri));
    const res = await apiFetch("/buyer/profile-image", {
      method: "POST",
      body: form,
    });
    return res?.profile ?? null;
  },
};

// Whole-dollar formatter with thousands separators. Avoids Intl/toLocaleString,
// which is unreliable on Hermes (Android). e.g. "24810.50" -> "$24,811".
// NOTE: this stays USD-only; currency-aware display goes through useMoney().
export const formatMoney = (value: number | string | null | undefined): string => {
  const n = Math.round(Number(value ?? 0) || 0);
  const sign = n < 0 ? "-" : "";
  const digits = Math.abs(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${sign}$${digits}`;
};
