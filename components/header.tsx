import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Lock, User } from "lucide-react";
import { cookies } from "next/headers";
import { StudentLogoutButton } from "./student-logout-button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export async function Header() {
    const cookieStore = await cookies();
    const studentId = cookieStore.get("student_id")?.value;

    return (
        <header className="sticky top-0 z-50 w-full border-b border-indigo-50 dark:border-indigo-900 bg-white/80 dark:bg-slate-950/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container flex h-16 items-center justify-between px-4 md:px-8">
                <div className="flex items-center gap-2 font-bold text-2xl tracking-tight">
                    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <Image
                            src="/logo.png"
                            alt="SEO Laoshi Logo"
                            width={180}
                            height={60}
                            className="h-14 w-auto object-contain"
                            priority
                        />
                    </Link>
                </div>

                <nav className="flex items-center gap-3">
                    {/* Student Link */}
                    {studentId ? (
                        <div className="flex items-center gap-2">
                            <Button asChild variant="ghost" className="text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400">
                                <Link href="/student/profile">
                                    <User size={16} className="mr-2" />
                                    <span className="hidden sm:inline">Profile</span>
                                </Link>
                            </Button>
                            <StudentLogoutButton />
                        </div>
                    ) : (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button size="sm" className="bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all rounded-full px-6">
                                    Login
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent align="end" className="w-56 p-2">
                                <div className="grid gap-1">
                                    <p className="px-2 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        Select Portal
                                    </p>
                                    <Link href="/login" className="flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                        <User className="h-4 w-4 text-indigo-600" />
                                        Student Login
                                    </Link>
                                    <Link href="/login" className="flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                        <Lock className="h-4 w-4 text-purple-600" />
                                        Tutor Portal
                                    </Link>
                                </div>
                            </PopoverContent>
                        </Popover>
                    )}
                </nav>
            </div>
        </header>
    );
}
