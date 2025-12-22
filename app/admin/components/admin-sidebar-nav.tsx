"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Calendar, LayoutDashboard, Settings } from "lucide-react";
import { AdminLogoutButton } from "./admin-logout-button";

const navItems = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/students", label: "Students", icon: Users },
    { href: "/admin/availability", label: "Availability", icon: Calendar },
    { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebarNav() {
    const pathname = usePathname();

    return (
        <nav className="px-4 space-y-2 flex flex-col h-full">
            <div className="flex-1 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive
                                    ? "bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100 font-medium dark:bg-indigo-900/20 dark:text-indigo-400 dark:shadow-none"
                                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
                                }`}
                        >
                            <item.icon
                                size={20}
                                className={`transition-colors ${isActive
                                        ? "text-indigo-600 dark:text-indigo-400"
                                        : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300"
                                    }`}
                            />
                            {item.label}
                        </Link>
                    );
                })}
            </div>

            <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800 pb-6">
                <AdminLogoutButton />
            </div>
        </nav>
    );
}
