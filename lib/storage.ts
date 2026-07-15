// Placeholder storage just using in-memory for simple dev. 
// For production, use `expo-secure-store` or `@react-native-async-storage/async-storage`

let tokenCache: string | null = null;

export const saveToken = async (token: string) => {
  tokenCache = token;
};

export const getToken = async () => {
  return tokenCache;
};

export const removeToken = async () => {
  tokenCache = null;
};
