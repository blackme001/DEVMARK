"use client";

import React from "react";
import Link from "next/link";
import { Github, Mail, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupInput } from "@/lib/schemas";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
    const router = useRouter();
    const login = useAuthStore((state) => state.login);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignupInput>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            role: "both",
            field: "",
            techStack: "",
            agreeTerms: false as any,
        },
    });

    const onSubmit = async (data: SignupInput) => {
        try {
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    data: {
                        firstName: data.firstName,
                        lastName: data.lastName,
                        role: data.role.toUpperCase(),
                        field: data.field,
                        techStack: data.techStack.split(',').map(s => s.trim()).filter(Boolean),
                    }
                }
            });

            if (authError) throw authError;

            if (authData.session && authData.user) {
                const user = {
                    id: authData.user.id,
                    email: authData.user.email || "",
                    firstName: authData.user.user_metadata?.firstName || "",
                    lastName: authData.user.user_metadata?.lastName || "",
                    role: authData.user.user_metadata?.role || "BUYER",
                    field: authData.user.user_metadata?.field || "",
                    techStack: authData.user.user_metadata?.techStack || [],
                };
                login(user as any, authData.session.access_token);
                toast.success("Account created successfully!");
                router.push("/dashboard");
            } else {
                toast.info("Registration successful! Please check your email for confirmation.");
            }
        } catch (err: any) {
            toast.error(err.message || "SignUp failed");
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
                        Create your account
                    </h1>
                    <p className="text-text-secondary text-sm">
                        Join DevMarket Pro and start selling or buying premium projects
                    </p>
                </div>

                <div className="card-flat p-8">
                    {/* OAuth */}
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
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1.5">
                                    First name
                                </label>
                                <input
                                    {...register("firstName")}
                                    type="text"
                                    placeholder="Alex"
                                    className={`w-full h-11 px-4 rounded-xl border ${errors.firstName ? "border-red-500" : "border-border"
                                        } text-sm focus:outline-none focus:ring-2 ${errors.firstName ? "focus:ring-red-500/20" : "focus:ring-primary/20"
                                        } focus:border-primary transition-all`}
                                />
                                {errors.firstName && (
                                    <p className="mt-1 text-[10px] text-red-500 font-bold">
                                        {errors.firstName.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1.5">
                                    Last name
                                </label>
                                <input
                                    {...register("lastName")}
                                    type="text"
                                    placeholder="Chen"
                                    className={`w-full h-11 px-4 rounded-xl border ${errors.lastName ? "border-red-500" : "border-border"
                                        } text-sm focus:outline-none focus:ring-2 ${errors.lastName ? "focus:ring-red-500/20" : "focus:ring-primary/20"
                                        } focus:border-primary transition-all`}
                                />
                                {errors.lastName && (
                                    <p className="mt-1 text-[10px] text-red-500 font-bold">
                                        {errors.lastName.message}
                                    </p>
                                )}
                            </div>
                        </div>
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
                                <p className="mt-1 text-[10px] text-red-500 font-bold">
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
                                placeholder="Create a strong password"
                                className={`w-full h-11 px-4 rounded-xl border ${errors.password ? "border-red-500" : "border-border"
                                    } text-sm focus:outline-none focus:ring-2 ${errors.password ? "focus:ring-red-500/20" : "focus:ring-primary/20"
                                    } focus:border-primary transition-all`}
                            />
                            {errors.password && (
                                <p className="mt-1 text-[10px] text-red-500 font-bold">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-1.5">
                                I want to
                            </label>
                            <select
                                {...register("role")}
                                className="w-full h-11 px-4 rounded-xl border border-border text-sm text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                            >
                                <option value="buyer">Buy projects & templates</option>
                                <option value="seller">Sell my projects</option>
                                <option value="both">Both</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1.5">
                                    Professional Field
                                </label>
                                <select
                                    {...register("field")}
                                    className={`w-full h-11 px-4 rounded-xl border ${errors.field ? "border-red-500" : "border-border"} text-sm text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer`}
                                >
                                    <option value="">Select Field</option>
                                    <option value="Full-Stack Developer">Full-Stack Developer</option>
                                    <option value="Frontend Developer">Frontend Developer</option>
                                    <option value="Backend Developer">Backend Developer</option>
                                    <option value="UI/UX Designer">UI/UX Designer</option>
                                    <option value="Mobile Developer">Mobile Developer</option>
                                    <option value="DevOps Engineer">DevOps Engineer</option>
                                    <option value="Security Specialist">Security Specialist</option>
                                </select>
                                {errors.field && (
                                    <p className="mt-1 text-[10px] text-red-500 font-bold">
                                        {errors.field.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1.5">
                                    Tech Stack (comma separated)
                                </label>
                                <input
                                    {...register("techStack")}
                                    type="text"
                                    placeholder="React, Node.js, Postgres"
                                    className={`w-full h-11 px-4 rounded-xl border ${errors.techStack ? "border-red-500" : "border-border"} text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all`}
                                />
                                {errors.techStack && (
                                    <p className="mt-1 text-[10px] text-red-500 font-bold">
                                        {errors.techStack.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-start gap-2 pt-2">
                            <input
                                {...register("agreeTerms")}
                                type="checkbox"
                                id="terms"
                                className="mt-0.5 w-4 h-4 rounded border-border text-primary focus:ring-primary/20 cursor-pointer"
                            />
                            <label htmlFor="terms" className="text-xs text-text-muted leading-tight cursor-pointer">
                                By signing up you agree to our{" "}
                                <a href="#" className="text-primary hover:underline">
                                    Terms
                                </a>{" "}
                                and{" "}
                                <a href="#" className="text-primary hover:underline">
                                    Privacy Policy
                                </a>
                                .
                            </label>
                        </div>
                        {errors.agreeTerms && (
                            <p className="text-[10px] text-red-500 font-bold">
                                {errors.agreeTerms.message}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn-primary w-full justify-center h-11 rounded-xl shadow-lg shadow-primary/10 mt-2"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-sm text-text-secondary mt-6">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="text-primary font-semibold hover:underline"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
