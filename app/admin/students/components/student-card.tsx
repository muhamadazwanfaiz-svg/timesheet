"use client";

import Link from "next/link";
import { User, Mail, Calendar, ArrowRight, Zap, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AddCreditDialog } from "./add-credit-dialog";
import { BackfillDialog } from "./backfill-dialog";

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

    // Deterministic emoji based on student ID to ensure it stays the same for the student
    const getFunAvatar = (id: string) => {
        const emojis = ["🦊", "🐼", "🦄", "🦁", "🐧", "🐸", "🐙", "🍄", "🚀", "🎨", "🎸", "⚡️", "🥑", "🍩", "🤖", "👻", "🐱", "🐶", "🦋", "🦖"];
        // Simple hash of the ID string
        let hash = 0;
        for (let i = 0; i < id.length; i++) {
            hash = id.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash) % emojis.length;
        return emojis[index];
    };

    // Determine color for credits based on health
    const creditColor = student.credits > 3 ? "text-emerald-600" : student.credits > 0 ? "text-amber-600" : "text-red-600";
    const creditBg = student.credits > 3 ? "bg-emerald-50" : student.credits > 0 ? "bg-amber-50" : "bg-red-50";

    return (
        <Card className="overflow-hidden border-slate-200 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-950 dark:to-slate-900/50">
            {/* Lively Top Accent */}
            <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-80"></div>

            <CardContent className="p-5 flex flex-col gap-4 h-full relative">

                {/* 1. Identity Header */}
                <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full bg-white flex-shrink-0 flex items-center justify-center text-3xl shadow-sm border-2 border-slate-100 hover:scale-110 transition-transform cursor-default select-none animate-in fade-in zoom-in duration-500">
                        {getFunAvatar(student.id)}
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

                        {/* Modules/Badges */}
                        <div className="flex flex-wrap gap-2 mt-2">
                            {student.seoLevel && (
                                <Badge variant="secondary" className="bg-indigo-100/50 text-indigo-700 h-5 px-2 text-[10px] font-bold tracking-wide border border-indigo-100 shadow-sm">
                                    {student.seoLevel.toUpperCase()}
                                </Badge>
                            )}
                            {student.module && (
                                <Badge variant="outline" className="text-slate-600 h-5 px-2 text-[10px] border-slate-200 bg-white shadow-sm">
                                    {student.module.length > 20 ? student.module.substring(0, 20) + '...' : student.module}
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex-1"></div>

                {/* 2. Stats Row - Cleaner & Bolder */}
                <div className="flex items-center gap-6 pt-4 border-t border-slate-100 dark:border-slate-800/50">
                    <div>
                        <div className={`text-2xl font-black ${creditColor} tabular-nums leading-none tracking-tight drop-shadow-sm`}>
                            {student.credits}
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">
                            Credits
                        </div>
                    </div>
                    <div className="w-px h-8 bg-slate-200 dark:bg-slate-700"></div>
                    <div>
                        <div className="text-2xl font-black text-slate-700 dark:text-slate-300 tabular-nums leading-none tracking-tight">
                            {completedSessions}
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">
                            Sessions
                        </div>
                    </div>
                </div>
            </CardContent>

            {/* 3. Action Footer - 4 Cols for Backlog */}
            <CardFooter className="bg-white dark:bg-slate-950 p-0 border-t border-slate-100 dark:border-slate-800 grid grid-cols-4 divide-x divide-slate-100 dark:divide-slate-800">

                <AddCreditDialog studentId={student.id} studentName={student.name} />

                <BackfillDialog studentId={student.id} studentName={student.name} />

                <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-600 hover:text-indigo-600 hover:bg-slate-50 text-xs h-10 rounded-none font-medium"
                    asChild
                >
                    <Link href={`/admin/students/${student.id}?tab=sessions`}>
                        <Calendar className="mr-1.5 h-3.5 w-3.5" />
                        Log
                    </Link>
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-600 hover:text-indigo-600 hover:bg-slate-50 text-xs h-10 rounded-none font-medium"
                    asChild
                >
                    <Link href={`/admin/students/${student.id}`}>
                        Profile
                        <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
