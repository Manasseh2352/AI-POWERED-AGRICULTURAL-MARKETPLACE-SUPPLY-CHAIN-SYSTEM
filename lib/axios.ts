import { API_BASE_URL } from '@/constants/api';
import { useAuthStore } from '@/store/authStore';

// Simple fetch wrapper instead of axios to avoid potential React Native axios issues given minimal setup
export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = useAuthStore.getState().token;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const url = `${API_BASE_URL}${endpoint}`;
  
  console.log(`📡 [API] ${options.method || 'GET'} ${url}`);
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    // Parse json
    const data = await response.json().catch(() => null);
    
    if (!response.ok) {
      console.warn(`⚠️ [API Error] ${response.status} ${endpoint}:`, data);
      throw new Error(data?.error || `Request failed with status ${response.status}`);
    }
    
    return data;
  } catch (err: any) {
    if (err.message === 'Network request failed') {
       throw new Error(`Network Error: Ensure your backend is running and API_BASE_URL (${API_BASE_URL}) is reachable.`);
    }
    throw err;
  }
};
