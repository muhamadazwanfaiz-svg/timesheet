"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createAvailability, deleteAvailability, deleteSlot } from "@/app/actions/availability";
import { toast } from "sonner";
import { Slot, Availability, Student } from "@prisma/client";
import { format } from "date-fns";
import { Trash2, User, Clock } from "lucide-react";

interface SlotWithStudent extends Slot {
    student: Student | null;
}

interface AvailabilityManagerProps {
    date: Date;
    availability: Availability[];
    bookings: SlotWithStudent[];
}

export function AvailabilityManager({ date, availability, bookings }: AvailabilityManagerProps) {
    const router = useRouter();
    const [startTime, setStartTime] = React.useState("19:00");
    const [endTime, setEndTime] = React.useState("22:00");
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

    async function handleAddAvailability() {
        setLoading(true);
        try {
            const [startH, startM] = startTime.split(":").map(Number);
            const [endH, endM] = endTime.split(":").map(Number);

            const start = new Date(date);
            start.setHours(startH, startM, 0, 0);

            const end = new Date(date);
            end.setHours(endH, endM, 0, 0);

            if (start >= end) {
                toast.error("End time must be after start time");
                return;
            }

            await createAvailability(start, end);
            toast.success("Availability added");
        } catch (e: any) {
            toast.error(e.message || "Failed to add availability");
        } finally {
            setLoading(false);
        }
    }

    async function handleDeleteAvailability(id: string) {
        try {
            await deleteAvailability(id);
            toast.success("Availability removed");
        } catch (e) {
            toast.error("Failed to remove availability");
        }
    }

    async function handleCancelBooking(id: string) {
        if (!confirm("Are you sure you want to cancel this booking?")) return;
        try {
            await deleteSlot(id); // Using deleteSlot to cancel/remove the booking
            toast.success("Booking cancelled");
        } catch (e) {
            toast.error("Failed to cancel booking");
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

            <div className="space-y-8">
                {/* 1. Add Availability Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Manage Availability for {format(optimisticDate, "MMMM d, yyyy")}</CardTitle>
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
                            <Button onClick={handleAddAvailability} disabled={loading}>
                                {loading ? "Adding..." : "Add Availability"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* 2. List Availability Ranges */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        Availability Windows
                    </h3>
                    {availability.length === 0 ? (
                        <p className="text-slate-500 italic">No availability set for this day.</p>
                    ) : (
                        <div className="grid gap-3">
                            {availability.map((range) => (
                                <div key={range.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border rounded-lg">
                                    <span className="font-mono font-medium">
                                        {format(new Date(range.startTime), "h:mm a")} - {format(new Date(range.endTime), "h:mm a")}
                                    </span>
                                    <Button variant="ghost" size="sm" onClick={() => handleDeleteAvailability(range.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 3. List Actual Bookings */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Confirmed Bookings
                    </h3>
                    {bookings.length === 0 ? (
                        <p className="text-slate-500 italic">No bookings yet.</p>
                    ) : (
                        <div className="grid gap-3">
                            {bookings.map((slot) => (
                                <div key={slot.id} className="flex items-center justify-between p-4 bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800 rounded-lg">
                                    <div>
                                        <div className="font-mono font-bold text-indigo-900 dark:text-indigo-100">
                                            {format(new Date(slot.startTime), "h:mm a")} - {format(new Date(slot.endTime), "h:mm a")}
                                        </div>
                                        {slot.student && (
                                            <div className="text-sm text-indigo-600 dark:text-indigo-300 mt-1">
                                                {slot.student.name} ({slot.student.email})
                                            </div>
                                        )}
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => handleCancelBooking(slot.id)} className="text-slate-400 hover:text-red-500">
                                        Cancel
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

