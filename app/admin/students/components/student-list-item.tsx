"use client";

import { useState } from "react";
import { User, ChevronDown, ChevronUp, Clock, Plus, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AddCreditDialog } from "./add-credit-dialog";
import { BackfillDialog } from "./backfill-dialog";
import { ScheduleSessionDialog } from "./schedule-session-dialog";
import { format } from "date-fns";
import Link from "next/link";

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
    avatarUrl?: string | null;
    _count?: {
        slots: number;
    };
}

interface StudentListItemProps {
    student: Student;
}

export function StudentListItem({ student }: StudentListItemProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const completedSessions = student._count?.slots ?? 0;
    const upcomingSessions = student.slots;
    const creditColor = student.credits > 3 ? "text-emerald-600" : student.credits > 0 ? "text-amber-600" : "text-red-600";

    // Deterministic emoji based on student ID to ensure it stays the same
    const getFunAvatar = (id: string) => {
        const emojis = ["🦊", "🐼", "🦄", "🦁", "🐧", "🐸", "🐙", "🍄", "🚀", "🎨", "🎸", "⚡️", "🥑", "🍩", "🤖", "👻", "🐱", "🐶", "🦋", "🦖"];
        let hash = 0;
        for (let i = 0; i < id.length; i++) {
            hash = id.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash) % emojis.length;
        return emojis[index];
    };

    return (
        <div className={`bg-white dark:bg-slate-900 rounded-xl border transition-all duration-300 overflow-hidden ${isExpanded ? 'border-indigo-200 ring-1 ring-indigo-50 shadow-md' : 'border-slate-100 dark:border-slate-800 shadow-sm'}`}>

            {/* HERDER / TRIGGER AREA */}
            <div
                className="p-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                    {/* Large Avatar */}
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center overflow-hidden border-2 border-slate-50 shadow-sm relative">
                        {student.avatarUrl ? (
                            <img src={student.avatarUrl} alt={student.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-2xl select-none">{getFunAvatar(student.id)}</span>
                        )}
                        {/* Status Indicator Dot */}
                        {student.credits > 0 && (
                            <div className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                        )}
                    </div>

                    <div className="min-w-0">
                        <h3 className="font-bold text-slate-900 dark:text-slate-100 truncate text-base">
                            {student.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                            {/* Credits Badge (Always Visible) */}
                            <Badge variant="secondary" className={`h-5 px-1.5 text-[10px] uppercase font-bold tracking-wide ${student.credits > 0 ? "bg-indigo-50 text-indigo-700" : "bg-slate-100 text-slate-500"}`}>
                                {student.credits} Credits
                            </Badge>
                            {/* Level Badge */}
                            {student.seoLevel && (
                                <span className="text-xs text-slate-500 hidden md:inline-block border-l pl-2 border-slate-200">
                                    {student.seoLevel}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 flex-shrink-0">
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </Button>
            </div>

            {/* EXPANDED DETAILS */}
            {isExpanded && (
                <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 animate-in slide-in-from-top-2 duration-200">
                    <div className="p-4 space-y-5">

                        {/* 1. Statistics Row */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white dark:bg-slate-950 p-3 rounded-lg border border-slate-100 dark:border-slate-800 text-center shadow-sm">
                                <div className={`text-2xl font-bold ${creditColor}`}>{student.credits}</div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Available</div>
                                <div className="mt-2 flex justify-center">
                                    <AddCreditDialog studentId={student.id} studentName={student.name} />
                                </div>
                            </div>
                            <div className="bg-white dark:bg-slate-950 p-3 rounded-lg border border-slate-100 dark:border-slate-800 text-center shadow-sm">
                                <div className="text-2xl font-bold text-slate-700">{completedSessions}</div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completed</div>
                                <div className="mt-2 flex justify-center">
                                    <BackfillDialog studentId={student.id} studentName={student.name} />
                                </div>
                            </div>
                        </div>

                        {/* 2. Upcoming Sessions List */}
                        <div>
                            <div className="flex items-center justify-between mb-2 px-1">
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Upcoming Sessions</h4>
                                <ScheduleSessionDialog
                                    studentId={student.id}
                                    trigger={
                                        <Button size="sm" variant="ghost" className="h-6 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 text-xs px-2">
                                            <Plus size={12} className="mr-1" /> Add New
                                        </Button>
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                {upcomingSessions.length === 0 ? (
                                    <div className="text-center py-4 border border-dashed border-slate-200 rounded-lg text-slate-400 text-xs italic bg-white/50">
                                        No upcoming classes
                                    </div>
                                ) : (
                                    upcomingSessions.map((session) => {
                                        const isLive = new Date(session.startTime) <= new Date() && new Date(session.endTime) > new Date();
                                        return (
                                            <div key={session.id} className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-100 shadow-sm text-sm">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-1.5 rounded-full ${isLive ? 'bg-emerald-100 text-emerald-600 animate-pulse' : 'bg-slate-100 text-slate-400'}`}>
                                                        <Clock size={14} />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-slate-800">
                                                            {format(session.startTime, "MMM d, yyyy")}
                                                        </div>
                                                        <div className="text-xs text-slate-500">
                                                            {format(session.startTime, "h:mm a")} - {format(session.endTime, "h:mm a")}
                                                        </div>
                                                    </div>
                                                </div>
                                                {isLive && <Badge className="bg-emerald-500 h-5 px-1.5 text-[9px]">LIVE</Badge>}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        {/* 3. Footer Action */}
                        <div className="pt-2">
                            <Button variant="secondary" className="w-full bg-white border border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 transition-colors" asChild>
                                <Link href={`/admin/students/${student.id}`}>
                                    View Full Profile <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}
