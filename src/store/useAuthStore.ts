import { User } from "@/drizzle/schema";
import { create } from "zustand";

type AuthState = {
  userDetails: User | null;
  setUserDetails: (user: User | null) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  userDetails: null,
  setUserDetails: (user) => set({ userDetails: user }),
}));
