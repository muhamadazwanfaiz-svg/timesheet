import { getStudentDetails } from "@/app/actions/students";
import { format } from "date-fns";
import { ArrowLeft, Clock, CreditCard, Mail } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { SessionNotesEditor } from "../components/session-notes-editor";
import { DeleteSessionButton } from "../components/delete-session-button";
import { SessionRow } from "../components/session-row";

import { EditStudentSettingsDialog } from "../components/edit-student-settings-dialog";

export default async function StudentDossierPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const student = await getStudentDetails(id);

    if (!student) {
        notFound();
    }

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-indigo-50/80 to-white dark:from-indigo-950/20 dark:to-slate-950 p-6 rounded-2xl border border-indigo-100/50 dark:border-indigo-900/50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/students"
                            className="p-2 bg-white dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors border border-slate-200 dark:border-slate-800 shadow-sm"
                        >
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                                {student.name}
                            </h1>
                            <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
                                <Mail size={14} className="text-indigo-400" />
                                {student.email}
                            </div>
                        </div>
                    </div>
                    <EditStudentSettingsDialog
                        studentId={student.id}
                        currentDuration={(student as any).defaultDurationMinutes || 60}
                    />
                </div>

                {/* Quick Stats - Embedded in Header for better flow */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 max-w-2xl">
                    <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 group hover:border-indigo-200 transition-colors">
                        <div className="p-3 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                            <CreditCard size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Balance</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                {student.credits} <span className="text-sm font-normal text-slate-400">credits</span>
                            </h3>
                        </div>
                    </div>
                    <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 group hover:border-purple-200 transition-colors">
                        <div className="p-3 rounded-lg bg-purple-50 text-purple-600 group-hover:bg-purple-100 transition-colors">
                            <Clock size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Sessions</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                {student.slots.length}
                            </h3>
                        </div>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="sessions" className="w-full">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
                    <TabsList className="bg-slate-100/50 dark:bg-slate-800/50 p-1">
                        <TabsTrigger value="sessions" className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm">Session Log</TabsTrigger>
                        <TabsTrigger value="history" className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm">Credit History</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="sessions" className="mt-0 space-y-4">
                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
                        <Table>
                            <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="w-[200px] text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</TableHead>
                                    <TableHead className="w-[150px] text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</TableHead>
                                    <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tutor Notes</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {student.slots.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center h-32 text-slate-500">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Clock className="text-slate-200" size={32} />
                                                <p>No sessions recorded yet.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    student.slots.map((s) => (
                                        <SessionRow key={s.id} slot={s} />
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                <TabsContent value="history" className="mt-0">
                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
                        <Table>
                            <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</TableHead>
                                    <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</TableHead>
                                    <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</TableHead>
                                    <TableHead className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {student.transactions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center h-32 text-slate-500">
                                            No recent transactions.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    student.transactions.map((t) => (
                                        <TableRow key={t.id} className="hover:bg-slate-50/50">
                                            <TableCell className="font-medium text-slate-600">
                                                {format(t.createdAt, "MMM d, yyyy h:mm a")}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-600 hover:bg-slate-200">
                                                    {t.type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-slate-500 text-sm">
                                                {t.description || "-"}
                                            </TableCell>
                                            <TableCell className={`text-right font-bold font-mono ${t.amount > 0 ? "text-emerald-600" : "text-slate-900"}`}>
                                                {t.amount > 0 ? "+" : ""}{t.amount}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
