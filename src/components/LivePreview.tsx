"use client";

import React, { useEffect, useRef } from "react";

interface LivePreviewProps {
    html?: string;
    url?: string;
    title?: string;
}

export default function LivePreview({ html, url, title }: LivePreviewProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        if (!url && html && iframeRef.current) {
            const doc = iframeRef.current.contentDocument;
            if (doc) {
                doc.open();
                doc.write(html);
                doc.close();
            }
        }
    }, [html, url]);

    return (
        <div className="w-full h-full relative group bg-slate-50">
            <div
                className="absolute inset-0 bg-slate-100 animate-pulse"
                style={{ zIndex: -1 }}
            />
            <iframe
                ref={iframeRef}
                src={url}
                title={title || "Project Preview"}
                className="w-full h-full border-none"
                sandbox="allow-scripts allow-same-origin allow-forms"
            />
            <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-navy/80 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                Sandboxed Preview
            </div>
        </div>
    );
}
