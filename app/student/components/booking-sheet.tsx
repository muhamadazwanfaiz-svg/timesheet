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

    // Fetch slots when date changes
    React.useEffect(() => {
        if (isOpen && selectedDate) {
            fetchSlots(selectedDate);
            setSelectedSlot(null);
        }
    }, [isOpen, selectedDate]);

    async function fetchSlots(date: Date) {
        setLoadingSlots(true);
        try {
            const data = await getCalculatedSlots(date, studentId);
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
            await bookSession(selectedSlot.startTime, studentId);
            toast.success("Session booked successfully!", {
                icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
            });
            onClose();
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
                                    onClick={() => setSelectedSlot(slot)}
                                    className={cn(
                                        "relative flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                                        selectedSlot === slot
                                            ? "border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold shadow-sm"
                                            : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50 text-slate-700"
                                    )}
                                >
                                    <span className="text-sm">{format(slot.startTime, "h:mm a")}</span>
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
            </SheetContent>
        </Sheet>
    );
}
