import { API_BASE_URL } from '@/constants/api';
import { useAuthStore } from '@/store/authStore';

// Simple fetch wrapper instead of axios to avoid potential React Native axios issues given minimal setup
export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = useAuthStore.getState().token;

  // Normalize headers to a plain object so we can safely add Authorization.
  // For FormData bodies we must NOT set Content-Type — fetch has to set it
  // itself so it can include the multipart boundary (used by image uploads).
  const isFormData =
    typeof FormData !== 'undefined' && options.body instanceof FormData;

  const mergedHeaders: Record<string, string> = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers as any),
  };

  if (token) {
    mergedHeaders['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;
  
  
  console.log(`📡 [API] ${options.method || 'GET'} ${url}`);
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: mergedHeaders,
    });

    
    // Parse json
    const data = await response.json().catch(() => null);
    
    if (!response.ok) {
      console.warn(`⚠️ [API Error] ${response.status} ${endpoint}:`, data);
      // Preserve the HTTP status + parsed body on the thrown error so callers can
      // branch on them (e.g. login's 403 { otpRequired, purpose, email }).
      // `.message` stays populated, so existing `err.message` handling still works.
      const error: any = new Error(
        data?.error || `Request failed with status ${response.status}`
      );
      error.status = response.status;
      error.data = data;
      throw error;
    }
    
    return data;
  } catch (err: any) {
    // Only rewrite genuine transport failures (no response at all). An error we
    // shaped above carries a numeric `status`, so let those pass through untouched.
    if (
      err?.status === undefined &&
      (err?.message === 'Network request failed' ||
        err?.message === 'Failed to fetch')
    ) {
      throw new Error(
        `Network Error: Ensure your backend is running and API_BASE_URL (${API_BASE_URL}) is reachable.`
      );
    }
    throw err;
  }
};
