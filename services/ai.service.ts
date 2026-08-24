import { apiFetch } from "@/lib/axios";

// Thin client over the backend's /ai/* endpoints. Every endpoint responds with
// { ok: true, result }, so each method unwraps and returns `result`. The
// backend computes these locally from our own Prisma data (no external ML
// service configured), so the shapes below are stable for the demo.

export type PricePrediction = {
  predictedPrice?: number;
  currency?: string;
  horizon?: string;
  modelInfo?: { engine?: string; method?: string; samples?: number };
};

export type DemandForecast = {
  forecast?: number[];
  dates?: string[];
  units?: string;
  modelInfo?: {
    engine?: string;
    method?: string;
    windowDays?: number;
    dailyAverage?: number;
    samples?: number;
  };
};

export type ProfitEstimate = {
  estimatedProfit?: number;
  currency?: string;
  profitMargin?: number;
  modelInfo?: {
    engine?: string;
    method?: string;
    revenue?: number;
    cost?: number;
    costAssumed?: boolean;
    quantityKg?: number;
  };
};

export type CropRecommendation = {
  recommendations?: Array<{
    cropName?: string;
    confidence?: number;
    notes?: string;
  }>;
  modelInfo?: { engine?: string; method?: string };
};

export type ShippingRecommendation = {
  recommendation?: {
    shipmentType?: string;
    recommendedCarrier?: string;
    etaDays?: number;
    costEstimate?: number;
    currency?: string;
    notes?: string;
  };
  modelInfo?: { engine?: string; method?: string; weightKg?: number };
};

export const AiService = {
  // Predict next-cycle price per kg. Pass a productId to anchor on that
  // listing's history, or omit for a market-average estimate.
  predictPrice: async (input?: {
    productId?: string;
    state?: string;
    region?: string;
    currency?: string;
  }): Promise<PricePrediction> => {
    const res = await apiFetch("/ai/price-prediction", {
      method: "POST",
      body: JSON.stringify(input ?? {}),
    });
    return res?.result ?? {};
  },

  // Forecast daily demand (kg) over a horizon (default 14 days on the backend).
  forecastDemand: async (input?: {
    productId?: string;
    horizonDays?: number;
    state?: string;
    region?: string;
  }): Promise<DemandForecast> => {
    const res = await apiFetch("/ai/demand-forecasting", {
      method: "POST",
      body: JSON.stringify(input ?? {}),
    });
    return res?.result ?? {};
  },

  // Estimate profit for a listing (or from explicit revenue/cost figures).
  estimateProfit: async (input?: {
    productId?: string;
    expectedSellPrice?: number;
    expectedCost?: number;
    expectedRevenue?: number;
    currency?: string;
  }): Promise<ProfitEstimate> => {
    const res = await apiFetch("/ai/profit-estimation", {
      method: "POST",
      body: JSON.stringify(input ?? {}),
    });
    return res?.result ?? {};
  },

  // Rank the three supported crops by current market value.
  recommendCrop: async (input?: {
    state?: string;
    season?: string;
    soilType?: string;
    budget?: number;
    riskProfile?: "LOW" | "MEDIUM" | "HIGH";
  }): Promise<CropRecommendation> => {
    const res = await apiFetch("/ai/crop-recommendation", {
      method: "POST",
      body: JSON.stringify(input ?? {}),
    });
    return res?.result ?? {};
  },

  // Recommend a shipment mode + cost/ETA for an order or a raw weight.
  recommendShipping: async (input?: {
    orderId?: string;
    destinationCountry?: string;
    weightKg?: number;
    shipmentType?: string;
  }): Promise<ShippingRecommendation> => {
    const res = await apiFetch("/ai/shipping-recommendation", {
      method: "POST",
      body: JSON.stringify(input ?? {}),
    });
    return res?.result ?? {};
  },
};
