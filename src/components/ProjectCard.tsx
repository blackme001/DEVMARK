import React from "react";
import Link from "next/link";
import { Star, ExternalLink } from "lucide-react";

interface ProjectProps {
    id: string;
    title: string;
    description: string;
    price: number;
    techStack: string[];
    creator?: { firstName: string; lastName: string };
    image?: string;
    rating?: number;
    sales?: number;
}

export default function ProjectCard({ id, title, description, price, techStack, creator, rating }: ProjectProps) {
    if (!id) return null;
    return (
        <Link href={`/projects/${id}`} className="card group overflow-hidden">
            {/* Thumbnail */}
            <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <ExternalLink className="w-7 h-7 text-primary" />
                    </div>
                </div>
                <div className="absolute top-3 right-3">
                    <span className="badge badge-success text-[11px]">
                        ${price}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <h3 className="font-bold text-text-primary mb-1 group-hover:text-primary transition-colors line-clamp-1">
                    {title}
                </h3>
                <p className="text-sm text-text-secondary mb-3 line-clamp-2">
                    {description}
                </p>

                {/* Tech stack badges */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {(techStack || []).slice(0, 3).map((tech) => (
                        <span
                            key={tech}
                            className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-surface-alt text-text-secondary border border-border"
                        >
                            {tech}
                        </span>
                    ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-[10px] font-bold text-primary">
                                {(creator?.firstName?.[0] || 'A')}
                            </span>
                        </div>
                        <span className="text-xs text-text-secondary font-medium">
                            {creator ? `${creator.firstName} ${creator.lastName}` : "Verified Creator"}
                        </span>
                    </div>
                    {rating && (
                        <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            <span className="text-xs font-semibold text-text-secondary">
                                {rating}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}
