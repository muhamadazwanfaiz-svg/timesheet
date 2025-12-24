"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { addDays } from "date-fns";
import { BookingSheet } from "./booking-sheet";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardBookingWidgetProps {
    studentId: string;
    studentName: string;
    studentCredits: number;
}

export function DashboardBookingWidget({ studentId, studentName, studentCredits }: DashboardBookingWidgetProps) {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    const [isSheetOpen, setIsSheetOpen] = React.useState(false);

    // Don't allow selecting past dates
    const disabledDays = (date: Date) => date < addDays(new Date(), -1);

    function handleDateSelect(newDate: Date | undefined) {
        setDate(newDate);
        if (newDate) {
            setIsSheetOpen(true);
        }
    }

    return (
        <div className="space-y-6 lg:sticky lg:top-24">
            {/* Interactive Calendar Title */}
            <div className="flex items-center justify-between px-1">
                <h3 className="text-sm uppercase tracking-wider text-slate-500 font-semibold">Quick Book</h3>
            </div>

            <Card className="border-0 shadow-sm bg-white/50 backdrop-blur-sm overflow-hidden ring-1 ring-slate-200/50">
                <CardContent className="p-0 flex justify-center pt-2 pb-2">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleDateSelect}
                        disabled={disabledDays}
                        className="rounded-md border-0 w-full flex justify-center"
                        classNames={{
                            head_cell: "text-slate-400 font-medium text-[0.8rem]",
                            cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                            day: cn(
                                "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-slate-100 rounded-full transition-all duration-200"
                            ),
                            day_selected:
                                "bg-indigo-600 text-white hover:bg-indigo-600 hover:text-white focus:bg-indigo-600 focus:text-white shadow-md shadow-indigo-200",
                            day_today: "bg-slate-100 text-slate-900 font-bold",
                        }}
                    />
                </CardContent>
            </Card>

            <Button
                onClick={() => setIsSheetOpen(true)}
                className="w-full h-14 text-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-200 dark:shadow-none transition-all hover:scale-[1.02]"
            >
                Book New Session
                <ArrowRight className="ml-2 h-5 w-5 opacity-50" />
            </Button>

            <BookingSheet
                isOpen={isSheetOpen}
                onClose={() => setIsSheetOpen(false)}
                selectedDate={date}
                studentId={studentId}
                studentName={studentName}
                studentCredits={studentCredits}
            />
        </div>
    );
}
