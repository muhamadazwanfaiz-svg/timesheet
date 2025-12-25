"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CalendarPlus } from "lucide-react";
import { toast } from "sonner";
import { adminBookSession } from "@/app/actions/admin";

interface StudentOption {
    id: string;
    name: string;
    email: string;
}

export function ManualBookingDialog({ students }: { students: StudentOption[] }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form State
    const [selectedStudent, setSelectedStudent] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");

    async function handleBook() {
        if (!selectedStudent || !date || !time) {
            toast.error("Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            // Combine date and time
            const dateTime = new Date(`${date}T${time}`);

            await adminBookSession(selectedStudent, dateTime);

            toast.success("Class created successfully!");
            setOpen(false);

            // Reset form
            setSelectedStudent("");
            setDate("");
            setTime("");
        } catch (e: any) {
            toast.error(e.message || "Failed to book session");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="block w-full p-4 text-center rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 hover:border-indigo-500 hover:text-indigo-600 transition font-bold text-indigo-700 dark:text-indigo-300 flex items-center justify-center gap-2">
                    <CalendarPlus className="w-5 h-5" />
                    Create a Class
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Manual Class Booking</DialogTitle>
                    <DialogDescription>
                        Book a session on behalf of a student. This will deduct 1 credit.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label>Student</Label>
                        <Select onValueChange={setSelectedStudent} value={selectedStudent}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select student..." />
                            </SelectTrigger>
                            <SelectContent>
                                {students.map((s) => (
                                    <SelectItem key={s.id} value={s.id}>
                                        {s.name} ({s.email})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Date</Label>
                            <Input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                min={new Date().toISOString().split("T")[0]}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Time</Label>
                            <Input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handleBook} disabled={loading}>
                        {loading ? "Booking..." : "Book Session"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
