import Constants from "expo-constants";

// Backend port (see production-backend/.env -> PORT=5001).
const BACKEND_PORT = 5001;

// In Expo Go dev, Metro runs on your machine's LAN IP. The backend runs on the
// same machine, so we reuse Metro's host and never hardcode an IP that goes
// stale when you change networks. Routes are mounted at the root (/auth, /health,
// ...), so there is NO /api prefix and no trailing slash.
function deriveDevHost(): string | null {
  const hostUri =
    Constants.expoConfig?.hostUri ??
    (Constants as any).expoGoConfig?.hostUri ??
    null;
  // hostUri looks like "172.20.10.3:8081" -> take the host part.
  return hostUri ? hostUri.split(":")[0] : null;
}

function resolveBaseUrl(): string {
  // Explicit override wins: set EXPO_PUBLIC_API_URL for a physical device on a
  // different network, or for a deployed backend.
  const override = process.env.EXPO_PUBLIC_API_URL;
  if (override) return override.replace(/\/+$/, "");

  const devHost = deriveDevHost();
  if (devHost) return `http://${devHost}:${BACKEND_PORT}`;

  // Last resort (e.g. a build with no dev server and no override set).
  return `http://localhost:${BACKEND_PORT}`;
}

export const API_BASE_URL = resolveBaseUrl();

// Debug bypass for OTP in dev mode (server-controlled).
// Set OTP_DEBUG_BYPASS=true and OTP_DEBUG_BYPASS_CODE=123456 (or custom) in backend env.
export const DEV_BYPASS_OTP = true;
