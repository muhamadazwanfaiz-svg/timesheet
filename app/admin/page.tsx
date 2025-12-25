import { prisma } from "@/lib/db";
import { format } from "date-fns";
import { Users, Calendar, DollarSign, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { SlotActions } from "@/app/admin/components/slot-actions";
import { DashboardSessionList } from "@/app/admin/components/dashboard-session-list";
import { ManualBookingDialog } from "@/app/admin/components/manual-booking-dialog";

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
            status: { not: "CANCELED" }
        },
        orderBy: { startTime: "asc" },
        take: 10,
        include: { student: true },
    });

    // 3. Fetch Students for Quick Action
    const students = await prisma.student.findMany({
        select: { id: true, name: true, email: true },
        orderBy: { name: "asc" }
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
                    {/* Header Actions can go here if needed, cleaning up for "Quick Actions" row */}
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="flex overflow-x-auto pb-4 gap-4 md:grid md:grid-cols-3 md:overflow-visible md:pb-0 snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0">
                {[
                    { label: "Active Students", value: studentCount, icon: Users, color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" },
                    { label: "Upcoming Sessions", value: upcomingSessionsCount, icon: Clock, color: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400" },
                    { label: "Est. Revenue (Pipeline)", value: `$${estimatedRevenue}`, icon: DollarSign, color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" },
                ].map((stat, i) => (
                    <div key={i} className="min-w-[280px] w-[85vw] md:w-auto md:min-w-0 snap-center p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
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

            {/* Quick Actions (Prominent Row) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/admin/students" className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:text-indigo-600 transition flex items-center justify-center gap-3 font-medium text-slate-700 dark:text-slate-300 shadow-sm">
                    <Users className="w-5 h-5" />
                    Add Student
                </Link>
                <Link href="/admin/availability" className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:text-indigo-600 transition flex items-center justify-center gap-3 font-medium text-slate-700 dark:text-slate-300 shadow-sm">
                    <Calendar className="w-5 h-5" />
                    Manage Availability
                </Link>
                <ManualBookingDialog students={students} />
            </div>

            {/* Schedule List */}
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Upcoming Schedule</h2>
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                    <DashboardSessionList sessions={nextSessions} />
                </div>
            </div>
        </div>
    );
}
