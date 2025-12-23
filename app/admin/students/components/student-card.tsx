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
    endTime: Date;
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
    _count?: {
        slots: number;
    };
}

interface StudentCardProps {
    student: Student;
}

export function StudentCard({ student }: StudentCardProps) {
    // Optimized: Use DB _count if available, fallback to length (safeguard)
    const completedSessions = student._count?.slots ?? 0;

    // Optimized: DB already filtered to upcoming, so just use them
    const upcomingSessions = student.slots;

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

    return (
        <Card className="overflow-hidden border-slate-200 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-950 dark:to-slate-900/50">
            {/* Lively Top Accent */}
            <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-80"></div>

            <CardContent className="p-4 flex flex-col gap-3 h-full relative">

                {/* 1. Identity Header (Compact) */}
                <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-white flex-shrink-0 flex items-center justify-center text-2xl shadow-sm border-2 border-slate-100 hover:scale-110 transition-transform cursor-default select-none animate-in fade-in zoom-in duration-500">
                        {getFunAvatar(student.id)}
                    </div>
                    <div className="min-w-0">
                        <Link href={`/admin/students/${student.id}`} className="block">
                            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate hover:text-indigo-600 transition-colors leading-tight">
                                {student.name}
                            </h3>
                        </Link>
                        <div className="text-xs text-slate-500 truncate flex items-center gap-1.5">
                            {student.email}
                        </div>

                        {/* Modules/Badges */}
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {student.seoLevel && (
                                <Badge variant="secondary" className="bg-indigo-100/50 text-indigo-700 h-4 px-1.5 text-[9px] font-bold tracking-wide border border-indigo-100 shadow-sm">
                                    {student.seoLevel.toUpperCase()}
                                </Badge>
                            )}
                            {student.module && (
                                <Badge variant="outline" className="text-slate-600 h-4 px-1.5 text-[9px] border-slate-200 bg-white shadow-sm">
                                    {student.module.length > 20 ? student.module.substring(0, 20) + '...' : student.module}
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex-1"></div>

                {/* 2. Stats Row - Compact */}
                <div className="flex items-center justify-between py-2 border-t border-slate-100 dark:border-slate-800/50">
                    <div className="text-center">
                        <div className={`text-xl font-black ${creditColor} tabular-nums leading-none tracking-tight drop-shadow-sm`}>
                            {student.credits}
                        </div>
                        <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                            Credits
                        </div>
                    </div>
                    <div className="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>
                    <div className="text-center">
                        <div className="text-xl font-black text-slate-700 dark:text-slate-300 tabular-nums leading-none tracking-tight">
                            {completedSessions}
                        </div>
                        <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                            Sessions
                        </div>
                    </div>
                </div>

                {/* 3. Session Stack (Up to 3) */}
                <div className="mt-2 space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    {upcomingSessions.length > 0 ? (
                        upcomingSessions.map((session, index) => {
                            const isLive = new Date(session.startTime) <= new Date() && new Date(session.endTime) > new Date();
                            const isFirst = index === 0;

                            return (
                                <div key={session.id} className={`flex items-center justify-between p-2.5 rounded-lg border transition-all ${isLive
                                    ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/50"
                                    : "bg-indigo-50/50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800/50"
                                    }`}>
                                    <div className="flex items-center gap-2.5">
                                        <div className={`p-1.5 rounded-full shadow-sm border ${isLive
                                            ? "bg-white dark:bg-slate-900 text-emerald-600 border-emerald-100 dark:border-emerald-800"
                                            : "bg-white dark:bg-slate-900 text-indigo-600 border-indigo-50 dark:border-slate-800"
                                            }`}>
                                            <Clock size={14} className={isLive ? "animate-pulse" : ""} />
                                        </div>
                                        <div>
                                            {isFirst && (
                                                <div className={`text-[10px] font-bold uppercase tracking-wide opacity-70 mb-0.5 ${isLive ? "text-emerald-700 dark:text-emerald-400" : "text-indigo-900 dark:text-indigo-100"
                                                    }`}>
                                                    {isLive ? "Happening Now" : "Next Session"}
                                                </div>
                                            )}
                                            <div className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                                                {format(session.startTime, "MMM d")}
                                                <span className="opacity-40">|</span>
                                                {format(session.startTime, "h:mm a")}
                                            </div>
                                        </div>
                                    </div>
                                    {isFirst && (
                                        <ScheduleSessionDialog
                                            studentId={student.id}
                                            trigger={
                                                <Button size="icon" className="h-7 w-7 rounded-full bg-white dark:bg-slate-900 text-indigo-600 border border-indigo-100 dark:border-slate-800 hover:bg-indigo-50 shadow-sm transition-all">
                                                    <Plus size={14} />
                                                </Button>
                                            }
                                        />
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        // Empty State if no sessions
                        <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2.5">
                                <div className="p-1.5 rounded-full bg-white dark:bg-slate-800 text-slate-400 shadow-sm border border-slate-100 dark:border-slate-700">
                                    <Clock size={14} />
                                </div>
                                <span className="text-xs text-slate-400 italic font-medium">No upcoming class</span>
                            </div>
                            <ScheduleSessionDialog
                                studentId={student.id}
                                trigger={
                                    <Button size="icon" className="h-7 w-7 rounded-full bg-white dark:bg-slate-900 text-indigo-600 border border-indigo-100 dark:border-slate-800 hover:bg-indigo-50 shadow-sm transition-all">
                                        <Plus size={14} />
                                    </Button>
                                }
                            />
                        </div>
                    )}
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
