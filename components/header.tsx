import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Lock, User } from "lucide-react";
import { cookies } from "next/headers";
import { StudentLogoutButton } from "./student-logout-button";

export async function Header() {
    const cookieStore = await cookies();
    const studentId = cookieStore.get("student_id")?.value;

    return (
        <header className="sticky top-0 z-50 w-full border-b border-indigo-50 dark:border-indigo-900 bg-white/80 dark:bg-slate-950/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container flex h-16 items-center justify-between px-4 md:px-8">
                <div className="flex items-center gap-2 font-bold text-2xl tracking-tight">
                    <Link href="/" className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                        SEO Laoshi
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
                        <Button asChild variant="ghost" className="text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400">
                            <Link href="/login">
                                Student Login
                            </Link>
                        </Button>
                    )}

                    {/* Tutor Link (Explicit Button) */}
                    <Button asChild variant="outline" size="sm" className="gap-2 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-600 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all">
                        <Link href="/login">
                            <Lock size={14} />
                            <span className="hidden sm:inline">Tutor Portal</span>
                            <span className="sm:hidden">Tutor</span>
                        </Link>
                    </Button>
                </nav>
            </div>
        </header>
    );
}
