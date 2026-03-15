import React from "react";
import { BookOpen, Video, FileText, Download, Code2, Rocket } from "lucide-react";

export default function Resources() {
    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20">
            <div className="max-w-[1360px] mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl font-black text-navy-dark mb-6">Creator <span className="text-primary">Resources</span></h1>
                    <p className="text-slate-600 text-lg">Everything you need to succeed as a high-end digital creator.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        { title: "Creator Handbook", desc: "A comprehensive guide to selling on DevMarket.", icon: BookOpen },
                        { title: "Video Tutorials", desc: "Step-by-step guides on uploading and managing products.", icon: Video },
                        { title: "Licensing 101", desc: "Understanding the different license types for your projects.", icon: FileText },
                        { title: "Design Assets", desc: "Download logos and banners for your profile.", icon: Download },
                        { title: "Coding Best Practices", desc: "How to structure your projects for maximum buyer satisfaction.", icon: Code2 },
                        { title: "Marketing Guide", desc: "Tips on how to promote your projects outside the platform.", icon: Rocket },
                    ].map((res, i) => (
                        <div key={i} className="bg-white rounded-3xl p-8 border border-slate-200 hover:border-primary/30 transition-all group">
                            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                                <res.icon className="w-7 h-7 text-slate-400 group-hover:text-primary transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold text-navy-dark mb-3">{res.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6">{res.desc}</p>
                            <button className="text-primary text-sm font-bold flex items-center gap-2 hover:gap-3 transition-all">
                                Learn More <span className="text-lg">→</span>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
