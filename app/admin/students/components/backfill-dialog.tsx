"use client";

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
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { toast } from "sonner";
import { History, Loader2 } from "lucide-react";
import { format } from "date-fns";

export function BackfillDialog({ studentId, studentName }: { studentId: string, studentName: string }) {
    const [open, setOpen] = useState(false);
    const [dates, setDates] = useState<Date[] | undefined>([]);
    const [loading, setLoading] = useState(false);

    async function handleBackfill() {
        if (!dates || dates.length === 0) return;

        setLoading(true);
        try {
            // Convert to YYYY-MM-DD strings to avoid timezone shifts
            const dateStrings = dates.map(d => format(d, "yyyy-MM-dd"));
            await backfillSessions(studentId, dateStrings);
            toast.success(`Successfully logged ${dates.length} past sessions.`);
            setOpen(false);
            setDates([]);
        } catch (error) {
            toast.error("Failed to backfill sessions.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <DialogTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-500 hover:text-indigo-600 hover:bg-slate-50 text-xs h-10 rounded-none font-medium"
                    >
                        <History className="mr-1.5 h-3.5 w-3.5" />
                        Backlog
                    </Button>
                </DialogTrigger>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Log Past Classes</DialogTitle>
                    <DialogDescription>
                        Select dates for classes {studentName} already attended.
                        Credits will be deducted automatically.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex justify-center py-4">
                    <Calendar
                        mode="multiple"
                        selected={dates}
                        onSelect={setDates}
                        className="rounded-md border shadow-sm"
                        disabled={(date) => date > new Date()} // Can't backfill future
                    />
                </div>

                <DialogFooter>
                    <div className="flex w-full items-center justify-between">
                        <span className="text-sm text-slate-500">
                            {dates?.length || 0} sessions selected
                        </span>
                        <Button onClick={handleBackfill} disabled={!dates?.length || loading} className="bg-indigo-600 hover:bg-indigo-700">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Confirm & Deduct
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
