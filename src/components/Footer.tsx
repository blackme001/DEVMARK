import React from "react";
import Link from "next/link";
import { Code2, Twitter, Github, Linkedin } from "lucide-react";

const footerLinks = {
    Products: [
        { label: "Web Development", href: "/explore?cat=web" },
        { label: "Mobile Apps", href: "/explore?cat=mobile" },
        { label: "Design Systems", href: "/explore?cat=design" },
        { label: "E-commerce", href: "/explore?cat=ecommerce" },
        { label: "SaaS Dashboards", href: "/explore?cat=saas" },
    ],
    "For Creators": [
        { label: "Creator Dashboard", href: "/dashboard" },
        { label: "Pricing Plans", href: "/pricing" },
        { label: "Success Stories", href: "/stories" },
        { label: "Resources", href: "/resources" },
        { label: "Community", href: "/community" },
    ],
    Support: [
        { label: "Help Center", href: "/help" },
        { label: "Contact Us", href: "/contact" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Security", href: "/security" },
    ],
};

export default function Footer() {
    return (
        <footer className="bg-navy-dark text-white">
            <div className="max-w-[1360px] mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                                <Code2 className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-lg font-bold">DevMarket Pro</span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-xs mb-6">
                            The premium marketplace for digital craftsmanship where creators
                            and clients build lasting relationships.
                        </p>
                        <div className="flex items-center gap-3">
                            <a
                                href="#"
                                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                            >
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a
                                href="#"
                                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                            >
                                <Github className="w-4 h-4" />
                            </a>
                            <a
                                href="#"
                                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                            >
                                <Linkedin className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Link Columns */}
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title}>
                            <h4 className="font-semibold text-sm mb-5">{title}</h4>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-slate-400 text-sm hover:text-white transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10">
                <div className="max-w-[1360px] mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-slate-500 text-sm">
                        © 2025 DevMarket Pro. All rights reserved. Built with{" "}
                        <span className="text-red-400">❤</span> for the creator economy.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link href="/terms" className="text-xs text-slate-500 hover:text-white transition-colors">Terms</Link>
                        <Link href="/privacy" className="text-xs text-slate-500 hover:text-white transition-colors">Privacy</Link>
                        <Link href="/security" className="text-xs text-slate-500 hover:text-white transition-colors">Security</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
