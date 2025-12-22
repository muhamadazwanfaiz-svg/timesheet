"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { BarChart, TrendingUp, Search, Globe, Users, ArrowUp, Activity } from "lucide-react";

export function SeoAnimatedGraphic() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="relative w-full h-[500px] flex items-center justify-center p-8">
            {/* Background Grid */}
            <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 gap-4 opacity-[0.03] pointer-events-none">
                {Array.from({ length: 36 }).map((_, i) => (
                    <div key={i} className="border border-indigo-500 rounded-sm" />
                ))}
            </div>

            {/* Main Dashboard Card */}
            <div className="relative z-10 w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-slide-up-fade">
                {/* Header */}
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600">
                            <TrendingUp size={18} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">SEO Performance</span>
                            <span className="text-[10px] text-slate-400">Live Analytics</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </div>
                        <span className="text-[10px] font-medium text-green-600 dark:text-green-400">Active</span>
                    </div>
                </div>

                {/* Dashboard Content */}
                <div className="p-6 space-y-6">

                    {/* Top Row Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/30">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-slate-500 font-medium">Total Clicks</span>
                                <Users size={14} className="text-indigo-400" />
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">12.4k</span>
                                <span className="text-xs text-green-500 flex items-center font-medium">
                                    <ArrowUp size={10} className="mr-0.5" /> 18%
                                </span>
                            </div>
                            {/* Mini Chart Line */}
                            <div className="h-1 w-full bg-indigo-100 dark:bg-indigo-900/30 mt-3 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 w-2/3 animate-pulse-slow rounded-full" />
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-purple-50/50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800/30">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-slate-500 font-medium">Impressions</span>
                                <Globe size={14} className="text-purple-400" />
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">842k</span>
                                <span className="text-xs text-green-500 flex items-center font-medium">
                                    <ArrowUp size={10} className="mr-0.5" /> 24%
                                </span>
                            </div>
                            {/* Mini Chart Line */}
                            <div className="h-1 w-full bg-purple-100 dark:bg-purple-900/30 mt-3 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500 w-3/4 animate-pulse-slow delay-100 rounded-full" />
                            </div>
                        </div>
                    </div>

                    {/* Keyword Tracker */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300">Keyword Rankings</h4>
                            <Search size={12} className="text-slate-400" />
                        </div>
                        <div className="space-y-2">
                            {[
                                { term: "seo tutorial", rank: 1, move: 0 },
                                { term: "learn seo", rank: 3, move: 2 },
                                { term: "digital marketing", rank: 5, move: 1 }
                            ].map((k, i) => (
                                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:scale-[1.02] transition-transform cursor-default">
                                    <span className="text-sm text-slate-600 dark:text-slate-300 font-medium flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                                        {k.term}
                                    </span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-mono text-slate-400">#{k.rank}</span>
                                        {k.move > 0 && (
                                            <span className="text-[10px] text-green-500 flex items-center bg-green-50 dark:bg-green-900/20 px-1 py-0.5 rounded">
                                                <ArrowUp size={8} className="mr-0.5" /> {k.move}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chart Area Animation */}
                    <div className="relative h-24 w-full bg-slate-50 dark:bg-slate-800/30 rounded-lg border border-slate-100 dark:border-slate-800 flex items-end justify-between p-2 gap-1">
                        {[30, 45, 35, 60, 50, 75, 65, 80, 70, 90, 85, 100].map((h, i) => (
                            <div
                                key={i}
                                className="w-full bg-indigo-500/80 rounded-t-sm transition-all duration-1000 ease-in-out"
                                style={{ height: `${h}%`, opacity: 0.5 + (i / 24) }}
                            />
                        ))}
                        <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] text-slate-400">
                            <Activity size={10} />
                            <span>Live Data</span>
                        </div>
                    </div>

                </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-1/2 -right-4 bg-white dark:bg-slate-800 p-3 rounded-lg shadow-xl border border-slate-100 dark:border-slate-700 animate-float-delayed flex items-center gap-3 z-20">
                <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600">
                    <Search size={16} />
                </div>
                <div>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200">#1 Rankinng</p>
                    <p className="text-[10px] text-slate-400">Target Achieved</p>
                </div>
            </div>

            <div className="absolute -bottom-6 left-12 bg-white dark:bg-slate-800 p-3 rounded-lg shadow-xl border border-slate-100 dark:border-slate-700 animate-float flex items-center gap-3 z-0">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                    <BarChart size={16} />
                </div>
                <div>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Traffic Spike</p>
                    <p className="text-[10px] text-slate-400">+150% Growth</p>
                </div>
            </div>

        </div>
    );
}
