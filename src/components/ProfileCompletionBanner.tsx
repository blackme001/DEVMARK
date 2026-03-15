"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight, X, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export function ProfileCompletionBanner() {
    const { user, updateProfile } = useAuthStore();
    const [isUpdating, setIsUpdating] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    // Check if profile is incomplete
    const isMissingData = user && (
        !user.field ||
        !user.techStack ||
        user.techStack.length === 0 ||
        (user.role === 'SELLER' && !user.payoutsEnabled && !user.user_metadata?.payoutsEnabled)
    );

    if (!user || !isMissingData || dismissed) return null;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsUpdating(true);

        const formData = new FormData(e.currentTarget);
        const field = formData.get("field") as string;
        const techStackRaw = formData.get("techStack") as string;
        const techStack = techStackRaw.split(",").map(s => s.trim()).filter(Boolean);

        try {
            const { error } = await supabase
                .from("User")
                .update({ field, techStack })
                .eq("id", user.id);

            if (error) throw error;

            // Also update auth metadata for consistency
            await supabase.auth.updateUser({
                data: { field, techStack }
            });

            updateProfile({ field, techStack } as any);
            toast.success("Profile completed! Your data bank is now live.");
            setShowForm(false);
        } catch (err: any) {
            toast.error(err.message || "Failed to update profile");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
            {!showForm ? (
                <div className="relative overflow-hidden rounded-3xl bg-navy-dark text-white p-6 shadow-2xl shadow-navy-dark/20 border border-white/5 group">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center flex-shrink-0 border border-primary/20 group-hover:scale-110 transition-transform">
                                <Sparkles className="w-7 h-7 text-primary animate-pulse" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold italic mb-1 tracking-tight">
                                    {user.role === 'SELLER' && !user.payoutsEnabled ? "Finish Seller Setup" : "Complete Your Identity"}
                                </h3>
                                <p className="text-slate-400 text-sm font-medium">
                                    {user.role === 'SELLER' && !user.payoutsEnabled
                                        ? "Configure your payout method to start listing and selling projects."
                                        : "Add your field and tech stack to unlock premium features."}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowForm(true)}
                                className="btn-primary py-3 px-8 flex items-center gap-2 group/btn"
                            >
                                Complete Now <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={() => setDismissed(true)}
                                className="p-3 text-slate-500 hover:text-white transition-colors"
                                title="Dismiss"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    {/* Background Decor */}
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/10 blur-[60px] rounded-full"></div>
                    <div className="absolute top-0 right-1/4 w-32 h-32 bg-blue-500/5 blur-[50px] rounded-full"></div>
                </div>
            ) : (
                <div className="card-flat p-8 border-2 border-primary/20 bg-white/80 backdrop-blur-xl animate-in zoom-in-95 duration-300">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-black text-navy-dark italic underline decoration-primary/30 decoration-4 underline-offset-8">
                            Professional Data Bank
                        </h3>
                        <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-navy-dark transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-black uppercase text-slate-400 mb-2 tracking-widest">Your Field</label>
                            <select
                                name="field"
                                required
                                className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-bold text-navy-dark cursor-pointer"
                            >
                                <option value="">Select Specialty</option>
                                <option value="Full-Stack Developer">Full-Stack Developer</option>
                                <option value="Frontend Developer">Frontend Developer</option>
                                <option value="Backend Developer">Backend Developer</option>
                                <option value="UI/UX Designer">UI/UX Designer</option>
                                <option value="Mobile Developer">Mobile Developer</option>
                                <option value="DevOps Engineer">DevOps Engineer</option>
                                <option value="Security Specialist">Security Specialist</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-black uppercase text-slate-400 mb-2 tracking-widest">Tech Stack (comma separated)</label>
                            <input
                                name="techStack"
                                type="text"
                                required
                                placeholder="React, Tailwind, Node.js..."
                                className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-bold text-navy-dark"
                            />
                        </div>
                        <div className="md:col-span-2 pt-2">
                            <button
                                type="submit"
                                disabled={isUpdating}
                                className="w-full btn-primary h-12 justify-center shadow-lg shadow-primary/20"
                            >
                                {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save & Complete Profile"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
