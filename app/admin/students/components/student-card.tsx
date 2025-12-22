"use client";

import Link from "next/link";
import { User, Mail, Calendar, ArrowRight, Zap, Target, Clock, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AddCreditDialog } from "./add-credit-dialog";
import { BackfillDialog } from "./backfill-dialog";
import { ScheduleSessionDialog } from "./schedule-session-dialog";
import { format } from "date-fns";

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

    // Find next session
    const nextSession = student.slots
        .filter(s => s.status === "SCHEDULED" && new Date(s.startTime) > new Date())
        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())[0];

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
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/50">
                    <div className="text-center">
                        <div className={`text-2xl font-black ${creditColor} tabular-nums leading-none tracking-tight drop-shadow-sm`}>
                            {student.credits}
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">
                            Credits
                        </div>
                    </div>
                    <div className="w-px h-8 bg-slate-200 dark:bg-slate-700"></div>
                    <div className="text-center">
                        <div className="text-2xl font-black text-slate-700 dark:text-slate-300 tabular-nums leading-none tracking-tight">
                            {completedSessions}
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">
                            Sessions
                        </div>
                    </div>
                </div>

                {/* Dedicated Event Strip */}
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-white dark:bg-slate-900 text-indigo-600 shadow-sm border border-indigo-50 dark:border-slate-800">
                                <Clock size={16} />
                            </div>
                            <div>
                                <div className="text-xs font-semibold text-indigo-900 dark:text-indigo-100 uppercase tracking-wide opacity-70 mb-0.5">
                                    Next Session
                                </div>
                                <div className="text-sm font-bold text-slate-700 dark:text-slate-200">
                                    {nextSession ? (
                                        <>
                                            {format(nextSession.startTime, "MMM d")}
                                            <span className="mx-1.5 opacity-40">|</span>
                                            {format(nextSession.startTime, "h:mm a")}
                                        </>
                                    ) : (
                                        <span className="text-slate-400 italic font-normal">No upcoming class</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <ScheduleSessionDialog
                            studentId={student.id}
                            trigger={
                                <Button size="icon" className="h-8 w-8 rounded-full bg-white dark:bg-slate-900 text-indigo-600 border border-indigo-100 dark:border-slate-800 hover:bg-indigo-50 shadow-sm transition-all">
                                    <Plus size={16} />
                                </Button>
                            }
                        />
                    </div>
                </div>
            </CardContent>

            {/* 3. Action Footer - 3 Cols (Add, Backlog, Profile) */}
            <CardFooter className="bg-white dark:bg-slate-950 p-0 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 divide-x divide-slate-100 dark:divide-slate-800">

                <AddCreditDialog studentId={student.id} studentName={student.name} />

                <BackfillDialog studentId={student.id} studentName={student.name} />

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
        </Card >
    );
}
