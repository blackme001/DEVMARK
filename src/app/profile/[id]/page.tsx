"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    MapPin,
    Calendar,
    Shield,
    CheckCircle2,
    MessageSquare,
    FileText,
    Code2,
    Palette,
    TestTube,
    Award,
    ArrowRight,
    ShoppingBag,
    Loader2,
    Zap,
    ArrowLeft,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/useAuthStore";
import { ProfileCompletionBanner } from "@/components/ProfileCompletionBanner";
import MessageModal from "@/components/MessageModal";

export default function ProfileDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const { user: currentUser, isAuthenticated } = useAuthStore();

    const [profileUser, setProfileUser] = useState<any>(null);
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [messageMode, setMessageMode] = useState<"message" | "quote">("message");

    const isOwnProfile = currentUser?.id === id;

    useEffect(() => {
        async function loadProfileData() {
            if (!id) return;
            try {
                setIsLoading(true);

                // 1. Fetch User Profile
                const { data: userProfile, error: userError } = await supabase
                    .from('User')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (userError) throw userError;
                setProfileUser(userProfile);

                // 2. Fetch User's projects
                const { data: projects, error: projectsError } = await (supabase
                    .from('Project')
                    .select('*')
                    .eq('creatorId', id)
                    .order('createdAt', { ascending: false }) as any);

                if (projectsError) throw projectsError;

                // 3. Fetch sales count
                const projectIds = projects?.map((p: any) => p.id) || [];
                const { count: totalSales, error: purchasesError } = await supabase
                    .from('Purchase')
                    .select('*', { count: 'exact', head: true })
                    .in('projectId', projectIds)
                    .eq('status', 'SUCCESS');

                if (purchasesError) throw purchasesError;

                const liveProducts = projects?.filter((p: any) => p.status === 'APPROVED').length || 0;

                setStats({
                    totalSales: totalSales || 0,
                    liveProducts,
                    projects: projects || []
                });
            } catch (err) {
                console.error("Failed to load profile data:", err);
                toast.error("User profile not found or connection error.");
            } finally {
                setIsLoading(false);
            }
        }

        loadProfileData();
    }, [id]);

    // Handled by shared MessageModal component

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    if (!profileUser) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-4xl font-black text-navy-dark mb-4 italic">Profile Not Found</h1>
                <Link href="/explore" className="btn-primary">Return to Marketplace</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface-alt">
            {/* ─── Profile Hero ─── */}
            <section className="bg-white border-b border-border shadow-sm">
                <div className="max-w-[1360px] mx-auto px-6 py-12">
                    {/* Only show for own profile */}
                    {isOwnProfile && <ProfileCompletionBanner />}

                    <Link
                        href="/explore"
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-primary transition-colors text-sm font-semibold mb-8 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Explore Marketplace
                    </Link>

                    <div className="flex flex-col lg:flex-row gap-10 items-start">
                        {/* Left: Avatar + Info */}
                        <div className="flex-1">
                            <div className="flex items-center gap-6 mb-8">
                                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-3xl font-black flex-shrink-0 shadow-2xl shadow-primary/20 uppercase">
                                    {(profileUser?.firstName?.[0] || profileUser?.email?.[0] || 'U')}
                                    {(profileUser?.lastName?.[0] || '')}
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h1 className="text-3xl font-black text-navy-dark">
                                            {profileUser?.firstName} {profileUser?.lastName}
                                        </h1>
                                        {profileUser?.role === 'SELLER' && (
                                            <span className="badge badge-primary text-[10px] font-black uppercase tracking-widest">
                                                <CheckCircle2 className="w-3 h-3" /> Elite Seller
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-lg text-slate-500 font-medium italic mb-4">
                                        {profileUser?.field || "Verified Marketplace Creator"}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-5 text-sm font-bold text-slate-400">
                                        <span className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-primary" /> Global Office
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-primary" /> Joined {new Date(profileUser?.createdAt).getFullYear()}
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <Shield className="w-4 h-4 text-primary" /> Verified
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Tech Stack Chips */}
                            <div className="flex flex-wrap gap-2 mb-8">
                                {(profileUser?.techStack || []).map((tech: any) => (
                                    <span key={tech} className="px-3 py-1 bg-primary/5 text-primary text-[10px] font-black rounded-lg border border-primary/10 uppercase tracking-widest">
                                        {tech}
                                    </span>
                                ))}
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-8 max-w-md">
                                {[
                                    { value: stats?.liveProducts || "0", label: "Live Assets" },
                                    { value: "0.0", label: "Market Rating" },
                                    { value: stats?.totalSales || "0", label: "Total Sales" },
                                ].map((s, i) => (
                                    <div key={i} className="border-l-4 border-primary/20 pl-4">
                                        <div className="text-2xl font-black text-navy-dark">
                                            {s.value}
                                        </div>
                                        <div className="text-xs text-slate-400 font-bold uppercase tracking-tighter">{s.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right: Actions */}
                        {!isOwnProfile && (
                            <div className="flex flex-col gap-4 lg:w-80 w-full shrink-0">
                                <button
                                    onClick={() => { setMessageMode("message"); setIsMessageModalOpen(true); }}
                                    className="w-full h-14 rounded-2xl bg-primary text-white font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                                >
                                    <MessageSquare className="w-5 h-5" /> Message Seller
                                </button>
                                <button
                                    onClick={() => { setMessageMode("quote"); setIsMessageModalOpen(true); }}
                                    className="w-full h-14 rounded-2xl bg-white border-2 border-slate-100 text-navy-dark font-black text-lg hover:border-primary/20 hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
                                >
                                    <FileText className="w-5 h-5 text-primary" /> Request Quote
                                </button>

                                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 mt-2">
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Trust Signals</h3>
                                    <div className="space-y-4">
                                        {[
                                            { icon: Shield, label: "Identity Verified", color: "text-emerald-500", bg: "bg-emerald-50" },
                                            { icon: Zap, label: "Flash Response", color: "text-amber-500", bg: "bg-amber-50" },
                                            { icon: Award, label: "Project Verified", color: "text-primary", bg: "bg-primary/5" },
                                        ].map((badge, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-lg ${badge.bg} flex items-center justify-center`}>
                                                    <badge.icon className={`w-4 h-4 ${badge.color}`} />
                                                </div>
                                                <span className="text-sm font-bold text-navy-dark">{badge.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {isOwnProfile && (
                            <div className="lg:w-80 w-full shrink-0">
                                <Link href="/dashboard" className="w-full h-14 rounded-2xl bg-navy-dark text-white font-black text-lg shadow-xl shadow-navy-dark/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3">
                                    Manage Business
                                </Link>
                                <div className="mt-4 p-6 rounded-3xl bg-slate-50 border border-slate-100 italic text-xs text-slate-500 text-center">
                                    This is how other users see your profile.
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Main Content Area */}
            <div className="max-w-[1360px] mx-auto px-6 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content Column */}
                    <div className="lg:col-span-2 space-y-16">
                        {/* Bio */}
                        <section>
                            <h2 className="text-2xl font-black text-navy-dark mb-6 italic underline decoration-primary/30 decoration-4 underline-offset-8">Creator Philosophy</h2>
                            <div className="p-8 rounded-[2.5rem] bg-white border border-border leading-relaxed">
                                <p className="text-slate-600 font-medium text-lg leading-relaxed">
                                    Expertise in developing elite-tier marketplace assets and industrial scripts. Specializing in {profileUser?.field || 'digital products'}. Every asset listed is rigorously tested for production-readiness.
                                </p>
                            </div>
                        </section>

                        {/* Projects Column */}
                        <section>
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-black text-navy-dark italic underline decoration-primary/30 decoration-4 underline-offset-8">Marketplace Gallery</h2>
                                <Link href="/explore" className="text-sm font-bold text-primary">Browse All →</Link>
                            </div>

                            {stats?.projects?.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {stats.projects.map((p: any) => (
                                        <div key={p.id} className="group rounded-[2.5rem] bg-white border border-border hover:border-primary/20 hover:shadow-2xl hover:shadow-navy-dark/5 transition-all overflow-hidden flex flex-col">
                                            <div className="aspect-[4/3] bg-slate-50 relative overflow-hidden group-hover:scale-105 transition-transform duration-700">
                                                <img 
                                                    src={p.thumbnail} 
                                                    alt={p.title}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/40 to-transparent"></div>
                                                <div className="absolute bottom-4 left-4">
                                                    <span className="px-3 py-1 bg-white/90 backdrop-blur text-navy-dark text-[10px] font-black rounded-lg uppercase tracking-widest">
                                                        {p.category}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-8 flex-1 flex flex-col">
                                                <h3 className="text-xl font-bold text-navy-dark mb-2 uppercase tracking-tight">{p.title}</h3>
                                                <p className="text-slate-500 text-sm mb-8 line-clamp-2 font-medium italic">{p.description}</p>
                                                <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-6">
                                                    <span className="text-2xl font-black text-primary italic">${p.price}</span>
                                                    <Link href={`/projects/${p.id}`} className="w-12 h-12 rounded-xl bg-navy-dark text-white flex items-center justify-center hover:bg-primary transition-all group/btn">
                                                        <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-16 text-center border-4 border-dashed border-slate-100 rounded-[3rem]">
                                    <ShoppingBag className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                                    <p className="text-slate-400 font-black italic">No active assets in the vault.</p>
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Sidebar Column */}
                    <aside className="space-y-10">
                        <section>
                            <h2 className="text-xl font-black text-navy-dark mb-6">Industrial Stack</h2>
                            <div className="space-y-4">
                                {[
                                    { icon: Code2, label: "Core Dev", items: (profileUser?.techStack || []).slice(0, 4) },
                                    { icon: Palette, label: "Design Ops", items: ["Tailwind", "Framer"] },
                                ].map((cat, i) => (
                                    <div key={i} className="p-6 rounded-3xl bg-white border border-border">
                                        <div className="flex items-center gap-3 mb-4">
                                            <cat.icon className="w-5 h-5 text-primary" />
                                            <span className="font-bold text-navy-dark">{cat.label}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {cat.items.map((item: string) => (
                                                <span key={item} className="px-3 py-1 bg-slate-50 text-[10px] font-black text-slate-500 rounded-lg border border-slate-100 uppercase tracking-widest">{item}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </aside>
                </div>
            </div>

            {/* ─── Modals ─── */}
            <MessageModal 
                isOpen={isMessageModalOpen}
                onClose={() => setIsMessageModalOpen(false)}
                recipientId={id}
                recipientName={`${profileUser?.firstName} ${profileUser?.lastName}`}
                initialMode={messageMode}
            />
        </div>
    );
}
