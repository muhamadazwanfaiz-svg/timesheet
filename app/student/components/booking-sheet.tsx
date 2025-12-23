"use client";

import * as React from "react";
import { format } from "date-fns";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Loader2, Clock, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { getCalculatedSlots } from "@/app/actions/availability";
import { bookSession } from "@/app/actions/booking";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface BookingSheetProps {
    isOpen: boolean;
    onClose: () => void;
    selectedDate: Date | undefined;
    studentId: string;
    studentCredits: number;
}

interface CalculatedSlot {
    startTime: Date;
    endTime: Date;
    available: boolean;
}

export function BookingSheet({ isOpen, onClose, selectedDate, studentId, studentCredits }: BookingSheetProps) {
    const router = useRouter();
    const [slots, setSlots] = React.useState<CalculatedSlot[]>([]);
    const [loadingSlots, setLoadingSlots] = React.useState(false);
    const [selectedSlot, setSelectedSlot] = React.useState<CalculatedSlot | null>(null);
    const [booking, setBooking] = React.useState(false);
    const [successSlot, setSuccessSlot] = React.useState<CalculatedSlot | null>(null);

    // Helpers
    const generateCalendarUrl = (slot: CalculatedSlot) => {
        const start = slot.startTime.toISOString().replace(/-|:|\.\d\d\d/g, "");
        const end = slot.endTime.toISOString().replace(/-|:|\.\d\d\d/g, "");
        const title = encodeURIComponent("SEO Class with Tutor");
        const details = encodeURIComponent("Join via Zoom. Check your email for full details.");
        const guest = encodeURIComponent("venuslowshimin@gmail.com");

        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&add=${guest}`;
    };

    // Fetch slots when date changes
    React.useEffect(() => {
        if (isOpen && selectedDate) {
            fetchSlots(selectedDate);
            setSelectedSlot(null);
            setSuccessSlot(null); // Reset success state
        }
    }, [isOpen, selectedDate]);

    async function fetchSlots(date: Date) {
        setLoadingSlots(true);
        try {
            // Pass formatted string YYYY-MM-DD to avoid timezone shifts
            const dateStr = format(date, "yyyy-MM-dd");
            const data = await getCalculatedSlots(dateStr, studentId);
            setSlots(data);
        } catch (error) {
            console.error("Failed to fetch slots", error);
            toast.error("Could not load available times.");
        } finally {
            setLoadingSlots(false);
        }
    }

    async function handleConfirmBooking() {
        if (!selectedSlot) return;

        setBooking(true);
        try {
            const result = await bookSession(selectedSlot.startTime, studentId);
            if (!result.success) {
                throw new Error(result.error);
            }

            toast.success("Session booked successfully!", {
                icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
            });
            // Show Success State instead of closing
            setSuccessSlot(selectedSlot);
            router.refresh(); // Refresh dashboard data
        } catch (error: any) {
            toast.error(error.message || "Failed to book session");
        } finally {
            setBooking(false);
        }
    }

    if (!selectedDate) return null;

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent className="w-full sm:max-w-md overflow-y-auto">

                {/* SUCCESS STATE UI */}
                {successSlot ? (
                    <div className="flex flex-col h-full animate-in fade-in zoom-in-95 duration-300">
                        <SheetHeader className="mb-6 text-center">
                            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                            </div>
                            <SheetTitle className="text-2xl text-emerald-700">Booking Confirmed!</SheetTitle>
                            <SheetDescription>
                                You are all set for <span className="font-semibold text-slate-900">{format(successSlot.startTime, "EEEE, MMMM d")}</span>
                            </SheetDescription>
                        </SheetHeader>

                        <div className="space-y-6 flex-1">
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 text-center">
                                <p className="text-sm text-slate-500 uppercase tracking-wider mb-1">Time</p>
                                <p className="text-3xl font-bold text-slate-900">
                                    {format(successSlot.startTime, "h:mm a")}
                                </p>
                            </div>

                            <Button
                                className="w-full h-14 text-lg bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 rounded-xl relative overflow-hidden group animate-pulse-slow"
                                asChild
                            >
                                <a href={generateCalendarUrl(successSlot)} target="_blank" rel="noopener noreferrer">
                                    <span className="mr-2 group-hover:animate-bounce">📅</span>
                                    <span className="font-semibold">Add to Google Calendar</span>
                                </a>
                            </Button>

                            <p className="text-center text-sm text-slate-500 px-4 mt-4">
                                Please add this event to your Google Calendar to receive the meeting link.
                            </p>
                        </div>

                        <div className="mt-auto pt-6">
                            <Button variant="outline" className="w-full h-12" onClick={onClose}>
                                Close
                            </Button>
                        </div>
                    </div>
                ) : (
                    /* NORMAL BOOKING UI */
                    <>
                        <SheetHeader className="mb-6">
                            <SheetTitle>Book Session</SheetTitle>
                            <SheetDescription>
                                Available times for <span className="font-semibold text-slate-900">{format(selectedDate, "EEEE, MMMM d")}</span>
                            </SheetDescription>
                        </SheetHeader>

                        {loadingSlots ? (
                            <div className="flex flex-col items-center justify-center py-12 space-y-3">
                                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                                <p className="text-sm text-slate-500">Checking availability...</p>
                            </div>
                        ) : slots.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center space-y-3 border-2 border-dashed border-slate-100 rounded-xl">
                                <Clock className="w-10 h-10 text-slate-300" />
                                <div>
                                    <p className="font-medium text-slate-900">No slots available</p>
                                    <p className="text-sm text-slate-500">Please try selecting another date.</p>
                                </div>
                                <Button variant="outline" onClick={onClose}>Close</Button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-3">
                                    {slots.map((slot, i) => (
                                        <button
                                            key={i}
                                            disabled={!slot.available}
                                            onClick={() => slot.available && setSelectedSlot(slot)}
                                            className={cn(
                                                "relative flex flex-row items-center justify-center p-3 rounded-xl border transition-all duration-200 outline-none",
                                                !slot.available
                                                    ? "bg-slate-100 border-slate-100 text-slate-400 cursor-not-allowed opacity-80" // Booked Style
                                                    : selectedSlot === slot
                                                        ? "border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold shadow-sm focus:ring-2 focus:ring-indigo-500" // Selected Style
                                                        : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50 text-slate-700 focus:ring-2 focus:ring-indigo-500" // Available Style
                                            )}
                                        >
                                            <span className="text-sm">{format(slot.startTime, "h:mm a")}</span>
                                            {!slot.available && (
                                                <Loader2 className="ml-2 w-3 h-3 text-slate-400 opacity-0" /> // Spacer
                                            )}
                                            {!slot.available && (
                                                <div className="absolute right-3">
                                                    {/* Lock Icon */}
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-slate-400">
                                                        <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>

                                {selectedSlot && (
                                    <div className="pt-6 border-t border-slate-100 animate-in slide-in-from-bottom-2 fade-in duration-300">
                                        <div className="bg-slate-50 p-4 rounded-lg mb-4 space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-500">Time</span>
                                                <span className="font-medium text-slate-900">
                                                    {format(selectedSlot.startTime, "h:mm a")} - {format(selectedSlot.endTime, "h:mm a")}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-500">Cost</span>
                                                <span className="font-medium text-slate-900">1 Credit</span>
                                            </div>
                                        </div>

                                        <Button
                                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 text-base shadow-lg shadow-indigo-100"
                                            onClick={handleConfirmBooking}
                                            disabled={booking}
                                        >
                                            {booking ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Booking...
                                                </>
                                            ) : (
                                                "Confirm Booking"
                                            )}
                                        </Button>
                                        {studentCredits <= 0 && (
                                            <p className="text-xs text-red-500 text-center mt-2">
                                                Insufficient credits to book.
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}
