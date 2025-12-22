"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Trash2, Plus, Coins } from "lucide-react";
import { deleteStudent, addCredits } from "@/app/actions/students";
import { toast } from "sonner";
import { Student } from "@prisma/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface StudentTableProps {
    students: Student[];
}

export function StudentTable({ students }: StudentTableProps) {
    async function handleDelete(id: string) {
        if (confirm("Are you sure you want to delete this student?")) {
            try {
                await deleteStudent(id);
                toast.success("Student deleted");
            } catch (error) {
                toast.error("Failed to delete student");
            }
        }
    }

    return (
        <div className="rounded-md border bg-white dark:bg-slate-900 shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Credits</TableHead>
                        <TableHead>Module</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {students.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                No students found. Add one to get started.
                            </TableCell>
                        </TableRow>
                    ) : (
                        students.map((student) => (
                            <TableRow key={student.id}>
                                <TableCell className="font-medium">
                                    <Link href={`/admin/students/${student.id}`} className="hover:underline text-indigo-600 dark:text-indigo-400 font-semibold">
                                        {student.name}
                                    </Link>
                                </TableCell>
                                <TableCell>{student.email}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <span className={`font-mono font-bold ${student.credits > 0 ? "text-emerald-600" : "text-slate-400"}`}>
                                            {student.credits}
                                        </span>
                                        <AddCreditsPopover studentId={student.id} currentName={student.name} />
                                    </div>
                                </TableCell>
                                <TableCell>{student.module || "N/A"}</TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/10"
                                        onClick={() => handleDelete(student.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}


function AddCreditsPopover({ studentId, currentName }: { studentId: string; currentName: string }) {
    const router = useRouter(); // Import this
    const [amount, setAmount] = useState("1");
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleAdd() {
        const val = parseInt(amount);
        if (isNaN(val) || val <= 0) return toast.error("Invalid amount");

        setLoading(true);
        try {
            await addCredits(studentId, val);
            toast.success(`Added ${val} credits to ${currentName}`);
            setOpen(false);
            setAmount("1");
            router.refresh(); // Force refresh to update UI
        } catch (e) {
            toast.error("Failed to add credits");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-full">
                    <Plus size={14} />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-4" align="start">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Top Up Credits</h4>
                        <p className="text-xs text-muted-foreground">Add classes to {currentName}'s balance.</p>
                    </div>
                    <div className="flex gap-2">
                        <Input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="h-8"
                            min={1}
                        />
                        <Button size="sm" onClick={handleAdd} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 h-8">
                            {loading ? "..." : "Add"}
                        </Button>
                    </div>
                    <div className="flex gap-2 justify-between">
                        {[1, 5, 10].map(val => (
                            <Button key={val} variant="outline" size="sm" className="h-7 px-2 text-xs" onClick={() => setAmount(val.toString())}>
                                +{val}
                            </Button>
                        ))}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
