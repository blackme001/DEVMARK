"use client";

import React, { useState } from "react";
import { MessageSquare, FileText, Loader2, X, Send } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

interface MessageModalProps {
    isOpen: boolean;
    onClose: () => void;
    recipientId: string;
    recipientName: string;
    projectId?: string;
    projectTitle?: string;
    initialMode?: "message" | "quote";
}

export default function MessageModal({
    isOpen,
    onClose,
    recipientId,
    recipientName,
    projectId,
    projectTitle,
    initialMode = "message"
}: MessageModalProps) {
    const { user: currentUser, isAuthenticated } = useAuthStore();
    const [mode, setMode] = useState<"message" | "quote">(initialMode);
    const [content, setContent] = useState("");
    const [isSending, setIsSending] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!isAuthenticated) {
            toast.error("Please sign in to send messages.");
            return;
        }

        if (!content.trim()) return;

        try {
            setIsSending(true);
            
            const messageData: any = {
                senderId: currentUser?.id,
                receiverId: recipientId,
                content: content.trim(),
            };

            // Add context if provided (requires DB update as per plan)
            if (projectId) messageData.projectId = projectId;
            if (mode === "quote") messageData.isQuoteRequest = true;

            const { error } = await supabase.from('Message').insert(messageData);

            if (error) throw error;

            toast.success(mode === "quote" ? "Quote request sent!" : "Message sent successfully!");
            setContent("");
            onClose();
        } catch (err: any) {
            console.error("Messaging error:", err);
            toast.error(err.message || "Failed to deliver message.");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div 
                className="absolute inset-0 bg-navy-dark/60 backdrop-blur-sm animate-in fade-in duration-300" 
                onClick={onClose}
            ></div>
            
            <div className="bg-white rounded-[2.5rem] w-full max-w-xl transition-all shadow-2xl animate-in zoom-in-95 duration-200 relative z-10 overflow-hidden">
                {/* Header */}
                <div className="bg-surface-alt p-8 pb-6 border-b border-border flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-black text-navy-dark italic flex items-center gap-3">
                            {mode === "quote" ? <FileText className="text-primary" /> : <MessageSquare className="text-primary" />}
                            {mode === "quote" ? "Request Special Quote" : "Direct Channel"}
                        </h2>
                        <p className="text-slate-500 text-sm font-medium mt-1">
                            Conversation with <span className="text-navy-dark font-bold">{recipientName}</span>
                            {projectTitle && <span> regarding <span className="text-primary font-bold">{projectTitle}</span></span>}
                        </p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-white rounded-xl transition-colors text-slate-400"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex px-8 mt-6 gap-2">
                    <button 
                        onClick={() => setMode("message")}
                        className={`flex-1 h-12 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                            mode === "message" 
                            ? "bg-navy-dark text-white" 
                            : "bg-surface-alt text-slate-400 hover:text-navy-dark border border-border"
                        }`}
                    >
                        General Message
                    </button>
                    <button 
                        onClick={() => setMode("quote")}
                        className={`flex-1 h-12 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                            mode === "quote" 
                            ? "bg-primary text-white" 
                            : "bg-surface-alt text-slate-400 hover:text-primary border border-border"
                        }`}
                    >
                        Custom Quote
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-8 pt-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                            {mode === "quote" ? "Describe your requirements & budget" : "Your Message"}
                        </label>
                        <textarea
                            required
                            rows={5}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder={mode === "quote" 
                                ? "Hi! I love this project but need some custom modifications. My budget is... and I need... " 
                                : "Hi! I have a question about how this asset works... "}
                            className="w-full p-5 rounded-2xl border border-slate-100 bg-slate-50/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none text-navy-dark font-medium placeholder:text-slate-300 resize-none"
                        ></textarea>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <button
                            type="submit"
                            disabled={isSending}
                            className={`w-full h-14 rounded-2xl font-black text-lg shadow-xl transition-all flex items-center justify-center gap-3 ${
                                mode === "quote" 
                                ? "bg-primary text-white shadow-primary/20" 
                                : "bg-navy-dark text-white shadow-navy-dark/20"
                            } hover:scale-[1.02] disabled:opacity-50 disabled:scale-100`}
                        >
                            {isSending ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    {mode === "quote" ? "Submit Quote Request" : "Send Message"}
                                </>
                            )}
                        </button>
                    </div>

                    <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">
                        Secure communication protected by DevMark Protocol
                    </p>
                </form>
            </div>
        </div>
    );
}
