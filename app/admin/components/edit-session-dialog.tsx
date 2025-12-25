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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, CalendarClock } from "lucide-react";
import { toast } from "sonner";
import { updateSessionTime } from "@/app/actions/admin";
import { format } from "date-fns";

interface EditSessionDialogProps {
    slotId: string;
    currentStartTime: Date; // Keep as string or Date depending on serialization, but Date preferred if hydration works
}

export function EditSessionDialog({ slotId, currentStartTime }: EditSessionDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Initialize with current values
    // Note: This relies on currentStartTime being a valid Date object or convertible string
    const start = new Date(currentStartTime);

    // Format for input type="date" (YYYY-MM-DD) and type="time" (HH:mm)
    // Careful with timezone offsets when converting to string for inputs
    // A safe way for local editing is to use string manipulation or date-fns format
    const [date, setDate] = useState(format(start, "yyyy-MM-dd"));
    const [time, setTime] = useState(format(start, "HH:mm"));

    async function handleUpdate() {
        setLoading(true);
        try {
            const dateTime = new Date(`${date}T${time}`);

            await updateSessionTime(slotId, dateTime);

            toast.success("Session rescheduled successfully");
            setOpen(false);
        } catch (e: any) {
            toast.error(e.message || "Failed to reschedule");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-indigo-600">
                    <Edit className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Reschedule Session</DialogTitle>
                    <DialogDescription>
                        Change the date and time for this session.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>New Date</Label>
                            <Input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                min={new Date().toISOString().split("T")[0]}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>New Time</Label>
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
                    <Button onClick={handleUpdate} disabled={loading}>
                        {loading ? "Updating..." : "Update Session"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
