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
    const [endTime, setEndTime] = React.useState("10:00");
    const [loading, setLoading] = React.useState(false);

    // Handle date change
    function onDateSelect(newDate: Date | undefined) {
        if (newDate) {
            router.push(`?date=${newDate.toISOString()}`);
        }
    }

    async function handleAddSlot() {
        setLoading(true);
        try {
            // Construct Date objects from the time strings + current selected date
            const [startH, startM] = startTime.split(":").map(Number);
            const [endH, endM] = endTime.split(":").map(Number);

            const start = new Date(date);
            start.setHours(startH, startM, 0, 0);

            const end = new Date(date);
            end.setHours(endH, endM, 0, 0);

            if (start >= end) {
                toast.error("Invalid time info");
                return;
            }

            await createSlot(start, end);
            toast.success("Slot added");
        } catch (e) {
            toast.error("Failed to add slot");
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
                            selected={date}
                            onSelect={onDateSelect}
                            className="rounded-md border shadow-none w-full flex justify-center"
                        />
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Manage Slots for {format(date, "MMMM d, yyyy")}
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
                                <label className="text-sm font-medium">End Time</label>
                                <Input
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                />
                            </div>
                            <Button onClick={handleAddSlot} disabled={loading}>
                                {loading ? "Adding..." : "Add Slot"}
                            </Button>
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
                                                <div className="font-medium font-mono text-sm">
                                                    {format(slot.startTime, "h:mm a")} -{" "}
                                                    {format(slot.endTime, "h:mm a")}
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
