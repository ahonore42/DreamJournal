import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthState {
  isAuthenticated: boolean;
  user: { name: string; email: string } | null;
  isLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  initializeAuth: () => Promise<void>;
}

const AUTH_STORAGE_KEY = "@dreamjournal_auth";

export const useAuth = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  user: null,
  isLoading: true,

  initializeAuth: async () => {
    try {
      // Check if user was previously authenticated
      const storedAuth = await AsyncStorage.getItem(AUTH_STORAGE_KEY);

      if (storedAuth) {
        const authData = JSON.parse(storedAuth);
        set({
          isAuthenticated: true,
          user: authData.user,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error("Error initializing auth:", error);
      set({ isLoading: false });
    }
  },

  signIn: async () => {
    try {
      const userData = { name: "Dream Seeker", email: "dreamer@example.com" };

      // Store authentication state
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user: userData }));

      set({
        isAuthenticated: true,
        user: userData,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error signing in:", error);
    }
  },

  signOut: async () => {
    try {
      // Remove stored authentication
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);

      set({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  },
}));
