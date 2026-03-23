"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "./auth.type";

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user) =>
        set({ user, isAuthenticated: !!user }),

      logout: () =>
        set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "paketjet-auth",
      partialize: (s) => ({ user: s.user, isAuthenticated: s.isAuthenticated }),
    }
  )
);
