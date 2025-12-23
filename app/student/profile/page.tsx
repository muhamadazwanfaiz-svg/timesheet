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
    Zap, Target, GraduationCap
} from "lucide-react";
import { NoteViewer } from "../components/note-viewer";

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
    const lastCompletedSlot = completedSlots[0]; // Most recent because of orderBy desc

    // Gamification Logic (XP = Credits Spent? Or just Slots Completed * 100)
    const xp = completedSlots.length * 100;
    const level = Math.floor(xp / 500) + 1;
    const progressToNext = (xp % 500) / 500 * 100;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <Header />

            <main className="container max-w-7xl mx-auto py-8 px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* 1. LEFT COLUMN: Identity & Nav (Span 3) */}
                <aside className="lg:col-span-3 space-y-6">
                    {/* Identity Card */}
                    <Card className="border-indigo-100 dark:border-indigo-900 shadow-sm overflow-hidden">
                        <div className="h-24 bg-gradient-to-r from-indigo-500 to-violet-600"></div>
                        <div className="px-6 pb-6 relative">
                            <div className="w-20 h-20 rounded-full bg-white p-1 absolute -top-10 shadow-md">
                                <div className="w-full h-full rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-2xl font-bold">
                                    {student.name.charAt(0)}
                                </div>
                            </div>
                            <div className="mt-12 space-y-1">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{student.name}</h2>
                                <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200">
                                    {student.seoLevel || "Beginner"} SEO
                                </Badge>
                            </div>

                            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                                <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Credits</div>
                                <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                                    {student.credits}
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Navigation Menu */}
                    <nav className="space-y-2">
                        <Button variant="ghost" className="w-full justify-start text-indigo-600 bg-indigo-50 font-semibold" asChild>
                            <Link href="/student/profile">
                                <Gamepad2 className="mr-3 h-5 w-5" />
                                Command Center
                            </Link>
                        </Button>

                        {settings.showSessions && (
                            <Button variant="ghost" className="w-full justify-start text-slate-600 dark:text-slate-400" asChild>
                                <Link href="/student/sessions">
                                    <CalendarDays className="mr-3 h-5 w-5" />
                                    Sessions
                                </Link>
                            </Button>
                        )}

                        {settings.showCourses && (
                            <Button variant="ghost" className="w-full justify-start text-slate-600 dark:text-slate-400" asChild>
                                <Link href="#">
                                    <BookOpen className="mr-3 h-5 w-5" />
                                    Courses
                                </Link>
                            </Button>
                        )}

                        {settings.showCommunity && (
                            <Button variant="ghost" className="w-full justify-start text-slate-600 dark:text-slate-400" asChild>
                                <Link href="#">
                                    <User className="mr-3 h-5 w-5" />
                                    Community
                                </Link>
                            </Button>
                        )}

                        <Button variant="ghost" className="w-full justify-start text-slate-600 dark:text-slate-400" asChild>
                            <Link href="/student/settings">
                                <Settings className="mr-3 h-5 w-5" />
                                Settings
                            </Link>
                        </Button>
                    </nav>

                    {/* Logout */}
                    <div className="pt-6">
                        <StudentLogoutButton />
                    </div>
                </aside>


                {/* 2. CENTER COLUMN: Feed (Span 6) */}
                <section className="lg:col-span-6 space-y-6">

                    {/* Gamification Bar */}
                    <Card className="bg-slate-900 text-white border-0 shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-10">
                            <Trophy size={100} />
                        </div>
                        <CardContent className="p-6">
                            <div className="flex justify-between items-end mb-2">
                                <div>
                                    <div className="text-sm text-slate-400 font-medium uppercase tracking-wider">Current Level</div>
                                    <div className="text-3xl font-bold text-white">Level {level}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-slate-400">Next Reward</div>
                                    <div className="text-indigo-300 font-medium">Advanced SEO Toolkit</div>
                                </div>
                            </div>
                            {/* Custom Progress Bar */}
                            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 transition-all duration-1000"
                                    style={{ width: `${progressToNext}%` }}
                                ></div>
                            </div>
                            <div className="mt-2 text-xs text-slate-500 text-right">
                                {xp % 500} / 500 XP to Level {level + 1}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Upcoming Session OR Class Notes */}
                    {upcomingSlot ? (
                        <Card className="border-l-4 border-l-emerald-500 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-emerald-700">
                                    <CalendarDays className="h-5 w-5" />
                                    Next Session: Coming Up!
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-slate-900">
                                    {new Date(upcomingSlot.startTime).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                                </div>
                                <div className="text-lg text-slate-600">
                                    {new Date(upcomingSlot.startTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                <div className="mt-4">
                                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Join Meeting</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="bg-white p-6 rounded-xl border border-dashed border-slate-300 text-center space-y-3">
                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                                <CalendarDays size={24} />
                            </div>
                            <h3 className="text-lg font-medium text-slate-900">No upcoming sessions</h3>
                            <p className="text-slate-500 text-sm">You are all caught up! Book a slot to keep your streak going.</p>
                        </div>
                    )}

                    {/* Recent Class Notes (Replaces Feedback) */}
                    {lastCompletedSlot && lastCompletedSlot.classNotes && (
                        <Card className="bg-amber-50/50 border-amber-100">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-amber-800 text-lg">
                                    <BookOpen className="h-5 w-5" />
                                    Recent Class Notes
                                </CardTitle>
                                <CardDescription>Key takeaways from {new Date(lastCompletedSlot.startTime).toLocaleDateString()}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="prose prose-sm prose-amber text-slate-700 whitespace-pre-wrap">
                                    <NoteViewer note={lastCompletedSlot.classNotes} />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Recent History */}
                    <div>
                        <div className="flex items-center justify-between mb-3 px-1">
                            <h3 className="text-lg font-semibold text-slate-900/80">Session History</h3>
                            <Link href="/student/sessions" className="text-sm text-indigo-600 hover:underline">View All</Link>
                        </div>
                        <div className="space-y-3">
                            {student.slots.length === 0 && <p className="text-slate-500 italic px-1">No history yet.</p>}
                            {student.slots.slice(0, 3).map(slot => (
                                <div key={slot.id} className="bg-white p-4 rounded-lg border shadow-sm space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-2 h-12 rounded-full ${slot.status === 'COMPLETED' ? 'bg-indigo-500' : 'bg-slate-300'}`}></div>
                                            <div>
                                                <div className="font-medium text-slate-900">
                                                    {new Date(slot.startTime).toLocaleDateString()}
                                                </div>
                                                <div className="text-sm text-slate-500">
                                                    {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                        <Badge variant={slot.status === 'COMPLETED' ? 'default' : 'outline'}>
                                            {slot.status}
                                        </Badge>
                                    </div>
                                    {slot.classNotes && (
                                        <div className="pl-6 border-l-2 border-indigo-100 ml-3">
                                            <NoteViewer note={slot.classNotes} />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>


                {/* 3. RIGHT COLUMN: Utility (Span 3) */}
                <aside className="lg:col-span-3 space-y-6">

                    {/* Quick Book - SWAPPED ORDER */}
                    <div className="sticky top-24 space-y-6">

                        {/* 1. Calendar Widget (Moved to TOP) */}
                        <Card className="border-0 shadow-sm bg-white/50 backdrop-blur-sm">
                            <CardContent className="p-0 flex justify-center pt-4 pb-2">
                                <Calendar
                                    mode="single"
                                    selected={new Date()}
                                    className="rounded-md border-0"
                                />
                            </CardContent>
                        </Card>

                        {/* 2. Button (Moved Below) */}
                        <Button asChild className="w-full h-14 text-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-200 dark:shadow-none transition-all hover:scale-[1.02]">
                            <Link href="/book">
                                Book New Session
                            </Link>
                        </Button>

                        {/* Badges Grid - IMPLEMENTED */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm uppercase tracking-wider text-slate-500 font-semibold">Achievements</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { count: 1, icon: <Target size={18} />, label: "First Class" },
                                        { count: 5, icon: <Zap size={18} />, label: "5 Classes" },
                                        { count: 10, icon: <Trophy size={18} />, label: "10 Classes" },
                                        { count: 20, icon: <BookOpen size={18} />, label: "Scholar" },
                                        { count: 50, icon: <GraduationCap size={18} />, label: "Expert" },
                                        { count: 100, icon: <ExternalLink size={18} />, label: "Legend" },
                                    ].map((ach, i) => {
                                        const isUnlocked = completedSlots.length >= ach.count;
                                        return (
                                            <div
                                                key={i}
                                                className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs text-center p-1 transition-all ${isUnlocked ? 'bg-indigo-50 text-indigo-600 border border-indigo-200 shadow-sm' : 'bg-slate-50 text-slate-300 grayscale'}`}
                                                title={isUnlocked ? `Unlocked: ${ach.label}` : `Locked: Reach ${ach.count} classes`}
                                            >
                                                <div className="mb-1">{ach.icon}</div>
                                                <span className="leading-none scale-90">{ach.label}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                </aside>

            </main>
        </div>
    );
}
