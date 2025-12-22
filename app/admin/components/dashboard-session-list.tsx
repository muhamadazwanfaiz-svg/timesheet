"use client";

import { format } from "date-fns";
import { SlotActions } from "@/app/admin/components/slot-actions";
import { Slot, Student } from "@prisma/client";

interface SlotWithStudent extends Slot {
    student: Student | null;
}

export function DashboardSessionList({ sessions }: { sessions: SlotWithStudent[] }) {
    if (sessions.length === 0) {
        return (
            <div className="p-12 text-center text-slate-500">
                No upcoming sessions booked.
            </div>
        );
    }

    return (
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {sessions.map((slot) => (
                <div key={slot.id} className="p-6 flex items-center gap-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                    <div className="flex flex-col items-center justify-center w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                        <span className="text-xs font-semibold uppercase text-slate-500">
                            {format(new Date(slot.startTime), "MMM")}
                        </span>
                        <span className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                            {format(new Date(slot.startTime), "d")}
                        </span>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            {slot.student?.name || "Unknown Student"}
                            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                                Confirmed
                            </span>
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                            {format(new Date(slot.startTime), "h:mm a")} - {format(new Date(slot.endTime), "h:mm a")}
                        </p>
                    </div>
                    <SlotActions slotId={slot.id} status={slot.status} />
                </div>
            ))}
        </div>
    );
}
