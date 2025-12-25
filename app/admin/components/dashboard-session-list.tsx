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
            {sessions.map((slot) => {
                const now = new Date();
                const start = new Date(slot.startTime);
                const end = new Date(slot.endTime);
                const isLive = start <= now && end > now;

                return (
                    <div key={slot.id} className={`p-6 flex items-center gap-6 transition-all ${isLive ? "bg-emerald-50/50 dark:bg-emerald-900/10 border-l-4 border-l-emerald-500 pl-5" : "hover:bg-slate-50 dark:hover:bg-slate-800/50"}`}>
                        <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl border ${isLive ? "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900 dark:text-emerald-400 dark:border-emerald-800" : "bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700"}`}>
                            <span className="text-xs font-semibold uppercase opacity-70">{format(start, "MMM")}</span>
                            <span className="text-2xl font-bold">{format(start, "d")}</span>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                {slot.student?.name || "Unknown Student"}
                                {isLive ? (
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500 text-white font-bold animate-pulse shadow-sm">
                                        LIVE
                                    </span>
                                ) : (
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                                        Confirmed
                                    </span>
                                )}
                            </h3>
                            <p className={`${isLive ? "text-emerald-700 dark:text-emerald-400 font-medium" : "text-slate-500 dark:text-slate-400"} text-sm mt-1`}>
                                {format(start, "h:mm a")} - {format(end, "h:mm a")}
                            </p>
                        </div>
                        <SlotActions slotId={slot.id} status={slot.status} startTime={start} />
                    </div>
                );
            })}
        </div>
    );
}
