"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/useAuthStore";

export default function AuthListener() {
    const login = useAuthStore((state) => state.login);
    const logout = useAuthStore((state) => state.logout);

    useEffect(() => {
        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log("Auth event:", event);

            if (session && session.user) {
                const user = {
                    id: session.user.id,
                    email: session.user.email || "",
                    firstName: session.user.user_metadata?.firstName || "",
                    lastName: session.user.user_metadata?.lastName || "",
                    role: session.user.user_metadata?.role || "BUYER",
                    avatar: session.user.user_metadata?.avatar_url || "",
                };
                login(user as any, session.access_token);
            } else if (event === "SIGNED_OUT") {
                logout();
            }
        });

        // Check initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session && session.user) {
                const user = {
                    id: session.user.id,
                    email: session.user.email || "",
                    firstName: session.user.user_metadata?.firstName || "",
                    lastName: session.user.user_metadata?.lastName || "",
                    role: session.user.user_metadata?.role || "BUYER",
                    avatar: session.user.user_metadata?.avatar_url || "",
                };
                login(user as any, session.access_token);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [login, logout]);

    return null;
}
