import { prisma } from "@/lib/db";
import { format } from "date-fns";
import { Users, Calendar, DollarSign, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { SlotActions } from "@/app/admin/components/slot-actions";

export default async function AdminDashboard() {
    // 1. Fetch Metrics
    const studentCount = await prisma.student.count();

    const now = new Date();
    const upcomingSessionsCount = await prisma.slot.count({
        where: {
            startTime: { gte: now },
            studentId: { not: null },
        },
    });

    // Mock revenue calculation: $150 per session
    const estimatedRevenue = upcomingSessionsCount * 150;

    // 2. Fetch Timeline (Next 5 booked sessions)
    const nextSessions = await prisma.slot.findMany({
        where: {
            startTime: { gte: now },
            studentId: { not: null },
        },
        orderBy: { startTime: "asc" },
        take: 5,
        include: { student: true },
    });

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
                    <p className="text-slate-500 dark:text-slate-400">Welcome back, Tutor. Here&apos;s your daily overview.</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/admin/availability" className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 transition">
                        <Calendar className="mr-2 h-4 w-4" />
                        Manage Slots
                    </Link>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Active Students", value: studentCount, icon: Users, color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" },
                    { label: "Upcoming Sessions", value: upcomingSessionsCount, icon: Clock, color: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400" },
                    { label: "Est. Revenue (Pipeline)", value: `$${estimatedRevenue}`, icon: DollarSign, color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" },
                ].map((stat, i) => (
                    <div key={i} className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
                        <div className={`p-4 rounded-xl ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Split View: Schedule & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Schedule */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Upcoming Schedule</h2>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                        {nextSessions.length === 0 ? (
                            <div className="p-12 text-center text-slate-500">
                                No upcoming sessions booked.
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {nextSessions.map((slot) => (
                                    <div key={slot.id} className="p-6 flex items-center gap-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                                        <div className="flex flex-col items-center justify-center w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                                            <span className="text-xs font-semibold uppercase text-slate-500">{format(slot.startTime, "MMM")}</span>
                                            <span className="text-2xl font-bold text-slate-800 dark:text-slate-200">{format(slot.startTime, "d")}</span>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                                {slot.student?.name || "Unknown Student"}
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                                                    Confirmed
                                                </span>
                                            </h3>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                                                {format(slot.startTime, "h:mm a")} - {format(slot.endTime, "h:mm a")}
                                            </p>
                                        </div>
                                        <SlotActions slotId={slot.id} status={slot.status} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Quick Actions / Activity */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Quick Actions</h2>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 space-y-3">
                        <Link href="/admin/students" className="block w-full p-3 text-center rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:text-indigo-600 transition font-medium text-slate-700 dark:text-slate-300">
                            Add New Student
                        </Link>
                        <Link href="/admin/availability" className="block w-full p-3 text-center rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:text-indigo-600 transition font-medium text-slate-700 dark:text-slate-300">
                            Create New Slots
                        </Link>
                        <button className="block w-full p-3 text-center rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:text-indigo-600 transition font-medium text-slate-700 dark:text-slate-300 opacity-50 cursor-not-allowed">
                            Log Session Note (Soon)
                        </button>
                    </div>

                    {/* Mini Module Tracker Mockup */}
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                        <h3 className="font-bold text-lg mb-1">Top Performer</h3>
                        <p className="text-indigo-100 text-sm mb-4">Sarah Johnson sent 3 homework assignments.</p>
                        <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                            <div className="flex justify-between text-xs mb-1">
                                <span>Progress</span>
                                <span>85%</span>
                            </div>
                            <div className="h-1.5 bg-black/20 rounded-full overflow-hidden">
                                <div className="h-full bg-white w-[85%]"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
