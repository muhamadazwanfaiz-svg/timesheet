import Link from "next/link";
import { Users, Calendar, LayoutDashboard, Settings } from "lucide-react";
import { AdminLogoutButton } from "./components/admin-logout-button";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden md:block">
                <div className="p-6">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                        Timesheet
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">Tutor Dashboard</p>
                </div>
                <nav className="px-4 space-y-2">
                    <Link
                        href="/admin"
                        className="flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                    >
                        <LayoutDashboard size={20} />
                        Overview
                    </Link>
                    <Link
                        href="/admin/students"
                        className="flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                    >
                        <Users size={20} />
                        Students
                    </Link>
                    <Link
                        href="/admin/availability"
                        className="flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                    >
                        <Calendar size={20} />
                        Availability
                    </Link>
                    <Link
                        href="/admin/settings"
                        className="flex items-center gap-3 px-4 py-3 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                    >
                        <Settings size={20} />
                        Settings
                    </Link>
                    <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
                        <AdminLogoutButton />
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
