import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Header } from "@/components/header";
import { PasswordCard } from "../profile/components/password-card";
import { updateProfile } from "@/app/actions/profile";
import { StudentLogoutButton } from "@/components/student-logout-button";
import { ArrowLeft, User, Shield, LogOut } from "lucide-react";
import Link from "next/link";

async function getStudentSession() {
    const cookieStore = await cookies();
    const studentId = cookieStore.get("student_id")?.value;
    if (!studentId) return null;

    return await prisma.student.findUnique({
        where: { id: studentId },
    });
}

export default async function StudentSettingsPage() {
    const student = await getStudentSession();

    if (!student) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <Header />
            <main className="container py-10 max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/student/profile">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                            Settings
                        </h1>
                        <p className="text-slate-500">Manage your account preferences.</p>
                    </div>
                </div>

                <div className="grid gap-6">

                    {/* Profile Section */}
                    <Card id="profile">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User size={20} className="text-indigo-600" />
                                Public Profile
                            </CardTitle>
                            <CardDescription>This information is visible to your tutors.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form action={updateProfile} className="space-y-4">
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Full Name</label>
                                    <Input value={student.name} disabled className="bg-slate-100 cursor-not-allowed" />
                                    <p className="text-xs text-slate-400">Contact admin to change your name.</p>
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Email</label>
                                    <Input value={student.email} disabled className="bg-slate-100 cursor-not-allowed" />
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Bio</label>
                                    <Textarea
                                        name="bio"
                                        defaultValue={student.bio || ""}
                                        placeholder="Tell us a bit about yourself..."
                                        rows={4}
                                    />
                                </div>
                                <Button type="submit">Save Changes</Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Security Section */}
                    <section id="security">
                        <PasswordCard />
                    </section>

                    {/* Danger / Logout */}
                    <Card className="border-red-100 bg-red-50/10">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-red-700">
                                <LogOut size={20} />
                                Sign Out
                            </CardTitle>
                            <CardDescription>End your current session.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <StudentLogoutButton />
                        </CardContent>
                    </Card>

                </div>
            </main>
        </div>
    );
}
