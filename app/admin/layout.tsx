import { AdminSidebarNav } from "./components/admin-sidebar-nav";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden md:flex md:flex-col">
                <div className="p-6">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                        Timesheet
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">Tutor Dashboard</p>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <AdminSidebarNav />
                </div>
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
