// Persistent auth storage.
// Native: expo-secure-store (encrypted Keychain / Keystore) for the JWT.
// Web: expo-secure-store is unavailable, so fall back to AsyncStorage.
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const TOKEN_KEY = "auth.token";
const USER_KEY = "auth.user";

const isWeb = Platform.OS === "web";

async function setItem(key: string, value: string): Promise<void> {
  if (isWeb) return AsyncStorage.setItem(key, value);
  return SecureStore.setItemAsync(key, value);
}

async function getItem(key: string): Promise<string | null> {
  if (isWeb) return AsyncStorage.getItem(key);
  return SecureStore.getItemAsync(key);
}

async function deleteItem(key: string): Promise<void> {
  if (isWeb) return AsyncStorage.removeItem(key);
  return SecureStore.deleteItemAsync(key);
}

export type StoredUser = {
  id: string;
  email: string;
  fullName: string;
  role: "buyer" | "farmer";
} | null;

export const saveToken = (token: string) => setItem(TOKEN_KEY, token);
export const getToken = () => getItem(TOKEN_KEY);
export const removeToken = () => deleteItem(TOKEN_KEY);

export const saveUser = async (user: StoredUser) => {
  if (!user) return deleteItem(USER_KEY);
  return setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = async (): Promise<StoredUser> => {
  const raw = await getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
};

export const clearAuthStorage = async () => {
  await Promise.all([removeToken(), deleteItem(USER_KEY)]);
};
