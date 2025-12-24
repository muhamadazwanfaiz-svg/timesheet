import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getSystemSettings } from "@/app/actions/settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import { StudentLogoutButton } from "@/components/student-logout-button";
import {
    User, BookOpen, Settings, LogOut,
    Trophy, Gamepad2, CalendarDays, ExternalLink,
    Zap, Target, GraduationCap, Home
} from "lucide-react";
import { NoteViewer } from "../components/note-viewer";
import { DashboardBookingWidget } from "../components/dashboard-booking-widget";
import { FormattedDate } from "@/components/ui/formatted-date";

async function getStudentData() {
    const cookieStore = await cookies();
    const studentId = cookieStore.get("student_id")?.value;
    if (!studentId) return null;

    return await prisma.student.findUnique({
        where: { id: studentId },
        include: {
            slots: {
                orderBy: { startTime: "desc" },
                take: 5
            }
        },
    });
}

export default async function StudentDashboardPage() {
    const student = await getStudentData();
    const settings = await getSystemSettings();

    if (!student) redirect("/login");

    // Computed Logic
    const upcomingSlot = student.slots.find(s => s.status === "SCHEDULED" && new Date(s.startTime) > new Date());
    const completedSlots = student.slots.filter(s => s.status === "COMPLETED");
    const lastCompletedSlot = completedSlots[0];

    // Gamification Logic
    const xp = completedSlots.length * 100;
    const level = Math.floor(xp / 500) + 1;
    const progressToNext = (xp % 500) / 500 * 100;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 lg:pb-8">
            <Header />

            <main className="container max-w-5xl mx-auto py-6 px-4 space-y-4">

                {/* 1. BENTO GRID HEADER (Mobile: 2 Columns, Tablet+: 3 Columns or consistent) */}
                <div className="grid grid-cols-2 gap-3 lg:gap-6">

                    {/* LEFT CARD: IDENTITY (Me) */}
                    <Card className="bg-white dark:bg-slate-900 border-indigo-100 dark:border-indigo-900 shadow-sm relative overflow-hidden flex flex-col justify-between">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500"></div>
                        <CardContent className="p-4 flex flex-col items-center text-center h-full justify-center">
                            <div className="relative mb-2">
                                {/* Profile Photo / Avatar */}
                                <div className="w-16 h-16 rounded-full border-2 border-white shadow-md overflow-hidden bg-slate-100">
                                    {student.avatarUrl ? (
                                        <img src={student.avatarUrl} alt={student.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xl font-bold text-slate-400 bg-slate-100">
                                            {student.name.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                                    <Badge className="bg-fuchsia-600 hover:bg-fuchsia-700 text-[10px] px-1.5 py-0 h-5">
                                        Lv {level}
                                    </Badge>
                                </div>
                            </div>

                            <h2 className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-tight line-clamp-1">
                                {student.name.split(' ')[0]}
                            </h2>
                            <p className="text-xs text-slate-500 mb-2 truncate max-w-full">
                                {student.seoLevel || "Beginner"}
                            </p>

                            {/* Mini Progress Bar */}
                            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-auto">
                                <div
                                    className="h-full bg-fuchsia-500 rounded-full"
                                    style={{ width: `${progressToNext}%` }}
                                ></div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* RIGHT CARD: NEXT CLASS (Urgency) */}
                    {upcomingSlot ? (
                        <Card className="bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900 shadow-sm flex flex-col justify-between relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 opacity-5">
                                <CalendarDays size={60} className="text-emerald-600" />
                            </div>
                            <CardContent className="p-4 h-full flex flex-col justify-center">
                                <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                    Up Next
                                </div>
                                <div className="font-bold text-slate-900 dark:text-white text-lg leading-tight mb-0.5">
                                    <FormattedDate date={upcomingSlot.startTime} mode="time" />
                                </div>
                                <div className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                                    <FormattedDate date={upcomingSlot.startTime} mode="date" />
                                </div>
                                <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-7 text-xs shadow-sm mt-auto">
                                    Join
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 border-dashed shadow-none flex flex-col justify-center text-center">
                            <CardContent className="p-4 flex flex-col items-center gap-2 h-full justify-center">
                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                    <CalendarDays size={16} />
                                </div>
                                <div>
                                    <div className="font-semibold text-slate-700 dark:text-slate-300 text-sm">No Class</div>
                                    <p className="text-[10px] text-slate-500 leading-tight mt-0.5">Plan your week ahead!</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* 2. MIDDLE ROW: WALLET STRIP */}
                <Card className="bg-indigo-600 text-white shadow-md border-0">
                    <CardContent className="p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                <Zap size={16} className="text-yellow-300 fill-yellow-300" />
                            </div>
                            <div>
                                <div className="text-[10px] text-indigo-200 uppercase font-semibold tracking-wider">Balance</div>
                                <div className="font-bold text-lg leading-none">{student.credits} Credits</div>
                            </div>
                        </div>
                        <Button
                            variant="secondary"
                            size="sm"
                            className="bg-white text-indigo-600 hover:bg-indigo-50 border-0 h-8 text-xs font-bold px-4 shadow-sm"
                        >
                            Top Up
                        </Button>
                    </CardContent>
                </Card>

                {/* 3. MAIN WIDGET: BOOKING / TABS (Takes remaining space) */}
                <div className="space-y-4">
                    <DashboardBookingWidget
                        studentId={student.id}
                        studentName={student.name}
                        studentCredits={student.credits}
                    />

                    {/* History Section (Secondary) */}
                    <div className="pt-4">
                        <div className="flex items-center justify-between mb-3 px-1">
                            <h3 className="font-semibold text-slate-900">Recent Sessions</h3>
                            <Link href="/student/sessions" className="text-xs font-medium text-indigo-600 hover:text-indigo-700">View All</Link>
                        </div>
                        <div className="space-y-2">
                            {student.slots.length === 0 && (
                                <div className="text-center py-8 text-slate-400 text-sm bg-slate-50 rounded-lg border border-dashed border-slate-200">
                                    No session history found.
                                </div>
                            )}
                            {student.slots.slice(0, 3).map(slot => (
                                <div key={slot.id} className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-1.5 h-8 rounded-full ${slot.status === 'COMPLETED' ? 'bg-indigo-500' : 'bg-slate-200'}`}></div>
                                        <div>
                                            <div className="font-medium text-sm text-slate-900 dark:text-slate-100">
                                                <FormattedDate date={slot.startTime} mode="full" />
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                <FormattedDate date={slot.startTime} mode="time" /> • {slot.status}
                                            </div>
                                        </div>
                                    </div>
                                    {slot.classNotes && <BookOpen size={14} className="text-indigo-400" />}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
