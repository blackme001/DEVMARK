import React from "react";

interface LegalContentProps {
    title: string;
    lastUpdated?: string;
    children: React.ReactNode;
}

export default function LegalContent({ title, lastUpdated = "March 16, 2026", children }: LegalContentProps) {
    return (
        <div className="min-h-screen bg-white pt-32 pb-20">
            <div className="max-w-[800px] mx-auto px-6">
                <header className="mb-12 border-b border-slate-100 pb-8">
                    <h1 className="text-4xl md:text-5xl font-black text-navy-dark mb-4 tracking-tight uppercase italic">{title}</h1>
                    <p className="text-primary text-xs font-black uppercase tracking-[0.3em]">
                        Last Revised: {lastUpdated}
                    </p>
                </header>
                <div className="prose prose-slate prose-lg max-w-none text-slate-600 font-medium">
                    {children}
                </div>
            </div>
        </div>
    );
}
