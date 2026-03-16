"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
    ArrowLeft,
    ShoppingCart,
    ShieldCheck,
    Zap,
    Star,
    User,
    CheckCircle2,
    Loader2,
    Download,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import LivePreview from "@/components/LivePreview";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

export default function ProjectDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [hasPurchased, setHasPurchased] = useState(false);
    const { user: currentUser } = useAuthStore();

    useEffect(() => {
        async function loadProject() {
            try {
                setLoading(true);
                const { data, error } = await (supabase
                    .from('Project')
                    .select('*, creator:User!creatorId(firstName, lastName, email)')
                    .eq('id', id)
                    .single() as any);

                if (error) throw error;
                setProject(data);

                // Check for purchase if user is logged in
                if (currentUser) {
                    const { data: purchase } = await (supabase
                        .from('Purchase')
                        .select('*')
                        .eq('projectId', id)
                        .eq('buyerId', currentUser.id)
                        .eq('status', 'SUCCESS')
                        .maybeSingle() as any);

                    if (purchase) setHasPurchased(true);
                }
            } catch (err: any) {
                console.error("Error loading project:", err);
                toast.error("Failed to load project details.");
            } finally {
                setLoading(false);
            }
        }
        if (id) loadProject();
    }, [id, currentUser]);

    const handlePurchase = () => {
        toast.info("Payments are currently being updated. Please check back later.");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-4xl font-black text-navy-dark mb-4">Project Not Found</h1>
                <Link href="/explore" className="btn-primary">Return to Marketplace</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface-alt pb-20">
            <div className="max-w-[1360px] mx-auto px-6 pt-12">
                <Link
                    href="/explore"
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-primary transition-colors text-sm font-semibold mb-12 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Marketplace
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Information Column */}
                    <div className="animate-in fade-in duration-700">
                        <div className="flex flex-wrap gap-2 mb-6">
                            {(project.techStack || ["Template"]).map((tech: string, i: number) => (
                                <span key={i} className="px-3 py-1 bg-primary/5 text-primary text-[10px] font-black rounded-lg border border-primary/10 uppercase tracking-widest">
                                    {tech}
                                </span>
                            ))}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-navy-dark mb-6 leading-tight tracking-tight italic">
                            {project.title}
                        </h1>
                        <p className="text-lg text-slate-500 mb-10 leading-relaxed font-medium italic">
                            {project.description}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                            <div className="flex items-center gap-4 p-5 rounded-3xl bg-white border border-slate-100 shadow-sm transition-all hover:border-primary/20">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <Star className="w-5 h-5 text-primary fill-primary" />
                                </div>
                                <div className="flex flex-col">
                                    <div className="text-lg font-black text-navy-dark">
                                        4.9 / 5.0
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Top Rated Assets</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-5 rounded-3xl bg-white border border-slate-100 shadow-sm transition-all hover:border-primary/20">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                    <Zap className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="flex flex-col">
                                    <div className="text-lg font-black text-navy-dark">
                                        Instant Delivery
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Direct Download</div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 rounded-3xl bg-white border border-slate-100 flex items-center justify-between mb-12 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-surface-alt flex items-center justify-center text-xl font-black text-primary bg-primary/5 border border-primary/10">
                                    {project.creator?.firstName?.[0] || project.creator?.email?.[0] || 'A'}
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 mb-0.5 font-black uppercase tracking-widest">
                                        Created by
                                    </p>
                                    <Link
                                        href={`/profile/${project.creatorId}`}
                                        className="font-bold text-navy-dark flex items-center gap-1.5 underline decoration-primary/30 underline-offset-4 cursor-pointer hover:text-primary transition-all group"
                                    >
                                        {project.creator?.firstName} {project.creator?.lastName}
                                        <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                                    {hasPurchased ? "License Owned" : "Price per license"}
                                </span>
                                <div className="text-4xl font-black text-navy-dark tracking-tighter italic">
                                    {hasPurchased ? "PURCHASED" : `$${project.price}`}
                                </div>
                            </div>
                            {hasPurchased ? (
                                <button
                                    onClick={() => {
                                        if (project.sourceFile) {
                                            window.open(project.sourceFile, '_blank');
                                        } else {
                                            toast.info("Source files are being prepared for download.");
                                        }
                                    }}
                                    className="flex-1 w-full sm:w-auto px-8 py-5 rounded-2xl bg-emerald-500 text-white font-black text-xl shadow-xl shadow-emerald-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                                >
                                    <Download className="w-6 h-6" />
                                    Download Asset
                                </button>
                            ) : (
                                <button
                                    onClick={handlePurchase}
                                    className="flex-1 w-full sm:w-auto px-8 py-5 rounded-2xl bg-slate-200 text-slate-500 font-black text-xl shadow-xl transition-all flex items-center justify-center gap-3 cursor-not-allowed"
                                >
                                    <ShoppingCart className="w-6 h-6" />
                                    Payments Paused
                                </button>
                            )}
                        </div>

                        <div className="flex items-center gap-6 mt-8">
                            <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                Verified & Scanned
                            </div>
                            <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                Industrial License
                            </div>
                        </div>
                    </div>

                    {/* Preview Column */}
                    <div className="relative animate-in slide-in-from-bottom-8 duration-700">
                        <div className="sticky top-28">
                            <div className="aspect-[4/3] rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-2xl bg-white p-3 lg:p-4 hover:shadow-primary/5 transition-all group">
                                <div className="w-full h-full rounded-2xl overflow-hidden border border-slate-100 shadow-inner group-hover:border-primary/20 transition-all">
                                    <LivePreview
                                        url={project.demoUrl}
                                        html={project.previewHtml || `
                                          <div class="h-full flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
                                            <div class="w-20 h-20 bg-primary/20 rounded-3xl mb-6"></div>
                                            <h2 class="text-2xl font-black text-slate-900 mb-2 italic">Standard Asset Preview</h2>
                                            <p class="text-slate-500 font-medium italic">High-performance React structure with premium UI tokens.</p>
                                          </div>
                                        `}
                                        title={project.title}
                                    />
                                </div>
                            </div>
                            <div className="mt-6 flex items-center justify-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] italic">
                                <Zap className="w-4 h-4 text-primary animate-pulse" />
                                Fully interactive live preview
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
