import { prisma } from "@/lib/db";
import { format } from "date-fns";
import { Users, Calendar, DollarSign, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { SlotActions } from "@/app/admin/components/slot-actions";
import { DashboardSessionList } from "@/app/admin/components/dashboard-session-list";

export default async function AdminDashboard() {
    // 1. Fetch Metrics
    const studentCount = await prisma.student.count();

    const now = new Date();
    const upcomingSessionsCount = await prisma.slot.count({
        where: {
            endTime: { gte: now },
            studentId: { not: null },
        },
    });

    // Mock revenue calculation: $150 per session
    const estimatedRevenue = upcomingSessionsCount * 150;

    // 2. Fetch Timeline (Next 5 booked sessions)
    const nextSessions = await prisma.slot.findMany({
        where: {
            endTime: { gte: now },
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
            <div className="flex overflow-x-auto pb-4 gap-4 md:grid md:grid-cols-3 md:overflow-visible md:pb-0 snap-x snap-mandatory">
                {[
                    { label: "Active Students", value: studentCount, icon: Users, color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" },
                    { label: "Upcoming Sessions", value: upcomingSessionsCount, icon: Clock, color: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400" },
                    { label: "Est. Revenue (Pipeline)", value: `$${estimatedRevenue}`, icon: DollarSign, color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" },
                ].map((stat, i) => (
                    <div key={i} className="min-w-[85vw] md:min-w-0 snap-center p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
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
                        <DashboardSessionList sessions={nextSessions} />
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


                </div>
            </div>
        </div>
    );
}
