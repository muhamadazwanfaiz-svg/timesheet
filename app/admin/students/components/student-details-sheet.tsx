"use client";

import Link from "next/link";
import { Clock, Plus, ArrowRight, User, Mail, Zap, Target, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
} from "@/components/ui/sheet";
import { AddCreditDialog } from "./add-credit-dialog";
import { BackfillDialog } from "./backfill-dialog";
import { ScheduleSessionDialog } from "./schedule-session-dialog";
import { format } from "date-fns";

// Reusing interfaces from student-card (should ideally be shared)
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

interface StudentDetailsSheetProps {
    student: Student;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function StudentDetailsSheet({ student, isOpen, onOpenChange }: StudentDetailsSheetProps) {
    const completedSessions = student._count?.slots ?? 0;
    const upcomingSessions = student.slots;

    const creditColor = student.credits > 3 ? "text-emerald-600" : student.credits > 0 ? "text-amber-600" : "text-red-600";

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader className="pb-6 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-3xl overflow-hidden border-2 border-white shadow-md">
                            {student.avatarUrl ? (
                                <img src={student.avatarUrl} alt={student.name} className="w-full h-full object-cover" />
                            ) : (
                                <span>{student.name.charAt(0)}</span>
                            )}
                        </div>
                        <div>
                            <SheetTitle className="text-xl font-bold">{student.name}</SheetTitle>
                            <SheetDescription>{student.email}</SheetDescription>
                            <div className="flex gap-2 mt-2">
                                <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100">
                                    {student.seoLevel || "Beginner"}
                                </Badge>
                                {student.module && (
                                    <Badge variant="outline" className="text-slate-600">
                                        {student.module}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </SheetHeader>

                <div className="space-y-6 py-6">
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                            <div className={`text-3xl font-bold ${creditColor}`}>{student.credits}</div>
                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Credits Available</div>
                            <div className="mt-3">
                                <AddCreditDialog studentId={student.id} studentName={student.name} />
                            </div>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                            <div className="text-3xl font-bold text-slate-700 dark:text-slate-300">{completedSessions}</div>
                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Sessions Completed</div>
                            <div className="mt-3">
                                <BackfillDialog studentId={student.id} studentName={student.name} />
                            </div>
                        </div>
                    </div>

                    {/* Sessions */}
                    <div>
                        <h3 className="font-semibold text-slate-900 mb-3 flex items-center justify-between">
                            <span>Upcoming Sessions</span>
                            <ScheduleSessionDialog
                                studentId={student.id}
                                trigger={
                                    <Button size="sm" variant="outline" className="h-7 text-xs">
                                        <Plus size={12} className="mr-1" /> Schedule
                                    </Button>
                                }
                            />
                        </h3>
                        <div className="space-y-2">
                            {upcomingSessions.length === 0 ? (
                                <div className="text-center py-6 border-2 border-dashed border-slate-100 rounded-lg text-slate-400 text-sm">
                                    No upcoming sessions scheduled.
                                </div>
                            ) : (
                                upcomingSessions.map((session, index) => {
                                    const isLive = new Date(session.startTime) <= new Date() && new Date(session.endTime) > new Date();
                                    return (
                                        <div key={session.id} className={`flex items-center justify-between p-3 rounded-lg border ${isLive ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-100'}`}>
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-full ${isLive ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                                                    <Clock size={16} />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-sm text-slate-900">
                                                        {format(session.startTime, "EEE, MMM d")}
                                                    </div>
                                                    <div className="text-xs text-slate-500">
                                                        {format(session.startTime, "h:mm a")} - {format(session.endTime, "h:mm a")}
                                                    </div>
                                                </div>
                                            </div>
                                            {isLive && <Badge className="bg-emerald-500">Live</Badge>}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

                <SheetFooter className="mt-auto border-t border-slate-100 pt-4">
                    <Button className="w-full" variant="secondary" asChild>
                        <Link href={`/admin/students/${student.id}`}>
                            View Full Profile <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
