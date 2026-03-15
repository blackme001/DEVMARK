"use client";

import React from "react";
import Link from "next/navigation";
import { Github, Mail, Lock, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/schemas";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import LinkComponent from "next/link";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
    const login = useAuthStore((state) => state.login);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    });

    const onSubmit = async (data: LoginInput) => {
        try {
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email: data.email,
                password: data.password,
            });

            if (authError) throw authError;

            if (authData.session && authData.user) {
                const user = {
                    id: authData.user.id,
                    email: authData.user.email || "",
                    firstName: authData.user.user_metadata?.firstName || "",
                    lastName: authData.user.user_metadata?.lastName || "",
                    role: authData.user.user_metadata?.role || "BUYER",
                };
                login(user as any, authData.session.access_token);
                toast.success("Successfully signed in!");
                router.push("/dashboard");
            }
        } catch (err: any) {
            toast.error(err.message || "Invalid credentials");
        }
    };

    const handleOAuthSignIn = async (provider: 'google' | 'github') => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });
            if (error) throw error;
        } catch (err: any) {
            toast.error(`Failed to sign in with ${provider}: ${err.message}`);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-surface-alt px-6 py-20">
            <div className="w-full max-w-md animate-fade-in">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-text-primary mb-2">
                        Welcome back
                    </h1>
                    <p className="text-text-secondary text-sm">
                        Sign in to your DevMarket Pro account
                    </p>
                </div>

                <div className="card-flat p-8">
                    {/* OAuth Buttons */}
                    <div className="space-y-3 mb-6">
                        <button
                            type="button"
                            onClick={() => handleOAuthSignIn('github')}
                            className="w-full flex items-center justify-center gap-3 h-11 rounded-xl border border-border bg-white hover:bg-surface-hover text-sm font-medium text-text-primary transition-colors"
                        >
                            <Github className="w-5 h-5" />
                            Continue with GitHub
                        </button>
                        <button
                            type="button"
                            onClick={() => handleOAuthSignIn('google')}
                            className="w-full flex items-center justify-center gap-3 h-11 rounded-xl border border-border bg-white hover:bg-surface-hover text-sm font-medium text-text-primary transition-colors"
                        >
                            <Mail className="w-5 h-5" />
                            Continue with Google
                        </button>
                    </div>

                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex-1 h-px bg-border" />
                        <span className="text-xs text-text-muted font-medium">OR</span>
                        <div className="flex-1 h-px bg-border" />
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-1.5">
                                Email
                            </label>
                            <input
                                {...register("email")}
                                type="email"
                                placeholder="you@example.com"
                                className={`w-full h-11 px-4 rounded-xl border ${errors.email ? "border-red-500" : "border-border"
                                    } text-sm focus:outline-none focus:ring-2 ${errors.email ? "focus:ring-red-500/20" : "focus:ring-primary/20"
                                    } focus:border-primary transition-all`}
                            />
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-500 font-medium">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-1.5">
                                Password
                            </label>
                            <input
                                {...register("password")}
                                type="password"
                                placeholder="••••••••"
                                className={`w-full h-11 px-4 rounded-xl border ${errors.password ? "border-red-500" : "border-border"
                                    } text-sm focus:outline-none focus:ring-2 ${errors.password ? "focus:ring-red-500/20" : "focus:ring-primary/20"
                                    } focus:border-primary transition-all`}
                            />
                            {errors.password && (
                                <p className="mt-1 text-xs text-red-500 font-medium">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    {...register("rememberMe")}
                                    type="checkbox"
                                    className="rounded accent-primary"
                                />
                                <span className="text-text-secondary">Remember me</span>
                            </label>
                            <LinkComponent
                                href="/forgot-password"
                                className="text-primary font-medium hover:underline"
                            >
                                Forgot password?
                            </LinkComponent>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn-primary w-full justify-center h-11 rounded-xl shadow-lg shadow-primary/10"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-sm text-text-secondary mt-6">
                    Don&apos;t have an account?{" "}
                    <LinkComponent
                        href="/signup"
                        className="text-primary font-semibold hover:underline"
                    >
                        Sign up
                    </LinkComponent>
                </p>
            </div>
        </div>
    );
}
