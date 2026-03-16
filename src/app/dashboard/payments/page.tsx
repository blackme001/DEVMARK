"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, CreditCard, Plus, ShieldCheck, Zap, DollarSign, History, Settings, Loader2, Search, Filter, ShoppingBag } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function PaymentsPage() {
    const { user } = useAuthStore();
    const isSeller = user?.role === 'SELLER' || user?.role === 'BOTH';
    const [activeTab, setActiveTab] = useState("billing"); // billing, history, payouts
    const [purchases, setPurchases] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (activeTab === "history" && user) {
            loadHistory();
        }
    }, [activeTab, user]);

    async function loadHistory() {
        if (!user?.id) return;

        try {
            setIsLoading(true);
            const projectIds = await getProjectIds();
            const { data, error } = await supabase
                .from('Purchase')
                .select('*, project:Project(title)')
                .or(`buyerId.eq.${user.id},projectId.in.(${projectIds})`)
                .order('createdAt', { ascending: false });

            if (error) throw error;
            setPurchases(data || []);
        } catch (err) {
            console.error("Failed to load history:", err);
            toast.error("Could not sync transaction history.");
        } finally {
            setIsLoading(false);
        }
    }

    async function getProjectIds() {
        if (!user?.id) return '00000000-0000-0000-0000-000000000000';
        const { data } = await supabase.from('Project').select('id').eq('creatorId', user.id);
        const ids = (data as { id: string }[] | null)?.map(p => p.id) || [];
        return ids.length > 0 ? ids.join(',') : '00000000-0000-0000-0000-000000000000';
    }

    const handleAddMethod = () => {
        toast.info("Payments Update in Progress", {
            description: "New payment methods will be available soon in our updated billing portal."
        });
    };

    return (
        <div className="min-h-screen bg-surface-alt pb-20">
            <div className="max-w-4xl mx-auto px-6 pt-12">
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-sm font-semibold mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </Link>

                <header className="mb-10">
                    <h1 className="text-3xl font-black text-text-primary mb-2 tracking-tight italic">
                        Payments & Billing
                    </h1>
                    <p className="text-text-secondary text-sm font-medium">
                        Manage your payment methods, transaction history, and creator payout settings.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Sidebar / Quick Links */}
                    <div className="space-y-4">
                        <div className="card-flat p-4 bg-navy-dark text-white border-none shadow-xl">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4 opacity-60">Account Type</h3>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                    {isSeller ? <DollarSign className="w-5 h-5 text-primary" /> : <CreditCard className="w-5 h-5 text-primary" />}
                                </div>
                                <span className="font-bold">{user?.role} ACCOUNT</span>
                            </div>
                        </div>

                        <nav className="card-flat p-2 flex flex-col gap-1">
                            {[
                                { id: "billing", icon: CreditCard, label: "Cards & Billing" },
                                { id: "history", icon: History, label: "Transaction History" },
                                { id: "payouts", icon: Settings, label: "Payout Settings", hidden: !isSeller },
                            ].filter(i => !i.hidden).map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all ${activeTab === item.id
                                        ? "bg-primary/10 text-primary"
                                        : "text-text-secondary hover:bg-surface-hover"
                                        }`}
                                >
                                    <item.icon className="w-4 h-4" />
                                    {item.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-6">
                        {/* ───── Cards & Billing ───── */}
                        {activeTab === "billing" && (
                            <section className="card-flat p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-xl font-bold text-text-primary">Saved Payment Methods</h2>
                                    <button onClick={handleAddMethod} className="btn-primary py-2 px-4 text-xs flex items-center gap-2">
                                        <Plus className="w-4 h-4" /> Add Method
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-6 rounded-2xl border border-border bg-white flex items-center gap-4 group hover:border-primary/30 transition-all cursor-pointer">
                                        <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border border-border">
                                            <CreditCard className="w-6 h-6 text-slate-400" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-black text-text-primary">•••• •••• •••• 4242</p>
                                            <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Expires 12/26</p>
                                        </div>
                                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-lg border border-emerald-100">DEFAULT</span>
                                    </div>

                                    <div className="p-6 rounded-2xl border border-border bg-white/50 flex items-center gap-4 opacity-70 italic">
                                        <p className="text-xs text-text-secondary">Protected by industrial-grade payment encryption.</p>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* ───── Transaction History ───── */}
                        {activeTab === "history" && (
                            <section className="card-flat p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-xl font-bold text-text-primary">Transaction History</h2>
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 rounded-lg bg-surface-alt border border-border">
                                            <Filter className="w-4 h-4 text-text-muted" />
                                        </div>
                                    </div>
                                </div>

                                {isLoading ? (
                                    <div className="flex flex-col items-center justify-center py-20">
                                        <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Syncing ledger...</p>
                                    </div>
                                ) : purchases.length > 0 ? (
                                    <div className="space-y-3">
                                        {purchases.map(p => (
                                            <div key={p.id} className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-slate-50/50 transition-all">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${p.buyerId === user?.id ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                                        {p.buyerId === user?.id ? <ShoppingBag className="w-5 h-5" /> : <DollarSign className="w-5 h-5" />}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-text-primary">{p.project?.title || 'Unknown Project'}</p>
                                                        <p className="text-[10px] text-text-muted font-bold uppercase">{new Date(p.createdAt).toLocaleDateString()} • {p.status}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right text-sm font-black text-navy-dark">
                                                    {p.buyerId === user?.id ? '-' : '+'}${p.amount}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-100">
                                        <History className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                        <p className="text-slate-400 font-medium italic">No transactions identified.</p>
                                    </div>
                                )}
                            </section>
                        )}

                        {/* ───── Payout Settings ───── */}
                        {activeTab === "payouts" && isSeller && (
                            <section className="card-flat p-8 border-primary/20 bg-primary/5 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 blur-[60px] rounded-full" />
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                                            <Zap className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-text-primary">Creator Payouts</h2>
                                            <p className="text-xs text-text-secondary">Direct Revenue Distribution</p>
                                        </div>
                                    </div>

                                    <div className="p-5 rounded-3xl bg-white border border-primary/10 flex items-center justify-between mb-8 shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                                            <div>
                                                <p className="text-xs font-bold text-text-primary">Payout Account: Pending Update</p>
                                                <p className="text-[10px] text-text-muted font-black uppercase tracking-widest">Revenue Flowing: NO</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        <div className="p-4 rounded-2xl bg-white/50 border border-border">
                                            <p className="text-[10px] text-text-muted font-black uppercase tracking-[0.1em] mb-1 text-center">Pending Clear</p>
                                            <p className="text-xl font-black text-center text-navy-dark italic">$0.00</p>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-white/50 border border-border">
                                            <p className="text-[10px] text-text-muted font-black uppercase tracking-[0.1em] mb-1 text-center">Lifetime Revenue</p>
                                            <p className="text-xl font-black text-center text-navy-dark italic">${user?.role === 'SELLER' ? '0.00' : '0.00'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 text-[10px] text-text-secondary italic font-medium">
                                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                        Security Notice: All payout changes require 2FA verification.
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
