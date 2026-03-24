"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Search, SlidersHorizontal, Loader2, AlertCircle, ChevronDown } from "lucide-react";
import ProjectCard from "@/components/ProjectCard";
import { supabase } from "@/lib/supabase";

const CATEGORIES = ["All", "SaaS", "UI Kits", "Mobile", "AI/ML", "E-commerce", "DevOps"];

export default function ExplorePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedTech, setSelectedTech] = useState("All");
    const [minPrice, setMinPrice] = useState<string>("");
    const [maxPrice, setMaxPrice] = useState<string>("");
    const [sortBy, setSortBy] = useState("Newest");
    const [projects, setProjects] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadProjects() {
            try {
                setIsLoading(true);
                const { data, error: projectsError } = await (supabase
                    .from('Project')
                    .select('*, creator:User!creatorId(firstName, lastName)')
                    .eq('status', 'APPROVED')
                    .order('createdAt', { ascending: false }) as any);

                if (projectsError) throw projectsError;

                setProjects(data || []);
                setError(null);
            } catch (err: any) {
                console.error("Explore Marketplace failed to load projects:", err);
                
                // Detection for placeholder/missing config
                const isPlaceholder = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder') || 
                                     !process.env.NEXT_PUBLIC_SUPABASE_URL;
                
                if (isPlaceholder) {
                    setError("Configuration Missing: Please ensure NEXT_PUBLIC_SUPABASE_URL is set in your environment variables.");
                } else {
                    setError("Unable to load projects. Please check your connection or database permissions.");
                }
            } finally {
                setIsLoading(false);
            }
        }
        loadProjects();
    }, []);

    const filteredProjects = useMemo(() => {
        let result = projects;

        // Search
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(p =>
                p.title.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q)
            );
        }

        // Category
        if (selectedCategory !== "All") {
            result = result.filter(p => p.category === selectedCategory);
        }

        // Tech
        if (selectedTech !== "All") {
            result = result.filter(p => p.techStack && p.techStack.includes(selectedTech));
        }

        // Price Range
        if (minPrice) {
            const min = parseFloat(minPrice);
            if (!isNaN(min)) {
                result = result.filter(p => p.price >= min);
            }
        }
        if (maxPrice) {
            const max = parseFloat(maxPrice);
            if (!isNaN(max)) {
                result = result.filter(p => p.price <= max);
            }
        }

        // Sort
        return [...result].sort((a, b) => {
            if (sortBy === "Price: Low to High") return a.price - b.price;
            if (sortBy === "Price: High to Low") return b.price - a.price;
            if (sortBy === "Highest Rated") return b.rating - a.rating;
            return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        });
    }, [projects, searchQuery, selectedCategory, selectedTech, minPrice, maxPrice, sortBy]);

    return (
        <div className="min-h-screen bg-surface-alt pt-12 pb-20">
            <div className="max-w-[1360px] mx-auto px-6">
                {/* Header Section */}
                <div className="mb-12">
                    <h1 className="text-4xl font-black text-text-primary mb-4 animate-slide-up">
                        Elite Digital <span className="text-primary italic">Assets</span>
                    </h1>
                    <p className="text-text-secondary max-w-xl animate-slide-up delay-100">
                        Discover top-tier boilerplates, components, and full-stack solutions built by world-class creators.
                    </p>
                </div>

                {/* Filters Row */}
                <div className="flex flex-col lg:flex-row gap-4 mb-10">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full h-12 pl-11 pr-4 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-text-primary"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                placeholder="Min $"
                                className="w-24 h-12 px-4 rounded-xl border border-border bg-white text-sm font-bold text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                            />
                            <span className="text-text-muted font-bold">-</span>
                            <input
                                type="number"
                                placeholder="Max $"
                                className="w-24 h-12 px-4 rounded-xl border border-border bg-white text-sm font-bold text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                            />
                        </div>

                        <div className="relative group">
                            <select
                                className="appearance-none h-12 pl-4 pr-10 rounded-xl border border-border bg-white text-sm font-bold text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                                value={selectedTech}
                                onChange={(e) => setSelectedTech(e.target.value)}
                            >
                                <option value="All">All Tech</option>
                                <option value="Next.js">Next.js</option>
                                <option value="React">React</option>
                                <option value="TypeScript">TypeScript</option>
                                <option value="Python">Python</option>
                                <option value="Rust">Rust</option>
                                <option value="Ruby">Ruby</option>
                                <option value="Html">Html</option>
                                <option value="C">C</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                        </div>

                        <div className="relative group">
                            <select
                                className="appearance-none h-12 pl-4 pr-10 rounded-xl border border-border bg-white text-sm font-bold text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="Newest">Newest First</option>
                                <option value="Price: Low to High">Price: Low to High</option>
                                <option value="Price: High to Low">Price: High to Low</option>
                                <option value="Highest Rated">Highest Rated</option>
                            </select>
                            <SlidersHorizontal className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Category Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-6 mb-8 no-scrollbar">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-6 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${selectedCategory === cat
                                ? "bg-navy-dark text-white border-navy-dark"
                                : "bg-white text-text-secondary border-border hover:border-text-muted"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Results Section */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                        <Loader2 className="w-10 h-10 text-primary animate-spin" />
                        <p className="text-text-secondary font-medium italic">Scouring the marketplace...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mb-4">
                            <AlertCircle className="w-8 h-8 text-rose-500" />
                        </div>
                        <h3 className="text-xl font-bold text-text-primary mb-2">Connection Error</h3>
                        <p className="text-text-secondary max-md">{error}</p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-8">
                            <p className="text-sm text-text-secondary">
                                Showing <span className="font-bold text-text-primary">{filteredProjects.length}</span> results
                            </p>
                        </div>

                        {filteredProjects.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredProjects.map((project, i) => (
                                    <div key={project.id} className="animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                                        <ProjectCard {...project} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-32 border-2 border-dashed border-border rounded-[2.5rem] bg-white/50">
                                <p className="text-text-secondary font-medium">No products found matching your search criteria.</p>
                                <button
                                    onClick={() => { setSearchQuery(""); setSelectedCategory("All"); setSelectedTech("All"); setMinPrice(""); setMaxPrice(""); }}
                                    className="mt-4 text-primary font-bold hover:underline"
                                >
                                    Reset filters
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
