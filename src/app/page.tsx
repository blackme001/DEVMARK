'use client';

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
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-teal-50/30">
        <div className="absolute inset-0 overflow-[...]  
      {/* Stats Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-[1360px] mx-auto">
          {loading ? (
            <div className="flex justify-cen[...]  
      {/* Categories Section */}
      <section className="py-24 px-6 bg-surface-alt">
        <div className="max-w-[1360px] mx-auto">
          <div className="flex items-end justify-between [...] 
      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-[1360px] mx-auto">
          <div className="bg-navy-dark rounded-[4rem] p-16 md:p-24 text-center [...]