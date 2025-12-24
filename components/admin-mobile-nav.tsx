"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Calendar, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/actions/auth";

export function AdminMobileNav() {
    const pathname = usePathname();

    const links = [
        {
            href: "/admin",
            label: "Home",
            icon: LayoutDashboard,
            active: pathname === "/admin",
        },
        {
            href: "/admin/students",
            label: "Students",
            icon: Users,
            active: pathname.startsWith("/admin/students"),
        },
        {
            href: "/admin/availability",
            label: "Calendar",
            icon: Calendar,
            active: pathname.startsWith("/admin/availability"),
        },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pb-safe md:hidden">
            <div className="flex items-center justify-around h-16 px-2">
                {links.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                            "flex flex-col items-center justify-center space-y-1 w-full h-full text-xs font-medium transition-colors",
                            link.active
                                ? "text-indigo-600 dark:text-indigo-400"
                                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300"
                        )}
                    >
                        <link.icon className="h-6 w-6" />
                        <span>{link.label}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
