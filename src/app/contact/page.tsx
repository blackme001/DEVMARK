import React from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function Contact() {
    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20">
            <div className="max-w-[1360px] mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                    <div>
                        <h1 className="text-5xl font-black text-navy-dark mb-8 leading-tight">Get in <span className="text-primary italic">Touch</span></h1>
                        <p className="text-slate-600 text-xl mb-12 leading-relaxed">
                            Have questions about DevMarket Pro? Our team is here to help you scale your creator business.
                        </p>

                        <div className="space-y-8">
                            {[
                                { title: "Sales Inquiries", value: "sales@devmarket.pro", icon: Mail },
                                { title: "Technical Support", value: "support@devmarket.pro", icon: Phone },
                                { title: "Office Location", value: "Creativity Hub, Level 42, SF, CA", icon: MapPin },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-slate-100">
                                        <item.icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">{item.title}</h4>
                                        <p className="text-lg font-bold text-navy-dark">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-12 shadow-xl shadow-navy-dark/5 border border-slate-100">
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-navy-dark mb-2">First Name</label>
                                    <input type="text" className="w-full h-14 px-5 rounded-2xl border-2 border-slate-100 focus:border-primary focus:outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-navy-dark mb-2">Last Name</label>
                                    <input type="text" className="w-full h-14 px-5 rounded-2xl border-2 border-slate-100 focus:border-primary focus:outline-none transition-all" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-navy-dark mb-2">Email Address</label>
                                <input type="email" className="w-full h-14 px-5 rounded-2xl border-2 border-slate-100 focus:border-primary focus:outline-none transition-all" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-navy-dark mb-2">Message</label>
                                <textarea className="w-full h-40 p-5 rounded-2xl border-2 border-slate-100 focus:border-primary focus:outline-none transition-all resize-none"></textarea>
                            </div>
                            <button className="w-full h-16 bg-primary text-white font-black text-lg rounded-2xl hover:bg-primary-dark shadow-lg shadow-primary/20 flex items-center justify-center gap-3 transition-all">
                                Send Message <Send className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
