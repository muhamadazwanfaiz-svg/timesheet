import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FormattedDate } from "@/components/ui/formatted-date";
import { NoteViewer } from "../components/note-viewer";
import { CalendarDays, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function getStudentSessions() {
    const cookieStore = await cookies();
    const studentId = cookieStore.get("student_id")?.value;
    if (!studentId) return null;

    return await prisma.student.findUnique({
        where: { id: studentId },
        include: {
            slots: {
                orderBy: { startTime: "desc" },
                // fetch more for the dedicated history page
                take: 50
            }
        },
    });
}

export default async function StudentSessionsPage() {
    const student = await getStudentSessions();
    if (!student) redirect("/login");

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <Header />
            <main className="container max-w-4xl mx-auto py-8 px-4">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/student/profile">
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        </Button>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Sessions</h1>
                    </div>
                </div>

                <div className="space-y-4">
                    {student.slots.length === 0 ? (
                        <Card className="border-dashed py-12">
                            <CardContent className="flex flex-col items-center justify-center text-center text-slate-500">
                                <CalendarDays className="h-12 w-12 mb-4 text-slate-300" />
                                <h3 className="text-lg font-medium text-slate-900">No sessions yet</h3>
                                <p>Book your first session to get started!</p>
                                <Button className="mt-4" asChild>
                                    <Link href="/book">Book Now</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        student.slots.map((slot) => (
                            <Card key={slot.id} className="overflow-hidden">
                                <div className="flex flex-col md:flex-row border-l-4 border-l-indigo-500">
                                    <div className="p-6 flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Badge variant={slot.status === 'COMPLETED' ? 'default' : 'secondary'}>
                                                {slot.status}
                                            </Badge>
                                            <span className="text-sm text-slate-500 font-medium">
                                                <FormattedDate date={slot.startTime} mode="full" />
                                            </span>
                                        </div>
                                        <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                                            <FormattedDate date={slot.startTime} mode="time" />
                                            <span className="text-slate-400 font-normal text-lg"> - <FormattedDate date={slot.endTime} mode="time" /></span>
                                        </div>

                                        {slot.classNotes && (
                                            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                                <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                                                    Tutor Notes
                                                </h4>
                                                <div className="text-slate-600 dark:text-slate-300 text-sm pl-4">
                                                    <NoteViewer note={slot.classNotes} />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}
