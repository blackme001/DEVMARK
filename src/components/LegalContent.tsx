import React from "react";

export default function GeneralContentPage({ title }: { title: string }) {
    return (
        <div className="min-h-screen bg-white pt-32 pb-20">
            <div className="max-w-[800px] mx-auto px-6">
                <h1 className="text-4xl font-black text-navy-dark mb-10">{title}</h1>
                <div className="prose prose-slate max-w-none">
                    <p className="text-slate-500 text-sm mb-6 italic text-left">Last updated: June 15, 2025</p>

                    <h3 className="text-xl font-bold text-navy-dark mt-8 mb-4 text-left">1. Introduction</h3>
                    <p className="text-slate-600 leading-relaxed mb-6 text-left">
                        Welcome to DevMarket Pro. These policies govern your use of our marketplace and services.
                        By accessing our platform, you agree to comply with all terms stated herein.
                    </p>

                    <h3 className="text-xl font-bold text-navy-dark mt-8 mb-4 text-left">2. Core Principles</h3>
                    <p className="text-slate-600 leading-relaxed mb-6 text-left">
                        We prioritize quality, transparency, and the protection of intellectual property.
                        Creators own their work, while buyers receive specific usage licenses upon purchase.
                    </p>

                    <h3 className="text-xl font-bold text-navy-dark mt-8 mb-4 text-left">3. Security & Privacy</h3>
                    <p className="text-slate-600 leading-relaxed mb-6 text-left">
                        We use industry-standard encryption to protect your data. Your privacy is our priority,
                        and we never sell your personal information to third parties.
                    </p>

                    <div className="mt-12 p-8 bg-slate-50 rounded-3xl border border-slate-100">
                        <p className="text-sm text-slate-500 mb-0">
                            This is a placeholder for the full legal text. In a production environment,
                            this would be replaced with verified legal documentation tailored to your jurisdiction.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
