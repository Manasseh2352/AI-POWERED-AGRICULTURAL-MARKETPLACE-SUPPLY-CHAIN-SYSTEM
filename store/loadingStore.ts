import { create } from "zustand";

type LoadingStore = {
  loading: boolean;
  setLoading: (value: boolean) => void;
};

export const useLoadingStore = create<LoadingStore>((set) => ({
  loading: false,
  setLoading: (value) => set({ loading: value }),
}));
