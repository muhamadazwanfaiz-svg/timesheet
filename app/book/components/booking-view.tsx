"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { bookSlot } from "@/app/actions/booking";
import { toast } from "sonner";
import { Slot } from "@prisma/client";
import { format, addDays, isSameDay } from "date-fns";
import { ChevronRight, Clock, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookingViewProps {
    selectedDate: Date;
    slots: Slot[];
    startDate: Date; // The anchor for the 2-week view
    student: { id: string; name: string | null; email: string; credits: number };
    effectiveBalance: number;
}

export function BookingView({ selectedDate, slots, startDate, student, effectiveBalance }: BookingViewProps) {
    const router = useRouter();
    const [selectedSlot, setSelectedSlot] = React.useState<Slot | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [successSlot, setSuccessSlot] = React.useState<Slot | null>(null);

    // Generate next 14 days
    const next14Days = React.useMemo(() => {
        return Array.from({ length: 14 }).map((_, i) => addDays(startDate, i));
    }, [startDate]);

    // Group slots by date string for easy lookup
    const slotsByDate = React.useMemo(() => {
        const map = new Map<string, Slot[]>();
        slots.forEach((slot) => {
            const dayKey = format(slot.startTime, "yyyy-MM-dd");
            if (!map.has(dayKey)) map.set(dayKey, []);
            map.get(dayKey)!.push(slot);
        });
        return map;
    }, [slots]);

    // Filter slots for the CURRENTLY selected date
    const selectedDateSlots = React.useMemo(() => {
        const dayKey = format(selectedDate, "yyyy-MM-dd");
        const daysSlots = slotsByDate.get(dayKey) || [];
        // Only show free slots
        return daysSlots.filter(s => !s.studentId);
    }, [selectedDate, slotsByDate]);


    function onDateSelect(newDate: Date) {
        router.push(`?date=${newDate.toISOString()}`);
    }

    async function handleBook() {
        if (!selectedSlot) return;
        setLoading(true);
        try {
            await bookSlot(selectedSlot.id, student.id); // Passing ID instead of email now
            setSuccessSlot(selectedSlot);
            setSelectedSlot(null);
            toast.success("Booking confirmed!");
        } catch (e: any) {
            toast.error(e.message || "Booking failed");
        } finally {
            setLoading(false);
        }
    }

    function getGoogleCalendarLink(slot: Slot) {
        const text = encodeURIComponent("Tutoring Session");
        const dates = `${format(slot.startTime, "yyyyMMdd'T'HHmmss")}/${format(slot.endTime, "yyyyMMdd'T'HHmmss")}`;
        const details = encodeURIComponent("Tutoring session with your instructor.");
        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}`;
    }

    return (
        <div className="flex flex-col md:flex-row max-w-6xl mx-auto gap-0 md:gap-8 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 h-[600px] md:h-[700px]">

            {/* LEFT SIDE: Date Picker */}
            <div className="w-full md:w-1/3 bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col">
                <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">Select a Date</h2>
                    <p className="text-sm text-slate-500">Next 2 weeks</p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                    {next14Days.map((date) => {
                        const dayKey = format(date, "yyyy-MM-dd");
                        const hasAvailability = (slotsByDate.get(dayKey)?.filter(s => !s.studentId).length || 0) > 0;
                        const isSelected = isSameDay(date, selectedDate);

                        return (
                            <button
                                key={date.toISOString()}
                                onClick={() => onDateSelect(date)}
                                disabled={!hasAvailability} // Optional: disable days with 0 slots? Or let them click to see empty state? 
                                // Requirements asked to "show date according to allocated free time".
                                // Calendly usually Greys out unavailable.
                                className={cn(
                                    "w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-200 group relative",
                                    isSelected
                                        ? "bg-white dark:bg-slate-800 border-indigo-600 dark:border-indigo-500 shadow-md ring-1 ring-indigo-600 dark:ring-indigo-500 z-10"
                                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-sm",
                                    !hasAvailability && !isSelected && "opacity-50 grayscale cursor-not-allowed bg-slate-50 dark:bg-slate-950/50"
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "flex flex-col items-center justify-center w-12 h-14 rounded-lg font-bold text-sm",
                                        isSelected ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                                    )}>
                                        <span className="text-xs uppercase opacity-70">{format(date, "EEE")}</span>
                                        <span className="text-lg">{format(date, "d")}</span>
                                    </div>
                                    <div className="text-left">
                                        <div className={cn("font-medium", isSelected ? "text-indigo-900 dark:text-indigo-100" : "text-slate-700 dark:text-slate-300")}>
                                            {format(date, "MMMM")}
                                        </div>
                                        {(hasAvailability || isSelected) && (
                                            <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                                                {hasAvailability ? "Available" : "No slots"}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {isSelected && <ChevronRight className="text-indigo-600 w-5 h-5 animate-in fade-in slide-in-from-left-2" />}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* RIGHT SIDE: Time Slots */}
            <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 relative">
                <div className="p-6 md:p-10 flex-1 overflow-y-auto w-full max-w-2xl mx-auto">
                    <div className="sticky top-0 bg-white dark:bg-slate-900 z-10 pb-6 mb-2">
                        <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-800 dark:text-slate-100">
                            {format(selectedDate, "EEEE, MMMM do")}
                        </h2>
                        <p className="text-slate-500 mt-1">
                            {selectedDateSlots.length > 0 ? "Select a time to book" : "No available times for this date"}
                        </p>
                    </div>

                    {successSlot ? (
                        <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-2xl p-8 text-center animate-in zoom-in-95 duration-300">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CalendarDays size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-green-900 dark:text-green-100 mb-2">Booking Confirmed!</h3>
                            <p className="text-green-700 dark:text-green-300 mb-6 text-lg">
                                {format(successSlot.startTime, "h:mm a")} - {format(successSlot.endTime, "h:mm a")}
                            </p>
                            <Button asChild className="bg-green-600 hover:bg-green-700 text-white rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-green-500/20">
                                <a href={getGoogleCalendarLink(successSlot)} target="_blank" rel="noopener noreferrer">
                                    Add to Google Calendar
                                </a>
                            </Button>
                            <Button variant="ghost" onClick={() => setSuccessSlot(null)} className="mt-4 block mx-auto text-green-700 hover:text-green-800 hover:bg-green-100/50">
                                Book Another
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-3 pb-8">
                            {selectedDateSlots.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                                    <Clock size={48} className="mb-4 opacity-20" />
                                    <p>No slots available.</p>
                                </div>
                            ) : (
                                selectedDateSlots.map((slot) => {
                                    const canBook = effectiveBalance > 0;
                                    return (
                                        <Button
                                            key={slot.id}
                                            variant="outline"
                                            disabled={!canBook}
                                            className={cn(
                                                "group relative h-auto py-5 px-6 flex items-center justify-between border-slate-200 dark:border-slate-800 transition-all duration-200 rounded-xl",
                                                canBook
                                                    ? "hover:border-indigo-600 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 cursor-pointer"
                                                    : "opacity-60 cursor-not-allowed bg-slate-50 dark:bg-slate-800/50"
                                            )}
                                            onClick={() => canBook && setSelectedSlot(slot)}
                                        >
                                            <span className="text-xl font-bold text-slate-700 dark:text-slate-200 group-hover:text-indigo-700 dark:group-hover:text-indigo-300">
                                                {format(slot.startTime, "h:mm a")}
                                            </span>
                                            {canBook ? (
                                                <span className="text-sm font-medium text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                                    to {format(slot.endTime, "h:mm a")}
                                                </span>
                                            ) : (
                                                <span className="text-sm font-medium text-amber-600 dark:text-amber-500 flex items-center gap-1">
                                                    Need Credits
                                                </span>
                                            )}
                                            {canBook && <div className="absolute inset-0 rounded-xl ring-2 ring-indigo-600 opacity-0 group-hover:opacity-10 transition-opacity" />}
                                        </Button>
                                    );
                                })
                            )}
                        </div>
                    )}
                </div>
            </div>

            <Dialog open={!!selectedSlot} onOpenChange={(open) => !open && setSelectedSlot(null)}>
                <DialogContent className="sm:max-w-md rounded-2xl">
                    <DialogHeader className="space-y-3">
                        <DialogTitle className="text-2xl">Confirm Booking</DialogTitle>
                        <DialogDescription className="text-base">
                            Booking for <span className="font-semibold text-slate-900 dark:text-slate-100">{selectedSlot && format(selectedSlot.startTime, "h:mm a")}</span> on {selectedSlot && format(selectedSlot.startTime, "MMMM do")}.
                            <br />
                            <span className="text-sm text-slate-500 mt-2 block">
                                Configured for: <span className="font-medium text-indigo-600">{student.email}</span>
                            </span>
                        </DialogDescription>
                    </DialogHeader>
                    {/* Removed Email Input */}
                    <DialogFooter className="gap-2 sm:gap-0 mt-4">
                        <Button variant="ghost" onClick={() => setSelectedSlot(null)} className="h-12">
                            Cancel
                        </Button>
                        <Button onClick={handleBook} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 h-12 px-6">
                            {loading ? "Confirming..." : "Confirm Booking"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
