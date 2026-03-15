"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
    DollarSign,
    ShoppingBag,
    Package,
    Star,
    TrendingUp,
    Plus,
    ExternalLink,
    Upload,
    BarChart3,
    MessageSquare,
    Sparkles,
    Users,
    Target,
    Lightbulb,
    ImageIcon,
    CheckCircle2,
    Zap,
    RefreshCw,
    Link2,
    ArrowUpRight,
    Heart,
    BookOpen,
    Award,
    Loader2,
    AlertCircle,
    X,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ProfileCompletionBanner } from "@/components/ProfileCompletionBanner";
import { toast } from "sonner";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
} from "chart.js";
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip
);

/* ───── Chart Config ───── */
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { mode: "index" as const, intersect: false } },
    scales: {
        x: {
            grid: { display: false },
            ticks: { color: "#94a3b8", font: { size: 11 } },
            border: { display: false },
        },
        y: {
            display: false,
            grid: { display: false },
        },
    },
};

export default function DashboardPage() {
    const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
    const [stats, setStats] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [messagesLoading, setMessagesLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push("/auth");
        }
    }, [isAuthenticated, authLoading, router]);

    useEffect(() => {
        async function loadData() {
            if (!isAuthenticated || !user) return;
            try {
                setIsLoading(true);
                setMessagesLoading(true);

                // 1. Fetch Projects created by this user
                const { data: projects, error: projectsError } = await supabase
                    .from('Project')
                    .select('*')
                    .eq('creatorId', user.id)
                    .order('createdAt', { ascending: false }) as { data: any[] | null, error: any };

                if (projectsError) throw projectsError;

                // 2. Fetch Purchases for these projects
                const projectIds = projects?.map(p => p.id) || [];
                const { data: purchases, error: purchasesError } = await supabase
                    .from('Purchase')
                    .select('*')
                    .in('projectId', projectIds)
                    .eq('status', 'SUCCESS') as { data: any[] | null, error: any };

                if (purchasesError) throw purchasesError;

                // 3. Fetch Messages for this user
                const { data: userMessages, error: messagesError } = await supabase
                    .from('Message')
                    .select('*, sender:User!senderId(firstName, lastName, email)')
                    .or(`senderId.eq.${user.id},receiverId.eq.${user.id}`)
                    .order('createdAt', { ascending: false });

                if (messagesError) throw messagesError;

                // Aggregate stats
                const totalSales = purchases?.length || 0;
                const monthlyRevenue = purchases?.reduce((acc, p) => acc + (p.amount || 0), 0) || 0;
                const totalProducts = projects?.length || 0;
                const liveProducts = projects?.filter(p => p.status === 'APPROVED').length || 0;

                setStats({
                    monthlyRevenue,
                    totalSales,
                    totalProducts,
                    liveProducts,
                    avgRating: "0.0",
                    projects: projects?.slice(0, 5) || []
                });

                setMessages(userMessages || []);
                setError(null);
            } catch (err: any) {
                console.error("Failed to load dashboard data:", err);
                setError("Unable to sync dashboard data.");
            } finally {
                setIsLoading(false);
                setMessagesLoading(false);
            }
        }
        loadData();

        // Realtime Subscription for Messages
        const channel = supabase
            .channel('realtime:messages')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'Message',
                filter: `receiverId=eq.${user?.id}`
            }, (payload) => {
                setMessages(prev => [payload.new as any, ...prev]);
                toast.info("New message received!");
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [isAuthenticated, user]);

    const [replyTo, setReplyTo] = useState<any>(null);
    const [replyText, setReplyText] = useState("");
    const [isSending, setIsSending] = useState(false);

    const handleSendReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyTo || !replyText.trim() || !user) return;

        try {
            setIsSending(true);
            const { error } = await (supabase.from('Message') as any).insert({
                senderId: user.id,
                receiverId: replyTo.senderId,
                content: replyText,
                projectId: replyTo.projectId,
            });

            if (error) throw error;
            toast.success("Reply transmitted successfully.");
            setReplyTo(null);
            setReplyText("");
        } catch (err: any) {
            toast.error(err.message || "Failed to send message.");
        } finally {
            setIsSending(false);
        }
    };

    if (authLoading || (isLoading && !stats)) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-6" />
                <h2 className="text-2xl font-black text-navy-dark mb-2">Syncing your workspace...</h2>
                <p className="text-slate-500 italic max-w-sm">Gathering your latest product metrics and client data.</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center mb-6">
                    <AlertCircle className="w-10 h-10 text-rose-500" />
                </div>
                <h2 className="text-2xl font-black text-navy-dark mb-2">Connection Interrupted</h2>
                <p className="text-slate-500 mb-8 max-w-sm">{error}</p>
                <button onClick={() => window.location.reload()} className="btn-primary px-8">Try Again</button>
            </div>
        );
    }

    const businessStats = [
        {
            icon: DollarSign,
            label: "Monthly Revenue",
            value: `$${stats?.monthlyRevenue?.toLocaleString() || '0'}`,
            change: "+6.5%",
            color: "text-primary",
            bg: "bg-primary/10",
        },
        {
            icon: ShoppingBag,
            label: "Products Sold",
            value: stats?.totalSales || '0',
            change: "+8.3%",
            color: "text-blue-600",
            bg: "bg-blue-50",
        },
        {
            icon: Package,
            label: "Total Products",
            value: stats?.totalProducts || '0',
            extra: `${stats?.liveProducts || '0'} Live`,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
        },
        {
            icon: Star,
            label: "Average Rating",
            value: stats?.avgRating || '0',
            extra: "Excellent",
            color: "text-amber-500",
            bg: "bg-amber-50",
        },
    ];

    const chartData = {
        labels: ["Mar 2025", "Apr", "May", "Jun", "Jul", "Aug", "Sep 2025"],
        datasets: [
            {
                data: [0, 0, 0, 0, 0, 0, stats?.monthlyRevenue || 0],
                borderColor: "#0f766e",
                backgroundColor: "rgba(15,118,110,0.08)",
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "#0f766e",
                borderWidth: 2.5,
            },
        ],
    };

    return (
        <div className="min-h-screen bg-surface-alt">
            <div className="max-w-[1360px] mx-auto px-6 py-10">
                {/* ─── Profile Completion Banner ─── */}
                <ProfileCompletionBanner />

                {/* ─── Header ─── */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-navy-dark mb-1">
                            Creator Dashboard
                        </h1>
                        <p className="text-sm text-slate-500 font-medium italic">
                            Welcome back, {user?.firstName}! Here&apos;s your live business intelligence for {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => {
                                if (user?.role === 'SELLER' && !user.payoutsEnabled && !user.user_metadata?.payoutsEnabled) {
                                    toast.error("Payout setup required.", {
                                        description: "Please complete your payout configuration in Profile Settings before uploading products."
                                    });
                                    return;
                                }
                                router.push("/dashboard/upload");
                            }}
                            className="btn-primary py-3 px-6 shadow-xl shadow-primary/20 flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" /> Add New Product
                        </button>
                        <Link href="/profile" className="btn-outline py-3 px-6">
                            <ExternalLink className="w-5 h-5" /> Public View
                        </Link>
                    </div>
                </header>

                {/* ─── Stats Row ─── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {businessStats.map((s, i) => (
                        <div key={i} className="stat-card p-6 border-transparent hover:border-primary/20 transition-all">
                            <div className={`w-12 h-12 rounded-2xl ${s.bg} flex items-center justify-center flex-shrink-0 mb-4`}>
                                <s.icon className={`w-6 h-6 ${s.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-1">{s.label}</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-black text-text-primary">
                                        {s.value}
                                    </span>
                                    {s.change && (
                                        <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                                            {s.change}
                                        </span>
                                    )}
                                </div>
                                {s.extra && (
                                    <p className="text-xs text-text-muted mt-2 font-medium">{s.extra}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* ─── Revenue + Top Products ─── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Chart */}
                    <div className="card-flat p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-xl font-bold text-navy-dark">Revenue Velocity</h2>
                                <p className="text-xs text-slate-400">Monthly performance tracking</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black tracking-widest text-primary bg-primary/10 px-3 py-1.5 rounded-full uppercase">
                                    Live Sync
                                </span>
                            </div>
                        </div>
                        <div className="h-[250px]">
                            <Line data={chartData} options={chartOptions} />
                        </div>
                    </div>

                    {/* Recent Products */}
                    <div className="card-flat p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-xl font-bold text-navy-dark">Recent Activity</h2>
                                <p className="text-xs text-slate-400">Your latest platform entries</p>
                            </div>
                            <Link href="/explore" className="text-sm font-bold text-primary hover:underline">View All Assets</Link>
                        </div>
                        <div className="space-y-4">
                            {stats?.projects?.length > 0 ? (
                                stats.projects.map((p: any, i: number) => (
                                    <div
                                        key={p.id}
                                        className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100/50 hover:bg-white hover:border-border hover:shadow-lg hover:shadow-navy-dark/5 transition-all animate-fade-in"
                                        style={{ animationDelay: `${i * 100}ms` }}
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-white border border-border flex items-center justify-center text-xl flex-shrink-0 shadow-sm">
                                            📦
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-text-primary truncate uppercase tracking-tight">
                                                {p.title}
                                            </p>
                                            <p className="text-xs text-text-muted font-medium italic">{p.category} • ${p.price}</p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider ${p.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {p.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
                                    <p className="text-slate-400 font-medium italic">No products listed yet.</p>
                                    <Link href="/dashboard/upload" className="text-primary font-bold text-sm hover:underline mt-2 inline-block">Upload your first asset</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ─── Client Center + Growth ─── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Relationship Center */}
                    <div className="lg:col-span-2 card-flat p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold text-navy-dark italic underline decoration-primary/30 decoration-4 underline-offset-8">Client Pulse</h2>
                            <div className="flex items-center gap-2">
                                <button className="text-xs font-bold px-4 py-2 rounded-xl bg-navy-dark text-white">Active</button>
                                <button className="text-xs font-bold px-4 py-2 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200">History</button>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {messagesLoading ? (
                                <div className="text-center py-20">
                                    <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
                                    <p className="text-slate-400 italic">Syncing message history...</p>
                                </div>
                            ) : messages.length > 0 ? (
                                messages.map((m, i) => (
                                    <div
                                        key={m.id}
                                        onClick={() => setReplyTo(m)}
                                        className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:shadow-md hover:border-primary/20 transition-all cursor-pointer group"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                            {m.sender?.firstName?.[0] || m.sender?.email?.[0] || 'U'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-navy-dark truncate">{m.sender?.firstName || 'User'} {m.sender?.lastName || ''}</p>
                                            <p className="text-xs text-slate-500 line-clamp-1">{m.content}</p>
                                        </div>
                                        <div className="text-right flex flex-col items-end gap-1">
                                            <p className="text-[10px] text-slate-400 font-medium">
                                                {new Date(m.createdAt).toLocaleDateString()}
                                            </p>
                                            <div className="w-2 h-2 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-3xl">
                                    <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                    <p className="text-slate-400 font-medium italic">No active client conversations yet.</p>
                                </div>
                            )}
                        </div>

                        {/* Reply Modal */}
                        {replyTo && (
                            <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
                                <div className="absolute inset-0 bg-navy-dark/60 backdrop-blur-sm" onClick={() => setReplyTo(null)}></div>
                                <div className="bg-white rounded-[2.5rem] w-full max-w-xl p-10 relative z-10 shadow-2xl animate-in fade-in zoom-in duration-200">
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="text-3xl font-black text-navy-dark italic">Reply to {replyTo.sender?.firstName}</h2>
                                        <button onClick={() => setReplyTo(null)} className="text-slate-400 hover:text-navy-dark transition-colors">
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-2xl mb-6 italic text-sm text-slate-500">
                                        &quot;{replyTo.content}&quot;
                                    </div>
                                    <form onSubmit={handleSendReply} className="space-y-6">
                                        <div>
                                            <label className="block text-xs font-black uppercase text-slate-400 mb-2 tracking-widest">Message Content</label>
                                            <textarea
                                                required
                                                rows={4}
                                                value={replyText}
                                                onChange={(e) => setReplyText(e.target.value)}
                                                placeholder="Type your response..."
                                                className="w-full p-4 rounded-2xl border border-slate-200 bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                            ></textarea>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isSending}
                                            className="w-full btn-primary h-14 justify-center"
                                        >
                                            {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Transmit Reply"}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-8">
                        {/* Quick Actions */}
                        <div className="card-flat p-8 bg-navy-dark text-white border-none shadow-2xl shadow-navy-dark/20 relative overflow-hidden">
                            <div className="relative z-10">
                                <h2 className="text-xl font-black mb-6 italic">Quick Actions</h2>
                                <div className="space-y-3">
                                    {[
                                        { icon: Upload, label: "Deploy New Asset", href: "/dashboard/upload" },
                                        { icon: BarChart3, label: "Market Analytics", href: "#" },
                                        { icon: MessageSquare, label: "Client CRM", href: "#" },
                                    ].map((action, i) => (
                                        <button
                                            key={i}
                                            onClick={() => {
                                                if (action.label === "Deploy New Asset" && user?.role === 'SELLER' && !user.payoutsEnabled && !user.user_metadata?.payoutsEnabled) {
                                                    toast.error("Payout setup required.");
                                                    return;
                                                }
                                                router.push(action.href);
                                            }}
                                            className="w-full flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-left group"
                                        >
                                            <action.icon className="w-5 h-5 text-primary" />
                                            <span className="text-sm font-bold">
                                                {action.label}
                                            </span>
                                            <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-white ml-auto transition-all" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/10 blur-[60px] rounded-full"></div>
                        </div>

                        {/* Growth */}
                        <div className="card-flat p-8">
                            <h2 className="text-xl font-bold text-navy-dark mb-6">Market Intelligence</h2>
                            <div className="space-y-6">
                                {[
                                    { icon: Sparkles, title: "Next.js 16 Boilerplates", desc: "Search volume for Next 16 core builds is up 400%." },
                                    { icon: Target, title: "Fintech Niche", desc: "Established gap in secure banking component libraries." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center flex-shrink-0">
                                            <item.icon className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-navy-dark mb-1 underline decoration-primary/20">{item.title}</p>
                                            <p className="text-xs text-slate-500 leading-relaxed font-medium italic">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
