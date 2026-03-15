"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Code2, Menu, X, ChevronDown, LogOut, User, LayoutDashboard, ShoppingBag } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const { user, isAuthenticated, logout } = useAuthStore();
    const router = useRouter();
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setUserMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        setUserMenuOpen(false);
        router.push("/");
    };

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-border">
            <div className="max-w-[1360px] mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                        <Code2 className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-bold text-text-primary">
                        DevMarket Pro
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text-secondary">
                    <Link href="/explore" className="hover:text-text-primary transition-colors">
                        Marketplace
                    </Link>
                    <Link href="/stories" className="hover:text-text-primary transition-colors">
                        Stories
                    </Link>
                    <Link href="/community" className="hover:text-text-primary transition-colors">
                        Community
                    </Link>
                </div>

                {/* Right side — user avatar or login */}
                <div className="hidden md:flex items-center gap-3">
                    {isAuthenticated && user ? (
                        <div className="relative" ref={menuRef}>
                            <div
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-surface-hover transition-colors cursor-pointer border border-transparent hover:border-border"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-xs font-bold uppercase">
                                    {(user?.firstName?.[0] || user?.email?.[0] || 'U')}
                                    {(user?.lastName?.[0] || '')}
                                </div>
                                <span className="text-sm font-medium text-text-primary">
                                    {user?.firstName || 'User'} {user?.lastName || ''}
                                </span>
                                <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                            </div>

                            {/* Dropdown Menu */}
                            {userMenuOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-border py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="px-4 py-3 border-b border-border mb-1">
                                        <p className="text-xs text-text-muted font-medium mb-0.5">Signed in as</p>
                                        <p className="text-sm font-bold text-text-primary truncate">{user.email}</p>
                                    </div>
                                    <Link
                                        href="/dashboard"
                                        onClick={() => setUserMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-primary hover:bg-surface-hover transition-colors"
                                    >
                                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                                    </Link>
                                    <Link
                                        href={`/profile/${user.id}`}
                                        onClick={() => setUserMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-primary hover:bg-surface-hover transition-colors"
                                    >
                                        <User className="w-4 h-4" /> My Profile
                                    </Link>
                                    <Link
                                        href="/dashboard/payments"
                                        onClick={() => setUserMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-primary hover:bg-surface-hover transition-colors"
                                    >
                                        <ShoppingBag className="w-4 h-4" /> My Purchases
                                    </Link>
                                    <Link
                                        href="/dashboard/payments"
                                        onClick={() => setUserMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:text-primary hover:bg-surface-hover transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-credit-card"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg> Payment Methods
                                    </Link>
                                    <div className="h-px bg-border my-1"></div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-50 transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" /> Log Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/auth" className="text-sm font-semibold text-text-secondary hover:text-text-primary px-4 py-2">
                                Sign In
                            </Link>
                            <Link href="/auth" className="btn-primary py-2 px-5 text-sm">
                                Create Account
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile toggle */}
                <button
                    className="md:hidden p-2"
                    onClick={() => setMobileOpen(!mobileOpen)}
                >
                    {mobileOpen ? (
                        <X className="w-5 h-5" />
                    ) : (
                        <Menu className="w-5 h-5" />
                    )}
                </button>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden border-t border-border bg-white px-6 py-4 space-y-3 animate-fade-in">
                    <Link href="/explore" className="block text-sm font-medium text-text-secondary py-2" onClick={() => setMobileOpen(false)}>
                        Marketplace
                    </Link>
                    <Link href="/stories" className="block text-sm font-medium text-text-secondary py-2" onClick={() => setMobileOpen(false)}>
                        Stories
                    </Link>
                    <Link href="/community" className="block text-sm font-medium text-text-secondary py-2" onClick={() => setMobileOpen(false)}>
                        Community
                    </Link>

                    <div className="pt-2 border-t border-border">
                        {isAuthenticated ? (
                            <div className="space-y-3 pt-2">
                                <Link href="/dashboard" className="block text-sm font-bold text-text-primary" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                                <button onClick={handleLogout} className="text-sm font-bold text-rose-500">Log Out</button>
                            </div>
                        ) : (
                            <Link href="/auth" className="btn-primary w-full justify-center" onClick={() => setMobileOpen(false)}>
                                Get Started
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
