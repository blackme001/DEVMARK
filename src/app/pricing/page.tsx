"use client";

import React, { useState } from "react";
import { Check, Zap, Rocket, Star, Shield, ArrowRight, X, Loader2, Award } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { usePaddle } from "@/lib/paddle";

const ELITE_MONTHLY_PRICE_ID = process.env.PADDLE_ELITE_MONTHLY_PRICE_ID || "pri_01kkv8ak453feaahyqask2gw3f";
const ELITE_YEARLY_PRICE_ID = process.env.PADDLE_ELITE_YEARLY_PRICE_ID || "pri_01kkv8ak453feaahyqask2gw3f";

const plans = [
    {
        name: "Standard Creator",
        price: "0",
        description: "Ideal for individual developers starting their marketplace journey.",
        features: [
            "Up to 5 Active Listings",
            "Standard Commission (20%)",
            "Public Creator Profile",
            "Basic Analytics",
            "Community Support"
        ],
        cta: "Start Publishing",
        status: "FREE",
        popular: false,
        color: "slate",
        priceId: null,
    },
    {
        name: "Elite Creator",
        price: "29",
        description: "For professional engineers scaling their digital asset portfolio.",
        features: [
            "Unlimited Active Listings",
            "Low Commission (10%)",
            "Verified Pro Badge",
            "Priority Payouts",
            "Advanced Sales Analytics",
            "Direct Support Line"
        ],
        cta: "Go Elite Now",
        status: "MOST POPULAR",
        popular: true,
        color: "primary",
        priceId: ELITE_MONTHLY_PRICE_ID,
    }
];

export default function PricingPage() {
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { user } = useAuthStore();
    const paddle = usePaddle();

    const handlePlanSelection = async (plan: typeof plans[0]) => {
        if (!plan.priceId) {
            // Free plan — just redirect to signup
            window.location.href = user ? "/dashboard" : "/signup";
            return;
        }

        if (!paddle) {
            toast.error("Payment system is loading. Please try again in a moment.");
            return;
        }

        const priceId = billingCycle === "yearly" ? ELITE_YEARLY_PRICE_ID : ELITE_MONTHLY_PRICE_ID;

        const userTier = (user as any)?.subscriptionTier;

        if (userTier === 'ELITE') {
            toast.success("You are already an Elite Creator!");
            router.push("/dashboard");
            return;
        }

        try {
            setIsLoading(true);
            await paddle.Checkout.open({
                items: [{ priceId, quantity: 1 }],
                customer: user?.email ? { email: user.email } : undefined,
                customData: {
                    userId: user?.id,
                },
                settings: {
                    displayMode: "overlay",
                    theme: "dark",
                    locale: "en",
                    successUrl: `${window.location.origin}/dashboard?checkout=success`,
                },
            });
        } catch (err) {
            console.error("Paddle checkout error:", err);
            toast.error("Could not open checkout. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-surface-alt py-24 px-6 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full translate-y-1/2"></div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-20 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
                        <Zap className="w-3 h-3" /> Monetization Plans
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-navy-dark tracking-tighter mb-6 italic">
                        Upgrade Your <span className="text-primary italic">Distribution</span>
                    </h1>
                    <p className="max-w-xl mx-auto text-slate-500 font-medium text-lg italic">
                        Scale your assets from a few repositories to a full-scale digital engineering enterprise.
                    </p>

                    {/* Billing Toggle */}
                    <div className="flex items-center justify-center gap-4 mt-12">
                        <span className={`text-sm font-black transition-colors ${billingCycle === 'monthly' ? 'text-navy-dark' : 'text-slate-400'}`}>Monthly</span>
                        <button
                            onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
                            className="w-14 h-7 rounded-full bg-slate-200 p-1 relative transition-colors hover:bg-slate-300"
                        >
                            <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${billingCycle === 'yearly' ? 'translate-x-7' : 'translate-x-0'}`}></div>
                        </button>
                        <span className={`text-sm font-black transition-colors ${billingCycle === 'yearly' ? 'text-navy-dark' : 'text-slate-400'}`}>Yearly <span className="text-primary ml-1 text-xs">-20%</span></span>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
                    {plans.map((plan, i) => (
                        <div
                            key={i}
                            className={`relative p-10 rounded-[3rem] transition-all duration-500 group border-2 ${plan.popular
                                ? "bg-navy-dark text-white border-primary shadow-2xl shadow-primary/20 scale-105"
                                : "bg-white border-slate-100 hover:border-primary/20"
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-5 py-1.5 bg-primary text-white text-[10px] font-black rounded-full tracking-[0.2em] shadow-lg shadow-primary/40">
                                    {plan.status}
                                </div>
                            )}

                            <div className="mb-8">
                                <div className={`text-2xl font-black mb-2 uppercase tracking-tighter ${plan.popular ? 'text-primary' : 'text-navy-dark'}`}>{plan.name}</div>
                                <div className="flex items-baseline gap-2 mb-4">
                                    <span className="text-6xl font-black italic tracking-tighter">${billingCycle === 'yearly' ? Math.floor(parseInt(plan.price) * 0.8) : plan.price}</span>
                                    <span className={`text-sm font-black italic text-slate-400`}>/mo</span>
                                </div>
                                <p className={`text-sm font-medium leading-relaxed ${plan.popular ? 'text-slate-400 italic' : 'text-slate-500'}`}>{plan.description}</p>
                            </div>

                            <div className="space-y-4 mb-10">
                                {plan.features.map((feature, idx) => (
                                    <div key={idx} className="flex items-center gap-4">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${plan.popular ? 'bg-primary/20' : 'bg-primary/10'}`}>
                                            <Check className={`w-3 h-3 text-primary`} />
                                        </div>
                                        <span className={`text-sm font-bold ${plan.popular ? 'text-slate-200' : 'text-slate-600'}`}>{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => handlePlanSelection(plan)}
                                disabled={isLoading && plan.popular}
                                className={`w-full h-14 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed ${plan.popular
                                    ? "bg-primary text-white hover:scale-[1.02] shadow-xl shadow-primary/30"
                                    : "bg-slate-50 text-navy-dark hover:bg-slate-100 hover:scale-[1.02]"
                                    }`}>
                                {isLoading && plan.popular ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>{plan.cta} <ArrowRight className="w-5 h-5" /></>
                                )}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Trust Section */}
                <div className="mt-32 text-center max-w-2xl mx-auto">
                    <div className="flex items-center justify-center gap-8 mb-12 opacity-50">
                        <Shield className="w-8 h-8 text-slate-400" />
                        <Award className="w-8 h-8 text-slate-400" />
                        <Star className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-2xl font-black text-navy-dark mb-4 italic underline decoration-primary/20 decoration-4 underline-offset-8">Secure Creator Economy</h3>
                    <p className="text-slate-500 font-medium">
                        Payments are powered by Paddle — a fully compliant merchant of record handling tax, VAT, and global compliance on your behalf.
                    </p>
                </div>
            </div>
        </div>
    );
}
