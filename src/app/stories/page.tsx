import React from "react";
import { Star, Trophy, Users, TrendingUp } from "lucide-react";

export default function SuccessStories() {
    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20">
            <div className="max-w-[1360px] mx-auto px-6">
                <div className="max-w-3xl mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
                        <Star className="w-3 h-3" />
                        Success Stories
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-navy-dark mb-6 leading-tight">
                        Real Stories from Real <span className="text-primary italic underline decoration-secondary/30">Creators</span>
                    </h1>
                    <p className="text-slate-600 text-lg leading-relaxed">
                        Discover how developers and designers are scaling their businesses and reaching thousands of clients on DevMarket Pro.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        {
                            name: "Alex Rivera",
                            role: "Full-Stack Developer",
                            story: "In my first month, I sold $5,000 worth of SaaS boilerplates. The automated delivery system makes licensing a breeze.",
                            stats: "50+ Sales",
                            icon: Trophy,
                        },
                        {
                            name: "Sarah Chen",
                            role: "UI/UX Designer",
                            story: "DevMarket Pro gave me the platform to turn my design system into a passive income stream. I've never been more productive.",
                            stats: "94% Satisfaction",
                            icon: Users,
                        },
                        {
                            name: "Marcus Thorne",
                            role: "Mobile App Specialist",
                            story: "The community and support here are top-notch. I've found high-ticket clients who appreciate quality craftsmanship.",
                            stats: "$15k+ Revenue",
                            icon: TrendingUp,
                        },
                    ].map((item, i) => (
                        <div key={i} className="bg-white rounded-3xl p-8 border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                                <item.icon className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-navy-dark mb-2">{item.name}</h3>
                            <p className="text-primary text-sm font-semibold mb-4">{item.role}</p>
                            <p className="text-slate-600 text-sm leading-relaxed mb-6 italic">"{item.story}"</p>
                            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Achievement</span>
                                <span className="text-sm font-black text-navy-dark">{item.stats}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
