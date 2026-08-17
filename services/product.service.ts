import { apiFetch } from "@/lib/axios";

// Restricted product types supported by the marketplace.
export type ProductType = "YAM" | "TOMATO" | "POTATO";

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
  location: string | null;
  destinationCountry: string | null;
  perishable: boolean;
};

const titleCase = (s: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s;

// Only tomatoes are treated as perishable (air freight); yam & potato are
// shelf-stable (sea freight). Used for transport recommendations in the UI.
const isPerishable = (type: string) => String(type).toUpperCase() === "TOMATO";

export function mapProduct(p: any): UiProduct {
  const type = String(p?.productName ?? "").toUpperCase() as ProductType;
  const qty = Number(p?.quantityKg ?? 0);
  return {
    id: p?.id,
    productName: type,
    name: titleCase(p?.productName ?? "Produce"),
    description:
      p?.description && String(p.description).trim().length > 0
        ? p.description
        : `Fresh ${titleCase(p?.productName ?? "produce")} — ${qty.toLocaleString()}kg available`,
    pricePerKg: Number(p?.pricePerKg ?? 0),
    quantityKg: qty,
    images: Array.isArray(p?.images) ? p.images : [],
    seller:
      p?.farmerProfile?.farmName ??
      p?.farmerProfile?.displayName ??
      "Verified Farmer",
    location: p?.location ?? p?.farmerProfile?.location ?? null,
    destinationCountry: p?.destinationCountry ?? null,
    perishable: isPerishable(type),
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
};
