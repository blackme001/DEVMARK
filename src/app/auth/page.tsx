import React from "react";
import Link from "next/link";
import { LogIn, UserPlus, ShieldCheck, Zap, Star } from "lucide-react";

export default function AuthPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center py-20 px-6">
            <div className="max-w-[1000px] w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[3rem] overflow-hidden shadow-2xl shadow-navy-dark/10">
                {/* Visual Side */}
                <div className="hidden lg:flex bg-navy-dark p-16 flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center mb-8">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-4xl font-black text-white mb-6 leading-tight">
                            The Hub for <span className="text-primary italic">Top-Tier</span> Digital Craftsmen.
                        </h2>
                        <ul className="space-y-4">
                            {[
                                { text: "Secure Licensing System", icon: ShieldCheck },
                                { text: "Premium Marketplace Reach", icon: Zap },
                                { text: "Verified Creator Community", icon: Star },
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-slate-300 font-medium">
                                    <item.icon className="w-5 h-5 text-primary" />
                                    {item.text}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="relative z-10 pt-12 border-t border-white/10">
                        <p className="text-slate-400 text-sm">Join 5,000+ creators building the future of software.</p>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 blur-[100px] rounded-full"></div>
                </div>

                {/* Buttons Side */}
                <div className="p-12 lg:p-20 flex flex-col justify-center text-center">
                    <h1 className="text-3xl font-black text-navy-dark mb-4">Welcome to DevMarket</h1>
                    <p className="text-slate-500 mb-12">Choose your path to begin your journey.</p>

                    <div className="space-y-4">
                        <Link
                            href="/login"
                            className="w-full h-16 rounded-2xl bg-primary text-white font-black text-lg flex items-center justify-center gap-3 hover:bg-primary-dark shadow-lg shadow-primary/20 transition-all"
                        >
                            <LogIn className="w-6 h-6" />
                            Sign In to Account
                        </Link>
                        <Link
                            href="/signup"
                            className="w-full h-16 rounded-2xl border-2 border-slate-200 text-navy-dark font-black text-lg flex items-center justify-center gap-3 hover:bg-slate-50 transition-all"
                        >
                            <UserPlus className="w-6 h-6 text-primary" />
                            Create New Account
                        </Link>
                    </div>

                    <div className="mt-12">
                        <p className="text-slate-400 text-sm">
                            Need help? <Link href="/help" className="text-primary font-bold hover:underline">Visit Help Center</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
