"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CalendarDays, Settings, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export function StudentMobileNav() {
    const pathname = usePathname();

    const links = [
        {
            href: "/student/profile",
            label: "Home",
            icon: Home,
            active: pathname === "/student/profile",
        },
        {
            href: "/student/sessions", // Assuming this exists or will exist
            label: "Session",
            icon: BookOpen,
            active: pathname === "/student/sessions",
        },
        // We can add a "Book" action here? Or maybe just link to profile where the widget is?
        // Proposal said "Book (Center, Floating)". 
        // For now, let's keep it simple navigation. The Dashboard HAS the widget.
        // Actually, let's link to the anchor or just top of dashboard?
        // Let's stick to page navs.
        {
            href: "/student/settings",
            label: "Settings",
            icon: Settings,
            active: pathname === "/student/settings",
        },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-950 border-t border-indigo-100 dark:border-indigo-900 shadow-[0_-8px_30px_rgba(79,70,229,0.15)] pb-safe lg:hidden">
            <div className="flex items-center justify-around h-16 px-4">
                {links.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                            "relative flex flex-col items-center justify-center space-y-1 w-full h-full text-xs font-medium transition-colors",
                            link.active
                                ? "text-indigo-600 dark:text-indigo-400"
                                : "text-slate-500 hover:text-indigo-600/70 dark:text-slate-400 dark:hover:text-indigo-400/70"
                        )}
                    >
                        {link.active && (
                            <div className="absolute top-0 w-8 h-1 bg-indigo-600 rounded-b-full shadow-[0_2px_10px_rgba(79,70,229,0.5)]"></div>
                        )}
                        <link.icon className={cn("h-6 w-6", link.active && "drop-shadow-md")} />
                        <span>{link.label}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
