"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";

const MOCK_NEWS = [
    {
        title: "Google's Core Update: What You Need to Know",
        source: "Search Engine Land",
        time: "2h ago",
        image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800",
        snippet: "The latest core update targets low-quality content. Here's how to recover."
    },
    {
        title: "AI in SEO: The Future of Search",
        source: "Moz",
        time: "5h ago",
        image: "https://images.unsplash.com/photo-1485827404703-89f552507387?auto=format&fit=crop&q=80&w=800",
        snippet: "Artificial Intelligence is rewriting the rules of organic search visibility."
    },
    {
        title: "Technical SEO Checklist for 2025",
        source: "Ahrefs Blog",
        time: "1d ago",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
        snippet: "Ensure your site architecture is ready for the next generation of crawlers."
    },
    {
        title: "Understanding 'Hidden Gem' Ranking",
        source: "SEO Round Table",
        time: "1d ago",
        image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=800",
        snippet: "Google's new push to surface forum discussions and personal blogs explained."
    },
];

export function SEONewsWidget({ className }: { className?: string }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className={cn("w-full", className)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {MOCK_NEWS.map((news, i) => (
                    <div key={i} className="group flex flex-col bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer">
                        {/* Image Container */}
                        <div className="relative h-48 w-full overflow-hidden">
                            <img
                                src={news.image}
                                alt={news.title}
                                className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500 ease-out"
                            />
                            <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-950/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-700 shadow-sm">
                                {news.source}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 flex flex-col flex-1">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 leading-tight mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {news.title}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4 flex-1">
                                {news.snippet}
                            </p>
                            <div className="flex items-center justify-between text-xs text-slate-500 mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                                <span>{news.time}</span>
                                <span className="font-medium text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform inline-flex items-center">
                                    Read Article &rarr;
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
