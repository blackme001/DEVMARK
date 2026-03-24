"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Upload, CheckCircle2, ChevronRight, Loader2, Globe } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectUploadSchema, type ProjectUploadInput } from "@/lib/schemas";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";

type ProjectInsert = Database['public']['Tables']['Project']['Insert'];

export default function UploadProjectPage() {
    const router = useRouter();
    const [thumbnail, setThumbnail] = React.useState<File | null>(null);
    const [gallery, setGallery] = React.useState<File[]>([]);
    const [sourceFile, setSourceFile] = React.useState<File | null>(null);
    const [step, setStep] = React.useState(1);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ProjectUploadInput>({
        resolver: zodResolver(projectUploadSchema),
        defaultValues: {
            title: "",
            description: "",
            category: "",
            price: 0,
            techStack: "",
            demoUrl: "",
        },
    });

    const uploadToSupabase = async (file: File) => {
        const bucket = "devmark-assets";
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(filePath, file, {
                cacheControl: "3600",
                upsert: false,
            });

        if (error) throw error;
        return data.path;
    };

    const onSubmit = async (data: ProjectUploadInput) => {
        try {
            const user = useAuthStore.getState().user;
            if (!user) {
                toast.error("Authentication required.");
                router.push("/auth");
                return;
            }

            if (!thumbnail || !sourceFile) {
                toast.error("Thumbnail and Source ZIP are required.");
                setStep(2);
                return;
            }

            let thumbnailKey = "";
            let galleryKeys: string[] = [];
            let sourceKey = "";

            toast.loading("Preparing upload...", { id: "upload" });

            try {
                toast.loading("Uploading thumbnail...", { id: "upload" });
                thumbnailKey = await uploadToSupabase(thumbnail);

                if (gallery.length > 0) {
                    toast.loading(`Uploading gallery (${gallery.length})...`, { id: "upload" });
                    galleryKeys = await Promise.all(gallery.map(file => uploadToSupabase(file)));
                }

                toast.loading("Uploading source files...", { id: "upload" });
                sourceKey = await uploadToSupabase(sourceFile);
            } catch (err: any) {
                console.error("Storage error:", err);
                throw new Error("Failed to upload files to storage. Check RLS policies.");
            }

            toast.loading("Saving project details...", { id: "upload" });

            const payload: any = {
                title: data.title,
                description: data.description,
                category: data.category,
                price: Number(data.price),
                techStack: data.techStack.split(",").map(s => s.trim()).filter(Boolean),
                demoUrl: data.demoUrl || null,
                thumbnail: thumbnailKey || null,
                gallery: galleryKeys,
                sourceFile: sourceKey || null,
                creatorId: user.id,
                status: 'PENDING'
            };

            const { data: projectData, error: projectError } = await supabase.functions.invoke('create-project', {
                body: payload
            });

            if (projectError) throw projectError;

            if (projectData) {
                toast.success("Project created successfully!", { id: "upload" });
                router.push("/dashboard");
            }
        } catch (err: any) {
            toast.error(err.message || "Failed to upload project.", { id: "upload" });
        }
    };

    return (
        <div className="min-h-screen bg-surface-alt pb-20">
            <div className="max-w-3xl mx-auto px-6 pt-12">
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-sm font-semibold mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </Link>

                <header className="mb-10">
                    <h1 className="text-3xl font-black text-text-primary mb-2 tracking-tight">
                        Upload New Project
                    </h1>
                    <p className="text-text-secondary text-sm">
                        Step {step} of 3: {step === 1 ? "Details" : step === 2 ? "Files" : "Review"}
                    </p>
                </header>

                {/* Step Indicator */}
                <div className="flex items-center gap-4 mb-10 overflow-x-auto pb-4">
                    {[
                        { id: 1, label: "Project Details", active: step === 1 },
                        { id: 2, label: "Files & Docs", active: step === 2 },
                        { id: 3, label: "Review & Publish", active: step === 3 },
                    ].map((s, i) => (
                        <React.Fragment key={s.id}>
                            <div className={`flex items-center gap-3 whitespace-nowrap ${s.active ? "opacity-100" : "opacity-40"}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${s.active ? "bg-primary text-white" : "bg-white text-text-primary border border-border"}`}>
                                    {s.id}
                                </div>
                                <span className="text-sm font-bold text-text-primary">{s.label}</span>
                            </div>
                            {i < 2 && <div className="h-px w-8 bg-border flex-shrink-0" />}
                        </React.Fragment>
                    ))}
                </div>

                <div className="card-flat p-8 md:p-10">
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        if (step < 3) {
                            setStep(s => s + 1);
                        } else {
                            handleSubmit(onSubmit)(e);
                        }
                    }} className="space-y-8">

                        {/* STEP 1: DETAILS */}
                        {step === 1 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div>
                                    <label className="block text-sm font-bold text-text-primary mb-2">Project Title</label>
                                    <input
                                        {...register("title")}
                                        type="text"
                                        placeholder="e.g. Premium SaaS Boilerplate 2025"
                                        className={`w-full h-12 px-5 rounded-2xl border ${errors.title ? "border-red-500" : "border-border"
                                            } text-sm focus:outline-none focus:ring-2 ${errors.title ? "focus:ring-red-500/20" : "focus:ring-primary/20"
                                            } focus:border-primary transition-all`}
                                    />
                                    {errors.title && <p className="mt-1 text-xs text-red-500 font-medium">{errors.title.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-text-primary mb-2">Detailed Description</label>
                                    <textarea
                                        {...register("description")}
                                        rows={6}
                                        placeholder="Describe your project, features, and how it helps creators..."
                                        className={`w-full px-5 py-4 rounded-2xl border ${errors.description ? "border-red-500" : "border-border"
                                            } text-sm focus:outline-none focus:ring-2 ${errors.description ? "focus:ring-red-500/20" : "focus:ring-primary/20"
                                            } focus:border-primary transition-all resize-none`}
                                    />
                                    {errors.description && <p className="mt-1 text-xs text-red-500 font-medium">{errors.description.message}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-text-primary mb-2">Category</label>
                                        <select
                                            {...register("category")}
                                            className={`w-full h-12 px-5 rounded-2xl border ${errors.category ? "border-red-500" : "border-border"
                                                } text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer appearance-none bg-white`}
                                        >
                                            <option value="">Select Category</option>
                                            <option value="SaaS Boilerplate">SaaS Boilerplate</option>
                                            <option value="UI Kit / Components">UI Kit / Components</option>
                                            <option value="Mobile App Template">Mobile App Template</option>
                                            <option value="AI / Machine Learning">AI / Machine Learning</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-text-primary mb-2">Base Price (USD)</label>
                                        <div className="relative">
                                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted font-bold">$</span>
                                            <input
                                                {...register("price", { valueAsNumber: true })}
                                                type="number"
                                                placeholder="0.00"
                                                className="w-full h-12 pl-10 pr-5 rounded-2xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-text-primary mb-2">Tech Stack</label>
                                    <input
                                        {...register("techStack")}
                                        type="text"
                                        placeholder="e.g. Next.js, TypeScript, Prisma, Stripe"
                                        className="w-full h-12 px-5 rounded-2xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    />
                                    <p className="mt-2 text-[10px] text-text-muted italic">Separate with commas</p>
                                </div>
                            </div>
                        )}

                        {/* STEP 2: FILES */}
                        {step === 2 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <label className="p-10 rounded-3xl border-2 border-dashed border-border bg-surface-alt flex flex-col items-center justify-center text-center group cursor-pointer hover:border-primary/50 transition-all">
                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => setThumbnail(e.target.files?.[0] || null)} />
                                            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                                                <Upload className={`w-6 h-6 ${thumbnail ? "text-primary" : "text-text-muted"}`} />
                                            </div>
                                            <p className="text-sm font-bold text-text-primary truncate max-w-full px-2">
                                                {thumbnail ? thumbnail.name : "Primary Cover"}
                                            </p>
                                            <p className="text-[10px] text-text-muted mt-1">Main display image</p>
                                        </label>

                                        <label className="p-10 rounded-3xl border-2 border-dashed border-border bg-surface-alt flex flex-col items-center justify-center text-center group cursor-pointer hover:border-primary/50 transition-all">
                                            <input type="file" className="hidden" accept=".zip,.rar,.7z" onChange={(e) => setSourceFile(e.target.files?.[0] || null)} />
                                            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                                                <Upload className={`w-6 h-6 ${sourceFile ? "text-primary" : "text-text-muted"}`} />
                                            </div>
                                            <p className="text-sm font-bold text-text-primary truncate max-w-full px-2">
                                                {sourceFile ? sourceFile.name : "Source ZIP"}
                                            </p>
                                            <p className="text-[10px] text-text-muted mt-1">Deliverable asset</p>
                                        </label>
                                    </div>

                                    <div className="p-8 rounded-3xl border-2 border-dashed border-border bg-white space-y-4">
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-bold text-text-primary">Gallery Previews (Up to 5)</label>
                                            <span className="text-[10px] font-black text-primary bg-primary/5 px-2 py-1 rounded-md uppercase">{gallery.length}/5 Slots</span>
                                        </div>
                                        <input 
                                            type="file" 
                                            multiple 
                                            accept="image/*" 
                                            onChange={(e) => {
                                                const files = Array.from(e.target.files || []);
                                                setGallery(files.slice(0, 5));
                                            }}
                                            className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/5 file:text-primary hover:file:bg-primary/10 transition-all cursor-pointer"
                                        />
                                        {gallery.length > 0 && (
                                            <div className="flex flex-wrap gap-2 pt-2">
                                                {gallery.map((file, i) => (
                                                    <div key={i} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-navy-dark flex items-center gap-2">
                                                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                                        {file.name}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-text-primary mb-2">Live Demo URL (Optional)</label>
                                    <div className="relative">
                                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                        <input
                                            {...register("demoUrl")}
                                            type="text"
                                            placeholder="https://your-demo.com"
                                            className="w-full h-12 pl-12 pr-5 rounded-xl border border-border text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: REVIEW */}
                        {step === 3 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="p-8 rounded-3xl bg-navy-dark text-white shadow-2xl relative overflow-hidden">
                                    <h4 className="text-lg font-black italic mb-6">Final Review</h4>
                                    <div className="space-y-4 relative z-10">
                                        <div className="flex justify-between items-center py-3 border-b border-white/10">
                                            <span className="text-white/60 text-xs font-bold uppercase tracking-widest">Asset Name</span>
                                            <span className="font-bold">Summary Available</span>
                                        </div>
                                        <div className="flex justify-between items-center py-3 border-b border-white/10">
                                            <span className="text-white/60 text-xs font-bold uppercase tracking-widest">Files</span>
                                            <span className="font-bold">{thumbnail ? "1 Img" : "0 Img"} / {sourceFile ? "1 Zip" : "0 Zip"}</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-3">
                                            <span className="text-white/60 text-xs font-bold uppercase tracking-widest">Listing Fee</span>
                                            <span className="text-primary font-black">FREE (0% Setup)</span>
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/20 blur-[60px] rounded-full"></div>
                                </div>
                                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-amber-600 flex-shrink-0" />
                                    <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                                        Your project will enter the PENDING state for verification. Once approved, it will be live in the global gallery.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* NAV BUTTONS */}
                        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center gap-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="btn-primary w-full sm:w-auto px-10 h-14 rounded-2xl shadow-xl shadow-primary/20 text-base"
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        {step === 3 ? "Publishing..." : "Processing..."}
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        {step === 3 ? "Publish Content" : "Save & Continue"}
                                        <ChevronRight className="w-5 h-5" />
                                    </div>
                                )}
                            </button>

                            {step > 1 && (
                                <button
                                    type="button"
                                    onClick={() => setStep(s => s - 1)}
                                    className="w-full sm:w-auto px-10 h-14 rounded-2xl text-text-secondary font-bold text-sm hover:bg-slate-100 transition-colors"
                                >
                                    Go Back
                                </button>
                            )}

                            {step === 1 && (
                                <Link
                                    href="/dashboard"
                                    className="w-full sm:w-auto px-10 h-14 rounded-2xl text-text-secondary font-bold text-sm flex items-center justify-center hover:bg-slate-100"
                                >
                                    Cancel
                                </Link>
                            )}
                        </div>
                    </form>
                </div>

                <div className="mt-12 p-6 rounded-2xl bg-primary/5 border border-primary/10 flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-text-primary mb-1">Creator Security Protocol</h4>
                        <p className="text-xs text-text-secondary leading-relaxed">Everything you upload is encrypted and stored in our secure data lake. Verification ensures quality and platform trust.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
