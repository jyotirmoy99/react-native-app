import { create } from "zustand";

interface UserStore {
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
}

export const userUserStore = create<UserStore>((set) => ({
  isAdmin: false,
  setIsAdmin: (value) => set({ isAdmin: value }),
}));
