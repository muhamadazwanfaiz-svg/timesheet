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
                    <Card className="bg-white dark:bg-slate-900 border-indigo-100 dark:border-indigo-900 shadow-sm relative overflow-hidden flex flex-col justify-between group">
                        {/* Edit Icon Overlay (Top Right of Card) - Visible on hover or always accessible */}
                        <Link href="/student/settings" className="absolute top-2 right-2 p-1.5 bg-slate-100 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors z-20">
                            <Settings size={14} />
                        </Link>

                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500"></div>
                        <CardContent className="p-4 flex flex-col items-center text-center h-full justify-center">
                            <div className="relative mb-2">
                                {/* Profile Photo / Avatar */}
                                <div className="w-16 h-16 rounded-full border-2 border-white shadow-md overflow-hidden bg-slate-100 relative">
                                    {student.avatarUrl ? (
                                        <img src={student.avatarUrl} alt={student.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xl font-bold text-slate-400 bg-slate-100">
                                            {student.name.charAt(0)}
                                        </div>
                                    )}
                                    {/* Edit Overlay on Avatar */}
                                    <Link href="/student/settings" className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Settings size={20} className="text-white drop-shadow-md" />
                                    </Link>
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

                    {/* RIGHT CARD: WALLET (Balance Only - Swapped Position) */}
                    <Card className="bg-indigo-600 text-white shadow-sm border-0 flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 bg-white/10 w-24 h-24 rounded-full blur-xl"></div>
                        <CardContent className="p-4 h-full flex flex-col justify-center items-center text-center">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-2 shadow-inner">
                                <Zap size={20} className="text-yellow-300 fill-yellow-300" />
                            </div>
                            <div>
                                <div className="text-[10px] text-indigo-200 uppercase font-semibold tracking-wider mb-0.5">Balance</div>
                                <div className="font-bold text-2xl leading-none">{student.credits}</div>
                                <div className="text-[10px] text-indigo-200 mt-0.5">Credits</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* 2. MIDDLE ROW: UPCOMING CLASS (Full Width Strip - Swapped Position) */}
                {upcomingSlot ? (
                    <Card className="bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900 shadow-sm relative overflow-hidden">
                        <CardContent className="p-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg flex items-center justify-center text-emerald-600 shrink-0">
                                    <CalendarDays size={20} />
                                </div>
                                <div className="min-w-0">
                                    <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
                                        <span className="relative flex h-1.5 w-1.5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                                        </span>
                                        Up Next
                                    </div>
                                    <div className="font-bold text-slate-900 dark:text-white text-sm truncate">
                                        <FormattedDate date={upcomingSlot.startTime} mode="full" />
                                    </div>
                                    <div className="text-xs text-slate-500">
                                        <FormattedDate date={upcomingSlot.startTime} mode="time" />
                                    </div>
                                </div>
                            </div>
                            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 text-xs font-semibold px-4 shadow-sm shrink-0">
                                Join
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 border-dashed shadow-none">
                        <CardContent className="p-3 flex items-center justify-center gap-2 text-slate-400">
                            <CalendarDays size={16} />
                            <span className="text-xs font-medium">No upcoming classes</span>
                        </CardContent>
                    </Card>
                )}

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
