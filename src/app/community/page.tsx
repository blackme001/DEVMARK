import React from "react";
import { MessageSquare, Users, Award, ShieldCheck, Zap } from "lucide-react";

export default function Community() {
    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20">
            <div className="max-w-[1360px] mx-auto px-6 text-center">
                <div className="max-w-3xl mx-auto mb-16 underline decoration-secondary/30 decoration-8 underline-offset-8">
                    <h1 className="text-5xl font-black text-navy-dark mb-6 tracking-tight">The Pro Creator <span className="text-primary">Community</span></h1>
                    <p className="text-slate-600 text-xl font-medium">Connect, collaborate, and grow with the world's best developers.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 text-left">
                    <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm">
                        <MessageSquare className="w-10 h-10 text-primary mb-6" />
                        <h3 className="text-2xl font-bold text-navy-dark mb-4">Community Forums</h3>
                        <p className="text-slate-500 leading-relaxed mb-6">Join thousands of creators in our exclusive forums to discuss tech, sales, and strategy.</p>
                        <button className="w-full h-14 rounded-2xl bg-navy-dark text-white font-bold hover:bg-navy-light transition-all">Join the Discussion</button>
                    </div>
                    <div className="bg-primary rounded-[2.5rem] p-10 text-white shadow-xl shadow-primary/20 scale-105">
                        <Users className="w-10 h-10 text-white mb-6" />
                        <h3 className="text-2xl font-bold mb-4">Discord Groups</h3>
                        <p className="text-white/80 leading-relaxed mb-6">Real-time collaboration and networking in our private Discord servers.</p>
                        <button className="w-full h-14 rounded-2xl bg-white text-primary font-bold hover:bg-slate-50 transition-all">Request Invite</button>
                    </div>
                    <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm">
                        <Award className="w-10 h-10 text-primary mb-6" />
                        <h3 className="text-2xl font-bold text-navy-dark mb-4">Peer Recognition</h3>
                        <p className="text-slate-500 leading-relaxed mb-6">Get your projects reviewed and featured by top-tier community members.</p>
                        <button className="w-full h-14 rounded-2xl border-2 border-slate-200 text-navy-dark font-bold hover:bg-slate-50 transition-all">View Leaderboard</button>
                    </div>
                </div>

                <div className="bg-navy-dark rounded-[3rem] p-12 text-white overflow-hidden relative">
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="text-left md:max-w-xl">
                            <h2 className="text-3xl font-bold mb-4">DevMarket Pro Events</h2>
                            <p className="text-slate-400">Monthly webinars, hackathons, and networking sessions exclusively for our verified creators.</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-3 px-6 py-3 bg-white/10 rounded-2xl border border-white/10">
                                <ShieldCheck className="w-5 h-5 text-primary" />
                                <span className="font-bold">Verified Only</span>
                            </div>
                            <div className="flex items-center gap-3 px-6 py-3 bg-white/10 rounded-2xl border border-white/10">
                                <Zap className="w-5 h-5 text-secondary" />
                                <span className="font-bold">Live Now</span>
                            </div>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                </div>
            </div>
        </div>
    );
}
