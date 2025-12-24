import Image from "next/image";
import { AdminSidebarNav } from "./components/admin-sidebar-nav";
import { AdminMobileNav } from "@/components/admin-mobile-nav";

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
                    <div className="flex items-center gap-2">
                        <Image
                            src="/logo.png"
                            alt="SEO Laoshi Logo"
                            width={180}
                            height={80}
                            className="h-20 w-auto object-contain"
                            priority
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <AdminSidebarNav />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
                <div className="p-4 md:p-8">
                    {children}
                </div>
            </main>
            <AdminMobileNav />
        </div>
    );
}
