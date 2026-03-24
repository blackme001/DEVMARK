"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

interface ProjectGalleryProps {
    images: string[];
    title: string;
}

export default function ProjectGallery({ images, title }: ProjectGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);

    if (!images || images.length === 0) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 p-6 text-center rounded-2xl border border-slate-100 italic">
                <div className="w-20 h-20 bg-primary/20 rounded-3xl mb-6"></div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">Standard Asset Preview</h2>
                <p className="text-slate-500 font-medium">No preview images available for this project.</p>
            </div>
        );
    }

    const nextImage = () => setActiveIndex((prev) => (prev + 1) % images.length);
    const prevImage = () => setActiveIndex((prev) => (prev - 1 + images.length) % images.length);

    return (
        <div className="w-full space-y-4">
            {/* Main Image Container */}
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-slate-100 shadow-inner bg-slate-50 group">
                <img
                    src={images[activeIndex]}
                    alt={`${title} preview ${activeIndex + 1}`}
                    className={`w-full h-full object-cover transition-all duration-500 ${isZoomed ? 'scale-150 cursor-zoom-out' : 'scale-100 cursor-zoom-in'}`}
                    onClick={() => setIsZoomed(!isZoomed)}
                />

                {/* Navigation Arrows */}
                {images.length > 1 && (
                    <>
                        <button 
                            onClick={(e) => { e.stopPropagation(); prevImage(); }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur shadow-lg flex items-center justify-center text-navy-dark hover:bg-primary hover:text-white transition-all opacity-0 group-hover:opacity-100"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); nextImage(); }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur shadow-lg flex items-center justify-center text-navy-dark hover:bg-primary hover:text-white transition-all opacity-0 group-hover:opacity-100"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </>
                )}

                {/* Expand Toggle */}
                <button 
                    onClick={() => setIsZoomed(!isZoomed)}
                    className="absolute bottom-4 right-4 w-10 h-10 rounded-xl bg-navy-dark/80 backdrop-blur text-white flex items-center justify-center hover:bg-primary transition-all opacity-0 group-hover:opacity-100"
                >
                    <Maximize2 className="w-5 h-5" />
                </button>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                    {images.map((img, i) => (
                        <button
                            key={i}
                            onClick={() => { setActiveIndex(i); setIsZoomed(false); }}
                            className={`relative w-24 aspect-video rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                                activeIndex === i ? "border-primary shadow-lg shadow-primary/20 scale-105" : "border-transparent opacity-60 hover:opacity-100"
                            }`}
                        >
                            <img src={img} alt={`thumbnail ${i}`} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
