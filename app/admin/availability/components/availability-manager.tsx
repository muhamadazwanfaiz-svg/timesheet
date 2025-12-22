"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createSlot, deleteSlot } from "@/app/actions/availability";
import { toast } from "sonner";
import { Slot, Student } from "@prisma/client";
import { format } from "date-fns";
import { Trash2, User } from "lucide-react";

interface SlotWithStudent extends Slot {
    student: Student | null;
}

interface AvailabilityManagerProps {
    date: Date;
    slots: SlotWithStudent[];
}

export function AvailabilityManager({ date, slots }: AvailabilityManagerProps) {
    const router = useRouter();
    const [startTime, setStartTime] = React.useState("09:00");
    const [duration, setDuration] = React.useState("60");
    const [isRecurring, setIsRecurring] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const [optimisticDate, setOptimisticDate] = React.useState(date);

    // Sync optimistic/local date with server date
    React.useEffect(() => {
        setOptimisticDate(date);
    }, [date]);

    // Handle date change
    function onDateSelect(newDate: Date | undefined) {
        if (newDate) {
            setOptimisticDate(newDate); // Instant UI update
            router.push(`?date=${format(newDate, "yyyy-MM-dd")}`);
        }
    }

    async function handleAddSlot() {
        setLoading(true);
        try {
            // Construct Date objects from the time strings + current selected date
            const [startH, startM] = startTime.split(":").map(Number);
            const durationMins = parseInt(duration);

            const start = new Date(date);
            start.setHours(startH, startM, 0, 0);

            const end = new Date(start);
            end.setMinutes(start.getMinutes() + durationMins);

            if (start >= end) {
                toast.error("Invalid time info");
                return;
            }

            // Default to 4 weeks if recurring is checked
            const recurrenceWeeks = isRecurring ? 4 : 0;
            await createSlot(start, end, recurrenceWeeks);
            toast.success(isRecurring ? "Recurring slots added" : "Slot added");
        } catch (e: any) {
            toast.error(e.message || "Failed to add slot");
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: string) {
        try {
            await deleteSlot(id);
            toast.success("Slot removed");
        } catch (e) {
            toast.error("Failed to remove slot");
        }
    }

    return (
        <div className="grid md:grid-cols-[300px_1fr] gap-8">
            <div>
                <Card>
                    <CardContent className="p-0">
                        <Calendar
                            mode="single"
                            selected={optimisticDate}
                            onSelect={onDateSelect}
                            className="rounded-md border shadow-none w-full flex justify-center"
                        />
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle suppressHydrationWarning>
                            Manage Slots for {format(optimisticDate, "MMMM d, yyyy")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end gap-3 mb-6">
                            <div className="grid gap-1.5 flex-1">
                                <label className="text-sm font-medium">Start Time</label>
                                <Input
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-1.5 flex-1">
                                <label className="text-sm font-medium">Duration</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-indigo-800"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                >
                                    <option value="30">30 Minutes</option>
                                    <option value="45">45 Minutes</option>
                                    <option value="60">1 Hour</option>
                                    <option value="90">1.5 Hours</option>
                                    <option value="120">2 Hours</option>
                                    <option value="180">3 Hours</option>
                                </select>
                            </div>
                            <Button onClick={handleAddSlot} disabled={loading}>
                                {loading ? "Adding..." : "Add Slot"}
                            </Button>
                        </div>

                        <div className="flex items-center space-x-2 -mt-2 mb-6 ml-1">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="recurring"
                                    checked={isRecurring}
                                    onChange={(e) => setIsRecurring(e.target.checked)}
                                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
                                />
                                <label
                                    htmlFor="recurring"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-slate-600"
                                >
                                    Repeat Weekly (next 4 weeks)
                                </label>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-medium text-sm text-slate-500">
                                {slots.length} Available Slots
                            </h3>

                            {slots.length === 0 ? (
                                <div className="text-sm text-slate-400 italic">
                                    No slots added for this day.
                                </div>
                            ) : (
                                <div className="grid gap-3">
                                    {slots.map((slot) => (
                                        <div
                                            key={slot.id}
                                            className={`flex items-center justify-between p-3 rounded-lg border ${slot.studentId
                                                ? "bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800"
                                                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="font-medium font-mono text-sm" suppressHydrationWarning>
                                                    {format(new Date(slot.startTime), "h:mm a")} -{" "}
                                                    {format(new Date(slot.endTime), "h:mm a")}
                                                </div>
                                                {slot.student && (
                                                    <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-sm">
                                                        <User size={14} />
                                                        <span>Booked by {slot.student.name}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(slot.id)}
                                                className="text-slate-400 hover:text-red-500"
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
