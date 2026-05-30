import { create } from "zustand";

type RoleStore = {
  role: "buyer" | "farmer" | null;
  setRole: (role: "buyer" | "farmer") => void;
};

export const useRoleStore = create<RoleStore>((set) => ({
  role: null,
  setRole: (role) => set({ role }),
}));