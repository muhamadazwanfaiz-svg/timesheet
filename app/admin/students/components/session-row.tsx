"use client";

import { format } from "date-fns";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { SessionNotesEditor } from "./session-notes-editor";
import { DeleteSessionButton } from "./delete-session-button";
import { Slot } from "@prisma/client";

interface SessionRowProps {
    slot: Slot;
}

export function SessionRow({ slot }: SessionRowProps) {
    const start = new Date(slot.startTime);

    return (
        <TableRow className="group hover:bg-slate-50/50 transition-colors">
            {/* Date Column - Client Side Formatted for Local Time */}
            <TableCell className="font-medium text-slate-700 dark:text-slate-200 align-top py-4">
                <div className="flex flex-col">
                    <span>{format(start, "MMM d, yyyy")}</span>
                    <span className="text-xs text-slate-400 font-normal">{format(start, "h:mm a")}</span>
                </div>
            </TableCell>

            {/* Status Column */}
            <TableCell className="align-top py-4">
                <Badge variant="outline" className={
                    slot.status === "COMPLETED" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                        slot.status === "SCHEDULED" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-slate-50 text-slate-600"
                }>
                    {slot.status}
                </Badge>
            </TableCell>

            {/* Notes Column - Handles expansion gracefully */}
            <TableCell className="align-top py-4">
                <SessionNotesEditor slotId={slot.id} initialNotes={slot.classNotes} />
            </TableCell>

            {/* Actions Column */}
            <TableCell className="align-top py-4 text-right">
                <DeleteSessionButton slotId={slot.id} />
            </TableCell>
        </TableRow>
    );
}
