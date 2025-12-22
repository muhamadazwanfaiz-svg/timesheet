"use client";

import Link from "next/link";
import { User, Mail, Calendar, ArrowRight, Zap, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface Slot {
    id: string;
    startTime: Date;
    status: string;
}

interface Student {
    id: string;
    name: string;
    email: string;
    module: string | null;
    seoLevel: string | null;
    goals: string | null;
    credits: number;
    slots: Slot[];
}

interface StudentCardProps {
    student: Student;
}

export function StudentCard({ student }: StudentCardProps) {
    const completedSessions = student.slots.filter(s => s.status === "COMPLETED").length;

    // Determine color for credits based on health
    const creditColor = student.credits > 3 ? "text-emerald-600" : student.credits > 0 ? "text-amber-600" : "text-red-600";
    const creditBg = student.credits > 3 ? "bg-emerald-50" : student.credits > 0 ? "bg-amber-50" : "bg-red-50";

    return (
        <Card className="overflow-hidden border-slate-200 dark:border-slate-800 hover:shadow-md transition-all duration-200 group flex flex-col h-full">
            <CardContent className="p-5 flex flex-col gap-4 h-full">

                {/* 1. Identity Header (Left Aligned for better use of 2-col width) */}
                <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full bg-indigo-50 flex-shrink-0 flex items-center justify-center text-xl font-bold text-indigo-600 border border-indigo-100">
                        {student.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                        <Link href={`/admin/students/${student.id}`} className="block">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 truncate hover:text-indigo-600 transition-colors">
                                {student.name}
                            </h3>
                        </Link>
                        <div className="text-sm text-slate-500 truncate flex items-center gap-1.5">
                            {student.email}
                        </div>

                        {/* Modules/Badges inline with identity or just below */}
                        <div className="flex flex-wrap gap-2 mt-2">
                            {student.seoLevel && (
                                <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 h-5 px-1.5 text-[10px] font-semibold tracking-wide border-indigo-100">
                                    {student.seoLevel.toUpperCase()}
                                </Badge>
                            )}
                            {student.module && (
                                <Badge variant="outline" className="text-slate-500 h-5 px-1.5 text-[10px] border-slate-200 bg-slate-50/50">
                                    {student.module.length > 25 ? student.module.substring(0, 25) + '...' : student.module}
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>

                {/* Spacer to push Stats to bottom if needed, but here we just stack */}
                <div className="flex-1"></div>

                {/* 2. Stats Row (Compact) */}
                <div className="flex items-center gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div>
                        <div className={`text-2xl font-bold ${creditColor} tabular-nums leading-none`}>
                            {student.credits}
                        </div>
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mt-1">
                            Credits
                        </div>
                    </div>
                    <div className="w-px h-8 bg-slate-100 dark:bg-slate-800"></div>
                    <div>
                        <div className="text-2xl font-bold text-slate-700 dark:text-slate-300 tabular-nums leading-none">
                            {completedSessions}
                        </div>
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mt-1">
                            Sessions
                        </div>
                    </div>
                </div>
            </CardContent>

            {/* 3. Action Footer (Compact) */}
            <CardFooter className="bg-slate-50/80 dark:bg-slate-900/50 p-2.5 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-500 hover:text-indigo-600 hover:bg-white text-xs h-8 px-2"
                    asChild
                >
                    <Link href={`/admin/students/${student.id}?tab=sessions`}>
                        <Calendar className="mr-1.5 h-3.5 w-3.5" />
                        Log Session
                    </Link>
                </Button>

                <Button size="sm" className="bg-white hover:bg-indigo-50 text-indigo-600 border border-slate-200 shadow-sm text-xs h-8 px-3 ml-auto hover:border-indigo-200 transition-all font-medium" asChild>
                    <Link href={`/admin/students/${student.id}`}>
                        View Profile
                        <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
