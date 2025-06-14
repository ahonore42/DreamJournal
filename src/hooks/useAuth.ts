import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  user: { name: string; email: string } | null;
  signIn: () => void;
  signOut: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  signIn: () =>
    set({
      isAuthenticated: true,
      user: { name: "Dream Seeker", email: "dreamer@example.com" },
    }),
  signOut: () => set({ isAuthenticated: false, user: null }),
}));
