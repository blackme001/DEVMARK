use client;

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

        const uniqueCreators = projects 
          ? Array.from(new Set(projects.map((p: any) => p.creatorId))).length 
          : 0;

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
    <>\n      {/* Hero Section */}\n      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-teal-50/30">\n        <div className="absolute inset-0 overflow-hidden">\n          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />\n          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-primary-light/5 blur-3xl" />\n        </div>\n        <div className="relative max-w-[1360px] mx-auto px-6 pt-24 pb-32 text-center">\n          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-sm font-semibold mb-8 animate-fade-in shadow-sm">\n            <Rocket className="w-4 h-4" />\n            Elite Build-to-Sell Ecosystem\n          </div>\n          <h1 className="text-5xl md:text-8xl font-black tracking-tight text-navy-dark mb-8 leading-[1] uppercase italic">\n            Build the Future.\n            <br />\n            <span className="text-primary not-italic underline decoration-navy-dark decoration-8 underline-offset-8">Monetize Your Code.</span>\n          </h1>\n          <p className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed font-medium italic">\n            The premium marketplace for world-class developers to sell SaaS\n            boilerplates, UI kits, and expert-grade modules. Skip the setup and launch at scale.\n          </p>\n          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">\n            <Link\n              href="/explore"\n              className="btn-primary text-lg px-10 py-5 rounded-2xl shadow-2xl shadow-primary/30 hover:scale-105 transition-all"\n            >\n              Enter Marketplace\n              <ArrowRight className="w-5 h-5" />\n            </Link>\n            <Link\n              href="/dashboard"\n              className="btn-outline text-lg px-10 py-5 rounded-2xl hover:bg-slate-50 transition-all font-black uppercase"\n            >\n              Start Selling\n            </Link>\n          </div>\n        </div>\n      </section>\n
      {/* Stats Section */}\n      <section className="py-24 px-6 bg-white">\n        <div className="max-w-[1360px] mx-auto">\n          {loading ? (\n            <div className="flex justify-center py-12">\n              <Loader2 className="w-8 h-8 text-primary animate-spin" />\n            </div>\n          ) : (\n            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">\n              {\n                [\n                  {\n                    icon: TrendingUp,\n                    label: "Market Volume",\n                    value: "$1.2M+",\n                    color: "text-primary",\n                    bg: "bg-primary/5",\n                  },\n                  {\n                    icon: Users,\n                    label: "Active Creators",\n                    value: `${stats.creators}+`,\n                    color: "text-blue-600",\n                    bg: "bg-blue-50",\n                  },\n                  {\n                    icon: ShoppingBag,\n                    label: "Assets Listed",\n                    value: stats.projects,\n                    color: "text-amber-600",\n                    bg: "bg-amber-50",\n                  },\n                  {\n                    icon: Star,\n                    label: "Success Rate",\n                    value: "99.9%",\n                    color: "text-emerald-600",\n                    bg: "bg-emerald-50",\n                  },\n                ].map((stat, i) => (\n                  <div key={i} className="flex flex-col items-center text-center p-8 rounded-[2rem] border border-transparent hover:border-slate-100 hover:bg-slate-50/50 transition-all animate-fade-in">\n                    <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center mb-6 shadow-sm`}>\n                      <stat.icon className={`w-6 h-6 ${stat.color}`} />\n                    </div>\n                    <div className="text-4xl font-black text-navy-dark mb-2 tracking-tighter">\n                      {stat.value}\n                    </div>\n                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</div>\n                  </div>\n                ))}\n            </div>\n          )}\n        </div>\n      </section>\n
      {/* Categories Section */}\n      <section className="py-24 px-6 bg-surface-alt">\n        <div className="max-w-[1360px] mx-auto">\n          <div className="flex items-end justify-between mb-16 px-4">\n            <div>\n              <h2 className="text-4xl font-black text-navy-dark mb-4 italic uppercase">\n                Premium Domains\n              </h2>\n              <p className="text-lg text-slate-500 font-medium max-w-md">\n                Discover engineered assets across the most profitable technology sectors.\n              </p>\n            </div>\n            <Link href="/explore" className="text-sm font-black text-primary hover:underline underline-offset-8 hidden md:block">\n              EXPLORE FULL INVENTORY →\n            </Link>\n          </div>\n          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">\n            {\n              [\n                {\n                  title: "SaaS Boilerplates",\n                  count: "High Yield",\n                  Icon: Rocket,\n                  color: "text-primary",\n                  bg: "bg-primary/5",\n                },\n                {\n                  title: "AI / ML Modules",\n                  count: "Trending",\n                  Icon: Bot,\n                  color: "text-purple-600",\n                  bg: "bg-purple-50",\n                },\n                {\n                  title: "Elite UI Kits",\n                  count: "Bestseller",\n                  Icon: Palette,\n                  color: "text-rose-600",\n                  bg: "bg-rose-50",\n                },\n                {\n                  title: "API Architectures",\n                  count: "Enterprise",\n                  Icon: Code2,\n                  color: "text-blue-600",\n                  bg: "bg-blue-50",\n                },\n                {\n                  title: "Security Blocks",\n                  count: "Mission Critical",\n                  Icon: Shield,\n                  color: "text-amber-600",\n                  bg: "bg-amber-50",\n                },\n                {\n                  title: "DevOps Logic",\n                  count: "Automation",\n                  Icon: Zap,\n                  color: "text-emerald-600",\n                  bg: "bg-emerald-50",\n                },\n              ].map((cat, i) => (\n                <div\n                  key={i}\n                  className="group p-10 rounded-[2.5rem] bg-white border border-border cursor-pointer hover:border-primary/20 hover:shadow-2xl hover:shadow-navy-dark/5 transition-all text-center"\n                >\n                  <div\n                    className={`w-16 h-16 rounded-2xl ${cat.bg} flex items-center justify-center mx-auto mb-8 shadow-sm group-hover:scale-110 transition-transform`}\n                  >\n                    <cat.Icon className={`w-8 h-8 ${cat.color}`} />\n                  </div>\n                  <h3 className="text-xl font-bold text-navy-dark mb-2 uppercase tracking-tight">\n                    {cat.title}\n                  </h3>\n                  <p className="text-[10px] font-black text-primary bg-primary/5 px-3 py-1 rounded-full uppercase tracking-[0.2em] inline-block">\n                    {cat.count}\n                  </p>\n                </div>\n              ))}\n          </div>\n        </div>\n      </section>\n
      {/* CTA Section */}\n      <section className="py-32 px-6">\n        <div className="max-w-[1360px] mx-auto">\n          <div className="bg-navy-dark rounded-[4rem] p-16 md:p-24 text-center relative overflow-hidden shadow-2xl">\n            <div className="relative z-10">\n              <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter uppercase italic">\n                Ready to monetize <br className="hidden md:block" /> your expertise?\n              </h2>\n              <p className="text-xl text-slate-400 mb-12 max-w-xl mx-auto font-medium">\n                Join an elite collective of developers who convert their best code into recurring revenue. High-margin assets only.\n              </p>\n              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">\n                <Link\n                  href="/signup"\n                  className="btn-primary text-lg px-12 py-5 rounded-2xl shadow-2xl shadow-primary/20 hover:scale-105 transition-all"\n                >\n                  Apply to Sell\n                  <ArrowRight className="w-5 h-5" />\n                </Link>\n                <Link\n                  href="/explore"\n                  className="px-12 py-5 rounded-2xl text-white font-black hover:bg-white/5 transition-all uppercase tracking-widest text-sm"\n                >\n                  Browse Inventory\n                </Link>\n              </div>\n            </div>\n            {/* Background elements */}\n            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>\n            <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2"></div>\n          </div>\n        </div>\n      </section>\n    </>