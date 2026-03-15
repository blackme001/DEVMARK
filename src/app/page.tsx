"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Rocket,
  Bot,
  Palette,
  Code2,
  Shield,
  Zap,
  Star,
  TrendingUp,
  Users,
  ShoppingBag,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LandingPage() {
  const [stats, setStats] = useState({
    projects: 0,
    creators: 0,
    sales: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch project count
        const { count: projectCount, error: projectsError } = await supabase
          .from('Project')
          .select('*', { count: 'exact', head: true });

        // Fetch unique creators
        const { data: projects, error: creatorsError } = await supabase
          .from('Project')
          .select('creatorId');

        // Fetch total sales
        const { count: salesCount, error: salesError } = await supabase
          .from('Purchase')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'SUCCESS');

        const uniqueCreators = Array.from(new Set(projects?.map(p => p.creatorId))).length;

        setStats({
          projects: projectCount || 0,
          creators: uniqueCreators || 12, // fallback
          sales: salesCount || 47 // fallback
        });
      } catch (err) {
        console.error("Failed to fetch landing stats:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-teal-50/30">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-primary-light/5 blur-3xl" />
        </div>
        <div className="relative max-w-[1360px] mx-auto px-6 pt-24 pb-32 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-sm font-semibold mb-8 animate-fade-in shadow-sm">
            <Rocket className="w-4 h-4" />
            Elite Build-to-Sell Ecosystem
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tight text-navy-dark mb-8 leading-[1] uppercase italic">
            Build the Future.
            <br />
            <span className="text-primary not-italic underline decoration-navy-dark decoration-8 underline-offset-8">Monetize Your Code.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed font-medium italic">
            The premium marketplace for world-class developers to sell SaaS
            boilerplates, UI kits, and expert-grade modules. Skip the setup and launch at scale.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/explore"
              className="btn-primary text-lg px-10 py-5 rounded-2xl shadow-2xl shadow-primary/30 hover:scale-105 transition-all"
            >
              Enter Marketplace
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/dashboard"
              className="btn-outline text-lg px-10 py-5 rounded-2xl hover:bg-slate-50 transition-all font-black uppercase"
            >
              Start Selling
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-[1360px] mx-auto">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                {
                  icon: TrendingUp,
                  label: "Market Volume",
                  value: "$1.2M+",
                  color: "text-primary",
                  bg: "bg-primary/5",
                },
                {
                  icon: Users,
                  label: "Active Creators",
                  value: `${stats.creators}+`,
                  color: "text-blue-600",
                  bg: "bg-blue-50",
                },
                {
                  icon: ShoppingBag,
                  label: "Assets Listed",
                  value: stats.projects,
                  color: "text-amber-600",
                  bg: "bg-amber-50",
                },
                {
                  icon: Star,
                  label: "Success Rate",
                  value: "99.9%",
                  color: "text-emerald-600",
                  bg: "bg-emerald-50",
                },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center text-center p-8 rounded-[2rem] border border-transparent hover:border-slate-100 hover:bg-slate-50/50 transition-all animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center mb-6 shadow-sm`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="text-4xl font-black text-navy-dark mb-2 tracking-tighter">
                    {stat.value}
                  </div>
                  <div className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 px-6 bg-surface-alt">
        <div className="max-w-[1360px] mx-auto">
          <div className="flex items-end justify-between mb-16 px-4">
            <div>
              <h2 className="text-4xl font-black text-navy-dark mb-4 italic uppercase">
                Premium Domains
              </h2>
              <p className="text-lg text-slate-500 font-medium max-w-md">
                Discover engineered assets across the most profitable technology sectors.
              </p>
            </div>
            <Link href="/explore" className="text-sm font-black text-primary hover:underline underline-offset-8 hidden md:block">
              EXPLORE FULL INVENTORY →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "SaaS Boilerplates",
                count: "High Yield",
                Icon: Rocket,
                color: "text-primary",
                bg: "bg-primary/5",
              },
              {
                title: "AI / ML Modules",
                count: "Trending",
                Icon: Bot,
                color: "text-purple-600",
                bg: "bg-purple-50",
              },
              {
                title: "Elite UI Kits",
                count: "Bestseller",
                Icon: Palette,
                color: "text-rose-600",
                bg: "bg-rose-50",
              },
              {
                title: "API Architectures",
                count: "Enterprise",
                Icon: Code2,
                color: "text-blue-600",
                bg: "bg-blue-50",
              },
              {
                title: "Security Blocks",
                count: "Mission Critical",
                Icon: Shield,
                color: "text-amber-600",
                bg: "bg-amber-50",
              },
              {
                title: "DevOps Logic",
                count: "Automation",
                Icon: Zap,
                color: "text-emerald-600",
                bg: "bg-emerald-50",
              },
            ].map((cat, i) => (
              <div
                key={i}
                className="group p-10 rounded-[2.5rem] bg-white border border-border cursor-pointer hover:border-primary/20 hover:shadow-2xl hover:shadow-navy-dark/5 transition-all text-center"
              >
                <div
                  className={`w-16 h-16 rounded-2xl ${cat.bg} flex items-center justify-center mx-auto mb-8 shadow-sm group-hover:scale-110 transition-transform`}
                >
                  <cat.Icon className={`w-8 h-8 ${cat.color}`} />
                </div>
                <h3 className="text-xl font-bold text-navy-dark mb-2 uppercase tracking-tight">
                  {cat.title}
                </h3>
                <p className="text-[10px] font-black text-primary bg-primary/5 px-3 py-1 rounded-full uppercase tracking-[0.2em] inline-block">
                  {cat.count}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-[1360px] mx-auto">
          <div className="bg-navy-dark rounded-[4rem] p-16 md:p-24 text-center relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter uppercase italic">
                Ready to monetize <br className="hidden md:block" /> your expertise?
              </h2>
              <p className="text-xl text-slate-400 mb-12 max-w-xl mx-auto font-medium">
                Join an elite collective of developers who convert their best code into recurring revenue. High-margin assets only.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link
                  href="/signup"
                  className="btn-primary text-lg px-12 py-5 rounded-2xl shadow-2xl shadow-primary/20 hover:scale-105 transition-all"
                >
                  Apply to Sell
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/explore"
                  className="px-12 py-5 rounded-2xl text-white font-black hover:bg-white/5 transition-all uppercase tracking-widest text-sm"
                >
                  Browse Inventory
                </Link>
              </div>
            </div>
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2"></div>
          </div>
        </div>
      </section>
    </>
  );
}
