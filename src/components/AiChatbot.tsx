"use client";

import React, { useState } from "react";
import { MessageSquare, X, Send, Sparkles, User, Bot, HelpCircle } from "lucide-react";

export default function AiChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "bot", content: "Hi! I'm your DevMarket Guide. How can I help you today? Whether you're buying assets or listing your own, I'm here to assist!" }
    ]);
    const [input, setInput] = useState("");

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { role: "user", content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");

        // Simulated bot response
        setTimeout(() => {
            const botMsg = { role: "bot", content: "I'm currently in 'Guidance Mode'. I can help you understand how to purchase assets, how to set up your creator profile, or explain our quality standards. What would you like to know more about?" };
            setMessages(prev => [...prev, botMsg]);
        }, 1000);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100]">
            {/* Bubble */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-14 h-14 rounded-full bg-primary text-white shadow-2xl shadow-primary/40 flex items-center justify-center hover:scale-110 transition-all group relative"
                >
                    <Sparkles className="w-6 h-6 animate-pulse" />
                    <div className="absolute -top-12 right-0 bg-navy-dark text-white text-[10px] font-bold px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Need help? Chat with AI
                    </div>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="w-[380px] h-[520px] bg-white rounded-[2rem] shadow-2xl border border-border flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 fade-in duration-300">
                    {/* Header */}
                    <div className="p-6 bg-navy-dark text-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                                <Bot className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black italic tracking-tight">Platform Guide</h3>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] text-white/60 font-bold uppercase tracking-widest">AI Agent Online</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-surface-alt">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-4 rounded-2xl text-xs leading-relaxed ${m.role === 'user'
                                        ? 'bg-primary text-white font-medium rounded-tr-none shadow-lg shadow-primary/10'
                                        : 'bg-white text-text-primary border border-border rounded-tl-none shadow-sm'
                                    }`}>
                                    {m.content}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pre-defined Questions */}
                    <div className="px-6 py-3 bg-white border-t border-border overflow-x-auto whitespace-nowrap no-scrollbar flex gap-2">
                        {["How to buy?", "Seller fees?", "Refund policy?"].map(q => (
                            <button
                                key={q}
                                onClick={() => setInput(q)}
                                className="px-3 py-1.5 rounded-lg bg-surface-alt border border-border text-[10px] font-bold text-text-secondary hover:border-primary hover:text-primary transition-all"
                            >
                                {q}
                            </button>
                        ))}
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSend} className="p-4 bg-white border-t border-border flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask me anything about DevMarket..."
                            className="flex-1 h-11 px-4 bg-surface-alt border border-border rounded-xl text-xs focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                        <button type="submit" className="w-11 h-11 rounded-xl bg-navy-dark text-white flex items-center justify-center hover:bg-primary transition-colors shadow-lg">
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
