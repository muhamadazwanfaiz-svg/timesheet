"use client";

import { useState } from "react";
import { User, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StudentDetailsSheet } from "./student-details-sheet";
import { Badge } from "@/components/ui/badge";

// Using the same interface
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
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    return (
        <>
            <div
                className="group flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all cursor-pointer shadow-sm hover:shadow-md active:scale-[0.99]"
                onClick={() => setIsSheetOpen(true)}
            >
                <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                    {/* Avatar */}
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center overflow-hidden border border-slate-200">
                        {student.avatarUrl ? (
                            <img src={student.avatarUrl} alt={student.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-slate-400 font-bold text-sm md:text-base">{student.name.charAt(0)}</span>
                        )}
                    </div>

                    {/* Info */}
                    <div className="min-w-0">
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate text-sm md:text-base">
                            {student.name}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span className="truncate max-w-[120px]">{student.email}</span>
                            {/* Mobile hidden badge, desktop visible */}
                            {student.seoLevel && (
                                <Badge variant="secondary" className="hidden md:inline-flex h-4 px-1 text-[9px]">
                                    {student.seoLevel}
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                    {/* Credits Badge (Always visible) */}
                    <div className={`px-2 py-1 rounded-md text-xs font-bold ${student.credits > 0 ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
                        {student.credits} CR
                    </div>

                    {/* View Button */}
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 group-hover:text-indigo-600">
                        <ChevronRight size={18} />
                    </Button>
                </div>
            </div>

            <StudentDetailsSheet
                student={student}
                isOpen={isSheetOpen}
                onOpenChange={setIsSheetOpen}
            />
        </>
    );
}
