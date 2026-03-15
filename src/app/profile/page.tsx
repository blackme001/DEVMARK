"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
    MapPin,
    Calendar,
    Shield,
    CheckCircle2,
    Star,
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
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { ProfileCompletionBanner } from "@/components/ProfileCompletionBanner";

export default function ProfilePage() {
    const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push("/auth");
        }
    }, [isAuthenticated, authLoading, router]);

    useEffect(() => {
        async function loadProfileData() {
            if (!user) return;
            try {
                setIsLoading(true);
                // Fetch user's projects
                const { data: projects, error: projectsError } = await (supabase
                    .from('Project')
                    .select('*')
                    .eq('creatorId', user.id)
                    .order('createdAt', { ascending: false }) as any);

                if (projectsError) throw projectsError;

                // Fetch purchases for these projects
                const projectIds = projects?.map((p: any) => p.id) || [];
                const { data: purchases, error: purchasesError } = await (supabase
                    .from('Purchase')
                    .select('*')
                    .in('projectId', projectIds)
                    .eq('status', 'SUCCESS') as any);

                if (purchasesError) throw purchasesError;

                // Aggregate stats
                const totalSales = purchases?.length || 0;
                const liveProducts = projects?.filter((p: any) => p.status === 'APPROVED').length || 0;

                setStats({
                    totalSales,
                    liveProducts,
                    projects: projects || []
                });
            } catch (err) {
                console.error("Failed to load profile data:", err);
                toast.error("Failed to sync profile data.");
            } finally {
                setIsLoading(false);
            }
        }

        if (isAuthenticated && user) {
            loadProfileData();
        }
    }, [isAuthenticated, user]);

    const handleMessageSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Message sent privately!");
        setIsMessageModalOpen(false);
    };

    const handleQuoteSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Proposal request submitted!");
        setIsQuoteModalOpen(false);
    };

    if (authLoading || (isLoading && !stats)) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface-alt">
            {/* ─── Profile Hero ─── */}
            <section className="bg-white border-b border-border shadow-sm">
                <div className="max-w-[1360px] mx-auto px-6 py-12">
                    {/* Profile Completion Banner Component */}
                    <ProfileCompletionBanner />

                    <div className="flex flex-col lg:flex-row gap-10 items-start">
                        {/* Left: Avatar + Info */}
                        <div className="flex-1">
                            <div className="flex items-center gap-6 mb-8">
                                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-3xl font-black flex-shrink-0 shadow-2xl shadow-primary/20 uppercase">
                                    {(user?.firstName?.[0] || user?.email?.[0] || 'U')}
                                    {(user?.lastName?.[0] || '')}
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h1 className="text-3xl font-black text-navy-dark">
                                            {user?.firstName} {user?.lastName}
                                        </h1>
                                        <span className="badge badge-primary text-[10px] font-black uppercase tracking-widest">
                                            <CheckCircle2 className="w-3 h-3" /> Professional
                                        </span>
                                    </div>
                                    <p className="text-lg text-slate-500 font-medium italic mb-4">
                                        {user?.field || user?.user_metadata?.field || "Verified Marketplace Creator"}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-5 text-sm font-bold text-slate-400">
                                        <span className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-primary" /> Global Office
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-primary" /> Member since 2025
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <Shield className="w-4 h-4 text-primary" /> Security Verified
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Tech Stack Chips */}
                            <div className="flex flex-wrap gap-2 mb-8">
                                {(user?.techStack || user?.user_metadata?.techStack || ["Professional"]).map((tech: any) => (
                                    <span key={tech} className="px-3 py-1 bg-primary/5 text-primary text-[10px] font-black rounded-lg border border-primary/10 uppercase tracking-widest">
                                        {tech}
                                    </span>
                                ))}
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-8 max-w-md">
                                {[
                                    { value: stats?.liveProducts || "0", label: "Live Assets" },
                                    { value: "4.9", label: "Market Rating" },
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
                        <div className="flex flex-col gap-4 lg:w-80 w-full shrink-0">
                            <button
                                onClick={() => setIsMessageModalOpen(true)}
                                className="w-full h-14 rounded-2xl bg-primary text-white font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                            >
                                <MessageSquare className="w-5 h-5" /> Message
                            </button>
                            <button
                                onClick={() => setIsQuoteModalOpen(true)}
                                className="w-full h-14 rounded-2xl bg-white border-2 border-slate-100 text-navy-dark font-black text-lg hover:border-primary/20 hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
                            >
                                <FileText className="w-5 h-5 text-primary" /> Request Quote
                            </button>

                            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 mt-2">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Professional Badges</h3>
                                <div className="space-y-4">
                                    {[
                                        { icon: Shield, label: "Identity Verified", color: "text-emerald-500", bg: "bg-emerald-50" },
                                        { icon: Zap, label: "Fast Responder", color: "text-amber-500", bg: "bg-amber-50" },
                                        { icon: Award, label: "Elite Seller", color: "text-primary", bg: "bg-primary/5" },
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
                            <h2 className="text-2xl font-black text-navy-dark mb-6 italic underline decoration-primary/30 decoration-4 underline-offset-8">The Creator Narrative</h2>
                            <div className="p-8 rounded-[2.5rem] bg-white border border-border leading-relaxed">
                                <p className="text-slate-600 font-medium text-lg leading-relaxed">
                                    Passionate about engineering premium digital experiences. I specialize in building high-performance marketplace assets, scalable SaaS architectures, and industrial-grade UI components. Every project I release is meticulously audited for code quality, security, and performance.
                                </p>
                            </div>
                        </section>

                        {/* Projects Column */}
                        <section>
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-black text-navy-dark italic underline decoration-primary/30 decoration-4 underline-offset-8">Active Listings</h2>
                                <Link href="/explore" className="text-sm font-bold text-primary">View Marketplace →</Link>
                            </div>

                            {stats?.projects?.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {stats.projects.map((p: any) => (
                                        <div key={p.id} className="group p-6 rounded-[2rem] bg-white border border-border hover:border-primary/20 hover:shadow-2xl hover:shadow-navy-dark/5 transition-all">
                                            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-3xl mb-6 shadow-sm border border-slate-100">
                                                📦
                                            </div>
                                            <h3 className="text-xl font-bold text-navy-dark mb-2 uppercase tracking-tight">{p.title}</h3>
                                            <p className="text-slate-500 text-sm mb-6 line-clamp-2">{p.description}</p>
                                            <div className="flex items-center justify-between border-t border-slate-50 pt-6">
                                                <span className="text-2xl font-black text-primary">${p.price}</span>
                                                <Link href={`/projects/${p.id}`} className="text-sm font-bold text-navy-dark group-hover:text-primary transition-colors flex items-center gap-2">
                                                    View Details <ArrowRight className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-16 text-center border-4 border-dashed border-slate-100 rounded-[3rem]">
                                    <ShoppingBag className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                                    <p className="text-slate-400 font-black italic">No marketplace listings active yet.</p>
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Sidebar Column */}
                    <aside className="space-y-10">
                        <section>
                            <h2 className="text-xl font-black text-navy-dark mb-6">Expertise Stack</h2>
                            <div className="space-y-4">
                                {[
                                    { icon: Code2, label: "Full-Stack Dev", items: ["Next.js", "NestJS", "Prisma"] },
                                    { icon: Palette, label: "UI Systems", items: ["Tailwind", "Figma", "Framer"] },
                                    { icon: TestTube, label: "Quality Ops", items: ["QA", "SEO", "Perf"] },
                                ].map((cat, i) => (
                                    <div key={i} className="p-6 rounded-3xl bg-white border border-border">
                                        <div className="flex items-center gap-3 mb-4">
                                            <cat.icon className="w-5 h-5 text-primary" />
                                            <span className="font-bold text-navy-dark">{cat.label}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {cat.items.map(item => (
                                                <span key={item} className="px-3 py-1 bg-slate-50 text-[10px] font-black text-slate-500 rounded-lg border border-slate-100 uppercase tracking-widest">{item}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="p-8 rounded-[2.5rem] bg-navy-dark text-white relative overflow-hidden">
                            <div className="relative z-10">
                                <h2 className="text-xl font-black mb-4 italic">Open for Custom Projects</h2>
                                <p className="text-sm text-slate-400 mb-6 leading-relaxed">Available for architectural consulting and custom module development.</p>
                                <button className="w-full py-4 bg-primary text-white rounded-2xl font-black shadow-lg shadow-primary/20">Check Availability</button>
                            </div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full"></div>
                        </section>
                    </aside>
                </div>
            </div>

            {/* ─── Modals ─── */}
            {isMessageModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-navy-dark/60 backdrop-blur-sm" onClick={() => setIsMessageModalOpen(false)}></div>
                    <div className="bg-white rounded-[2.5rem] w-full max-w-xl p-10 relative z-10 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <h2 className="text-3xl font-black text-navy-dark mb-2 italic">Direct Channel</h2>
                        <p className="text-slate-500 mb-8 font-medium">Send a secure message to the creator.</p>
                        <form onSubmit={handleMessageSubmit} className="space-y-6">
                            <div>
                                <label className="block text-xs font-black uppercase text-slate-400 mb-2 tracking-widest">Message Content</label>
                                <textarea
                                    required
                                    rows={4}
                                    placeholder="I'm interested in your project..."
                                    className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                ></textarea>
                            </div>
                            <button type="submit" className="w-full btn-primary h-14 justify-center">Transmit Message</button>
                        </form>
                    </div>
                </div>
            )}

            {isQuoteModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-navy-dark/60 backdrop-blur-sm" onClick={() => setIsQuoteModalOpen(false)}></div>
                    <div className="bg-white rounded-[2.5rem] w-full max-w-xl p-10 relative z-10 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <h2 className="text-3xl font-black text-navy-dark mb-2 italic">Consultation Request</h2>
                        <p className="text-slate-500 mb-8 font-medium">Define your custom scope and milestones.</p>
                        <form onSubmit={handleQuoteSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black uppercase text-slate-400 mb-2 tracking-widest">Service Type</label>
                                    <select className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50/50 font-bold text-sm">
                                        <option>Architecture Review</option>
                                        <option>Custom Module</option>
                                        <option>Security Audit</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase text-slate-400 mb-2 tracking-widest">Approx. Budget</label>
                                    <input type="text" placeholder="$1,000+" className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50/50 font-bold text-sm" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase text-slate-400 mb-2 tracking-widest">Project Description</label>
                                <textarea rows={4} placeholder="Describe your technical requirements..." className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50/50 outline-none"></textarea>
                            </div>
                            <button type="submit" className="w-full btn-primary h-14 justify-center">Request Proposal</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
