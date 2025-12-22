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

    // Calculate total spent (just for fun stats)
    const totalSpent = student.transactions
        .filter((t) => t.amount < 0)
        .reduce((acc, t) => acc + Math.abs(t.amount), 0);

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/students"
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition"
                >
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                        {student.name}
                    </h1>
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <Mail size={14} />
                        {student.email}
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
                    <div className="p-4 rounded-xl bg-blue-50 text-blue-600">
                        <CreditCard size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Current Balance</p>
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                            {student.credits} <span className="text-sm font-normal text-slate-400">credits</span>
                        </h3>
                    </div>
                </div>
                <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
                    <div className="p-4 rounded-xl bg-purple-50 text-purple-600">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Total Sessions</p>
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                            {totalSpent}
                        </h3>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="history" className="w-full">
                <TabsList>
                    <TabsTrigger value="history">Credit History</TabsTrigger>
                    <TabsTrigger value="sessions">Session Log</TabsTrigger>
                    {/* Future: <TabsTrigger value="notes">Private Notes</TabsTrigger> */}
                </TabsList>

                <TabsContent value="history" className="mt-6">
                    <div className="rounded-md border bg-white dark:bg-slate-900">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {student.transactions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center h-24 text-slate-500">
                                            No recent transactions.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    student.transactions.map((t) => (
                                        <TableRow key={t.id}>
                                            <TableCell className="font-medium">
                                                {format(t.createdAt, "MMM d, yyyy h:mm a")}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="text-xs">
                                                    {t.type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-slate-500">
                                                {t.description || "-"}
                                            </TableCell>
                                            <TableCell className={`text-right font-bold ${t.amount > 0 ? "text-emerald-600" : "text-red-600"}`}>
                                                {t.amount > 0 ? "+" : ""}{t.amount}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                <TabsContent value="sessions" className="mt-6">
                    <div className="rounded-md border bg-white dark:bg-slate-900">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Notes</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {student.slots.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center h-24 text-slate-500">
                                            No sessions found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    student.slots.map((s) => (
                                        <TableRow key={s.id}>
                                            <TableCell className="font-medium">
                                                {format(s.startTime, "MMM d, yyyy h:mm a")}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={
                                                    s.status === "COMPLETED" ? "bg-emerald-500" :
                                                        s.status === "SCHEDULED" ? "bg-blue-500" : "bg-slate-500"
                                                }>
                                                    {s.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-slate-500">
                                                <SessionNotesEditor slotId={s.id} initialNotes={s.classNotes} />
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
