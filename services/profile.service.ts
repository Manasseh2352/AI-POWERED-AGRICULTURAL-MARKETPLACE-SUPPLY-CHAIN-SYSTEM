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

// Build a stable multipart file part from a local image URI. React Native
// accepts a Blob/File-like object here; raw { uri, name, type } objects can
// fail on some runtimes with `unsupported FormDataPart implementation`.
async function imageFilePart(uri: string): Promise<Blob> {
  const name = uri.split("/").pop() || `upload-${Date.now()}.jpg`;
  const ext = (/\.(\w+)$/.exec(name)?.[1] || "jpg").toLowerCase();
  const type =
    ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";

  const response = await fetch(uri);
  const blob = await response.blob();

  // The Blob from fetch() preserves the correct MIME type for the underlying
  // image, which avoids native runtime incompatibilities.
  if (blob.type === "" && type) {
    return new Blob([blob], { type });
  }

  return blob;
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
    const fileName = uri.split("/").pop() || `profile-${Date.now()}.jpg`;
    const file = await imageFilePart(uri);
    form.append("image", file, fileName);
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
    const fileName = uri.split("/").pop() || `profile-${Date.now()}.jpg`;
    const file = await imageFilePart(uri);
    form.append("image", file, fileName);
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
