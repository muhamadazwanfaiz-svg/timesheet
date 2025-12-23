"use client";

import * as React from "react";
import { format, addDays } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { bookSession } from "@/app/actions/booking";
import { toast } from "sonner";
import { Student } from "@prisma/client";
import { Clock, Calendar as CalendarIcon, ArrowRight, Loader2 } from "lucide-react";

interface CalculatedSlot {
    startTime: Date;
    endTime: Date;
    available: boolean;
}

interface BookingViewProps {
    date: Date;
    student: Student;
    slots: CalculatedSlot[];
}

export function BookingView({ date, student, slots }: BookingViewProps) {
    const router = useRouter();
    const [selectedSlot, setSelectedSlot] = React.useState<CalculatedSlot | null>(null);
    const [booking, setBooking] = React.useState(false);
    const [optimisticDate, setOptimisticDate] = React.useState(date);

    // Sync optimistic/local date with server date
    React.useEffect(() => {
        setOptimisticDate(date);
    }, [date]);

    // Handle date change
    function onDateSelect(newDate: Date | undefined) {
        if (newDate) {
            setOptimisticDate(newDate); // Instant UI update
            setSelectedSlot(null);
            router.push(`/book?date=${format(newDate, "yyyy-MM-dd")}`);
        }
    }

    async function handleBook() {
        if (!selectedSlot) return;

        setBooking(true);
        try {
            await bookSession(selectedSlot.startTime, student.id);
            toast.success("Session booked successfully!");
            setSelectedSlot(null);
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || "Failed to book session");
        } finally {
            setBooking(false);
        }
    }

    // Credits check
    const hasCredits = student.credits > 0;

    return (
        <div className="grid md:grid-cols-[380px_1fr] gap-8 items-start max-w-6xl mx-auto">
            {/* Left Column: Calendar & Summary */}
            <div className="space-y-6">
                <Card className="border-0 shadow-lg bg-white/50 backdrop-blur-sm dark:bg-slate-900/50 overflow-hidden">
                    <CardContent className="p-0">
                        <Calendar
                            mode="single"
                            selected={optimisticDate}
                            onSelect={onDateSelect}
                            disabled={(date) => date < addDays(new Date(), -1)}
                            className="p-6 w-full flex justify-center pointer-events-auto"
                            classNames={{
                                head_cell: "text-slate-500 font-medium text-[0.875rem]",
                                cell: "h-10 w-10 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-slate-100/50 [&:has([aria-selected])]:bg-slate-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                                day: cn(
                                    "h-10 w-10 p-0 font-normal aria-selected:opacity-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-full transition-all duration-200"
                                ),
                                day_selected:
                                    "bg-indigo-600 text-white hover:bg-indigo-600 hover:text-white focus:bg-indigo-600 focus:text-white shadow-md shadow-indigo-200",
                                day_today: "bg-slate-100 text-slate-900 font-bold",
                            }}
                        />
                    </CardContent>
                </Card>

                {/* Selected Slot Summary Card */}
                <div className={`transition-all duration-500 ease-in-out ${selectedSlot ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
                    {selectedSlot && (
                        <Card className="border-indigo-100 shadow-xl shadow-indigo-100/50 dark:shadow-none dark:border-indigo-900/50 overflow-hidden relative group">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
                            <CardContent className="p-6">
                                <h3 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4">
                                    <CalendarIcon className="w-4 h-4 text-indigo-500" />
                                    Booking Summary
                                </h3>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-800">
                                        <span className="text-sm text-slate-500">Date</span>
                                        <span className="font-medium text-slate-900 dark:text-slate-200">
                                            {format(selectedSlot.startTime, "EEEE, MMMM d")}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-800">
                                        <span className="text-sm text-slate-500">Time</span>
                                        <div className="text-right">
                                            <span className="block font-bold text-indigo-600 dark:text-indigo-400">
                                                {format(selectedSlot.startTime, "h:mm a")} - {format(selectedSlot.endTime, "h:mm a")}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center py-3">
                                        <span className="text-sm text-slate-500">Cost</span>
                                        <span className="font-medium text-slate-900 dark:text-slate-200">
                                            1 Credit
                                        </span>
                                    </div>

                                    <Button
                                        size="lg"
                                        className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 dark:shadow-none transition-all duration-200"
                                        onClick={handleBook}
                                        disabled={booking || !hasCredits}
                                    >
                                        {booking ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Confirming...
                                            </>
                                        ) : hasCredits ? (
                                            <>
                                                Confirm Booking
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </>
                                        ) : (
                                            "Insufficient Credits"
                                        )}
                                    </Button>
                                    {!hasCredits && (
                                        <p className="text-xs text-center text-red-500 mt-2">
                                            Please acquire more credits to book.
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Right Column: Time Slots */}
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                            Available Time
                        </h2>
                        {/* We use 60 as fallback if defaultDurationMinutes is null */}
                        <p className="text-slate-500 dark:text-slate-400 mt-1">
                            Select a start time for your {(student as any).defaultDurationMinutes ?? 60} min session
                        </p>
                    </div>
                </div>

                {slots.length === 0 ? (
                    <Card className="border-dashed border-2 border-slate-200 dark:border-slate-800 bg-transparent">
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-4">
                                <Clock className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                                No slots available
                            </h3>
                            <p className="text-slate-500 max-w-xs mx-auto">
                                There are no available time slots for this date. Please try selecting another day.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {slots.map((slot, i) => (
                            <Button
                                key={i}
                                variant="outline"
                                onClick={() => setSelectedSlot(slot)}
                                className={cn(
                                    "h-auto py-4 px-4 flex flex-col items-center justify-center border-slate-200 dark:border-slate-800 transition-all duration-200 rounded-xl hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/10",
                                    selectedSlot === slot && "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/10 ring-2 ring-indigo-600 ring-offset-2 dark:ring-offset-slate-950"
                                )}
                            >
                                <span className="text-lg font-bold text-slate-700 dark:text-slate-200">
                                    {format(slot.startTime, "h:mm a")}
                                </span>
                                <span className="text-xs font-medium text-slate-500 mt-1">
                                    to {format(slot.endTime, "h:mm a")}
                                </span>
                            </Button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
