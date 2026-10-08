import { apiFetch } from "@/lib/axios";

// Restricted product types supported by the marketplace: non-perishable tubers.
export type ProductType = "YAM" | "SWEET_POTATO" | "CASSAVA" | "WATER_YAM";

// Human-readable labels for each tuber type. Used for display names and the
// description fallback, since the raw enum (e.g. SWEET_POTATO) isn't
// presentation-ready.
export const PRODUCT_LABELS: Record<ProductType, string> = {
  YAM: "Yam",
  SWEET_POTATO: "Sweet Potato",
  CASSAVA: "Cassava",
  WATER_YAM: "Water Yam",
};

// Normalized product shape the UI consumes. The backend returns Prisma
// `Product` rows (Decimal fields serialize to strings, productName is an enum,
// the owning farmer is nested under `farmerProfile`), so we map those into a
// flat, number-typed shape here — screens never touch raw backend fields.
export type UiProduct = {
  id: string;
  productName: ProductType;
  name: string;
  description: string;
  pricePerKg: number;
  quantityKg: number;
  images: string[];
  seller: string;
  farmerImageUrl: string | null;
  location: string | null;
  destinationCountry: string | null;
};

export function mapProduct(p: any): UiProduct {
  const type = String(p?.productName ?? "").toUpperCase() as ProductType;
  const label = PRODUCT_LABELS[type] ?? "Produce";
  const qty = Number(p?.quantityKg ?? 0);
  return {
    id: p?.id,
    productName: type,
    name: label,
    description:
      p?.description && String(p.description).trim().length > 0
        ? p.description
        : `Fresh ${label} — ${qty.toLocaleString()}kg available`,
    pricePerKg: Number(p?.pricePerKg ?? 0),
    quantityKg: qty,
    images: Array.isArray(p?.images) ? p.images : [],
    seller:
      p?.farmerProfile?.farmName ??
      p?.farmerProfile?.displayName ??
      "Verified Farmer",
    farmerImageUrl: p?.farmerProfile?.profileImageUrl ?? null,
    location: p?.location ?? p?.farmerProfile?.location ?? null,
    destinationCountry: p?.destinationCountry ?? null,
  };
}

export const ProductService = {
  // Buyer catalog (ACTIVE products across all farmers).
  getAllProducts: async (opts?: {
    q?: string;
    productName?: ProductType;
  }): Promise<UiProduct[]> => {
    const params = new URLSearchParams();
    if (opts?.q) params.set("q", opts.q);
    if (opts?.productName) params.set("productName", opts.productName);
    const qs = params.toString();
    const res = await apiFetch(`/buyer/products${qs ? `?${qs}` : ""}`);
    return (res?.products ?? []).map(mapProduct);
  },

  getProductById: async (id: string): Promise<UiProduct | null> => {
    const res = await apiFetch(`/buyer/products/${id}`);
    return res?.product ? mapProduct(res.product) : null;
  },

  // Farmer's own listings (any status), newest first.
  getMyProducts: async (): Promise<UiProduct[]> => {
    const res = await apiFetch("/farmer/products");
    return (res?.products ?? []).map(mapProduct);
  },

  // Farmer uploads produce. Price is optional — the backend resolves one from
  // market/history when `unitPriceOverride` is omitted.
  createProduct: async (data: {
    productName: ProductType;
    quantityKg: number;
    unitPriceOverride?: number;
    state?: string;
    location?: string;
    description?: string;
    destinationCountry?: string;
    images?: string[];
  }): Promise<UiProduct> => {
    const res = await apiFetch("/farmer/products", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return mapProduct(res?.product);
  },

  // Upload a single product photo (local image URI) to ImageKit via the
  // backend and return its hosted URL. Callers collect these URLs and pass them
  // as `images` to createProduct.
  uploadProductImage: async (uri: string): Promise<string> => {
    const name = uri.split("/").pop() || `product-${Date.now()}.jpg`;
    const ext = (/\.(\w+)$/.exec(name)?.[1] || "jpg").toLowerCase();
    const type =
      ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";

    const form = new FormData();
    form.append("image", { uri, name, type } as any);

    const res = await apiFetch("/farmer/product-image", {
      method: "POST",
      body: form,
    });
    return res?.url as string;
  },
};
