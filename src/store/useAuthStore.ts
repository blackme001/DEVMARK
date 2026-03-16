import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role: string;
    field?: string;
    techStack?: string[];
    avatar?: string;
    user_metadata?: {
        firstName?: string;
        lastName?: string;
        role?: string;
        field?: string;
        techStack?: string[];
    };
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (user: User, token: string) => void;
    logout: () => void;
    updateProfile: (profile: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            login: (user, token) => set({ user, token, isAuthenticated: true }),
            logout: () => set({ user: null, token: null, isAuthenticated: false }),
            updateProfile: (profile) =>
                set((state) => ({
                    user: state.user ? { ...state.user, ...profile } : null,
                })),
        }),
        {
            name: "auth-storage",
        }
    )
);
