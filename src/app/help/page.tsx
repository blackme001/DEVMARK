import React from "react";
import { Search, HelpCircle, Mail, MessageCircle, FileQuestion, LifeBuoy } from "lucide-react";

export default function HelpCenter() {
    return (
        <div className="min-h-screen bg-white">
            <div className="bg-slate-50 pt-32 pb-24 border-b border-slate-200">
                <div className="max-w-[1360px] mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-5xl font-black text-navy-dark mb-8">How can we <span className="text-primary underline decoration-secondary/30">help?</span></h1>
                    <div className="max-w-2xl mx-auto relative">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search help articles, guides, and tips..."
                            className="w-full h-16 pl-14 pr-6 rounded-2xl border-2 border-slate-200 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-lg shadow-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-[1360px] mx-auto px-6 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    {[
                        { title: "Getting Started", icon: HelpCircle, count: "12 articles" },
                        { title: "Selling & Payouts", icon: LifeBuoy, count: "8 articles" },
                        { title: "Buying & Licenses", icon: HelpCircle, count: "10 articles" },
                        { title: "Account & Security", icon: HelpCircle, count: "6 articles" },
                        { title: "Technical Support", icon: HelpCircle, count: "15 articles" },
                        { title: "Community Rules", icon: HelpCircle, count: "4 articles" },
                    ].map((cat, i) => (
                        <div key={i} className="group p-8 rounded-3xl border border-slate-200 hover:border-primary hover:shadow-xl hover:shadow-primary/5 transition-all">
                            <cat.icon className="w-10 h-10 text-slate-300 group-hover:text-primary mb-6 transition-colors" />
                            <h3 className="text-xl font-bold text-navy-dark mb-2">{cat.title}</h3>
                            <p className="text-slate-400 text-sm font-semibold">{cat.count}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex items-center gap-8 p-10 rounded-[2.5rem] bg-navy-dark text-white">
                        <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center shrink-0">
                            <Mail className="w-10 h-10" />
                        </div>
                        <div>
                            <h4 className="text-2xl font-bold mb-2">Email Support</h4>
                            <p className="text-slate-400 mb-6">Response time: &lt; 24 hours</p>
                            <button className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all">Send Message</button>
                        </div>
                    </div>
                    <div className="flex items-center gap-8 p-10 rounded-[2.5rem] border-2 border-slate-100">
                        <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center shrink-0">
                            <MessageCircle className="w-10 h-10 text-primary" />
                        </div>
                        <div>
                            <h4 className="text-2xl font-bold text-navy-dark mb-2">Live Chat</h4>
                            <p className="text-slate-400 mb-6">Available Mon-Fri, 9am - 5pm EST</p>
                            <button className="px-8 py-3 border-2 border-slate-200 text-navy-dark font-bold rounded-xl hover:bg-slate-50 transition-all">Start Chat</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
