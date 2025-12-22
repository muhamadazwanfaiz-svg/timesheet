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
        <Card className="overflow-hidden border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all duration-300 group">
            <CardContent className="p-6">

                {/* 1. Identity Header */}
                <div className="flex flex-col items-center text-center space-y-3 mb-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center text-2xl font-bold text-indigo-700 shadow-inner mb-1">
                        {student.name.charAt(0)}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-0.5 group-hover:text-indigo-600 transition-colors">
                            {student.name}
                        </h3>
                        <div className="text-sm text-slate-500 font-medium flex items-center justify-center gap-1.5">
                            <Mail size={12} />
                            {student.email}
                        </div>
                    </div>
                </div>

                {/* 2. Tags / Badges */}
                <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                    {student.seoLevel && (
                        <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-100">
                            <Zap size={10} className="mr-1 fill-indigo-700/20" />
                            {student.seoLevel}
                        </Badge>
                    )}
                    {student.module && (
                        <Badge variant="outline" className="text-slate-600 border-slate-200">
                            {student.module.length > 20 ? student.module.substring(0, 20) + '...' : student.module}
                        </Badge>
                    )}
                </div>

                {/* 3. Stats Row */}
                <div className="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800 pt-6">
                    <div className="text-center border-r border-slate-100 dark:border-slate-800">
                        <div className={`text-3xl font-bold ${creditColor}`}>
                            {student.credits}
                        </div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1">
                            Credits
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-slate-700 dark:text-slate-300">
                            {completedSessions}
                        </div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1">
                            Sessions
                        </div>
                    </div>
                </div>

            </CardContent>

            {/* 4. Action Footer */}
            <CardFooter className="bg-slate-50 dark:bg-slate-900/50 p-3 flex gap-2">
                <Button
                    variant="ghost"
                    className="flex-1 text-slate-600 hover:text-indigo-600 hover:bg-white border border-transparent hover:border-slate-200 shadow-sm transition-all"
                    asChild
                >
                    {/* Placeholder for logging session - for now maybe just link to profile tab? 
                        Ideally this opens a log modal, but for now linking to profile is safe.
                    */}
                    <Link href={`/admin/students/${student.id}?tab=sessions`}>
                        <Calendar className="mr-2 h-4 w-4" />
                        Log Session
                    </Link>
                </Button>

                <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200" asChild>
                    <Link href={`/admin/students/${student.id}`}>
                        Profile
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
