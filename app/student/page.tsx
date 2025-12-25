import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSystemSettings } from "@/app/actions/settings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronRight } from "lucide-react";
import Link from "next/link";
import { SeoNewsCard } from "@/components/dashboard/seo-news-card";
import { RewardsCard } from "@/components/dashboard/rewards-card";

export const dynamic = "force-dynamic";

export default async function StudentDashboard() {
    const cookieStore = await cookies();
    const studentId = cookieStore.get("student_id")?.value;

    if (!studentId) {
        redirect("/login");
    }

    // Parallel fetching for speed
    const [student, settings] = await Promise.all([
        prisma.student.findUnique({
            where: { id: studentId },
            include: {
                slots: {
                    where: {
                        endTime: { gt: new Date() },
                        status: "SCHEDULED"
                    },
                    orderBy: { startTime: "asc" },
                    take: 1
                }
            }
        }),
        getSystemSettings()
    ]);

    if (!student) redirect("/login");

    const nextSession = student.slots[0];

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Command Center
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        Welcome back, {student.name.split(' ')[0]}. Ready to rank?
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button asChild size="lg" className="shadow-lg shadow-indigo-200 dark:shadow-none">
                        <Link href="/student/sessions">
                            Book Session
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Main Action / Next Session (Visible on Mobile & Desktop) */}
                <div className="md:col-span-1 space-y-6">
                    <Card className="border-indigo-100 dark:border-indigo-900 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-indigo-600" />
                                Up Next
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {nextSession ? (
                                <div className="space-y-4">
                                    <div className="p-4 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900">
                                        <div className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold mb-1">
                                            {nextSession.startTime.toLocaleDateString("en-US", { weekday: 'long', month: 'short', day: 'numeric' })}
                                        </div>
                                        <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                            {nextSession.startTime.toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit' })}
                                        </div>
                                        <div className="text-sm text-slate-500 mt-2">
                                            1 Hour Coaching
                                        </div>
                                    </div>
                                    <Button className="w-full" variant="outline">
                                        Join Meeting
                                    </Button>
                                </div>
                            ) : (
                                <div className="text-center py-8 space-y-4">
                                    <p className="text-slate-500 text-sm">No upcoming sessions.</p>
                                    <Button asChild variant="secondary" className="w-full">
                                        <Link href="/student/sessions">Schedule Now <ChevronRight className="w-4 h-4 ml-1" /></Link>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Mobile Only Quick Stats */}
                    <div className="block md:hidden grid-cols-2 gap-4 grid">
                        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                            <div className="text-2xl font-bold">{student.credits}</div>
                            <div className="text-xs text-slate-500 uppercase font-semibold">Credits</div>
                        </div>
                    </div>
                </div>

                {/* 2. Desktop Only Columns: News & Rewards */}
                {/* These are hidden on mobile using `hidden md:block` */}

                {settings.showSeoNews && (
                    <div className="hidden md:block md:col-span-1">
                        <SeoNewsCard />
                    </div>
                )}

                {settings.showRewards && (
                    <div className="hidden md:block md:col-span-1">
                        <RewardsCard />
                    </div>
                )}
            </div>

            {/* Quick Actions Footer (Mobile) */}
            <div className="md:hidden pt-8 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" asChild>
                        <Link href="/student/profile">
                            Profile
                        </Link>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" asChild>
                        <Link href="/student/sessions">
                            History
                        </Link>
                    </Button>
                </div>
            </div>

        </div>
    );
}
