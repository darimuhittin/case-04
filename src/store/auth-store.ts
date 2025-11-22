import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { LoginResponse, User } from "@/lib/types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  _hasHydrated: boolean;

  // Actions
  // FIX: LoginResponse yerine AuthPayload (iç veri) kullanıyoruz
  login: (payload: LoginResponse) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
  checkAuth: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
      _hasHydrated: false,

      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },

      login: (payload: LoginResponse) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("access_token", payload.data?.accessToken);
        }

        set({
          user: payload.data?.user,
          token: payload.data?.accessToken,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
        }
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      setUser: (user: User | null) => {
        set({ user });
      },

      checkAuth: () => {
        if (typeof window === "undefined") {
          set({ isLoading: false, isAuthenticated: false });
          return;
        }

        const token = localStorage.getItem("access_token");

        if (!token) {
          set({
            token: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        } else {
          set((state) => ({
            isAuthenticated: true,
            token: token,
            isLoading: false,
          }));
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
