"use client";

import { completeSession } from "@/app/actions/booking";
import { updateClassNotes } from "@/app/actions/notes";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle2, ArrowRight, FileText, Edit2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

import { EditSessionDialog } from "@/app/admin/components/edit-session-dialog";

export function SlotActions({ slotId, status, startTime }: { slotId: string; status: string; startTime: Date }) {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [notes, setNotes] = useState("");
    const [saving, setSaving] = useState(false);

    async function handleComplete() {
        if (!confirm("Confirm session completion? This will deduct 1 credit.")) return;
        setLoading(true);
        try {
            await completeSession(slotId);
            toast.success("Session completed & credit deducted");
        } catch (e) {
            toast.error("Failed to update session");
        } finally {
            setLoading(false);
        }
    }

    async function handleSaveNotes() {
        setSaving(true);
        try {
            await updateClassNotes(slotId, notes);
            toast.success("Notes saved");
            setOpen(false);
        } catch (e) {
            toast.error("Failed to save notes");
        } finally {
            setSaving(false);
        }
    }

    if (status === "COMPLETED") {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200">
                        <CheckCircle2 size={14} className="mr-1" />
                        Completed
                        <Edit2 size={12} className="ml-2 opacity-50" />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Class Notes</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Key Takeaways & Homework</Label>
                            <Textarea
                                placeholder="What did we cover today?"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="min-h-[150px]"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleSaveNotes} disabled={saving}>
                            {saving ? "Saving..." : "Save Notes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <EditSessionDialog slotId={slotId} currentStartTime={startTime} />
            <Button
                size="sm"
                variant="outline"
                className="h-8 gap-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200"
                onClick={handleComplete}
                disabled={loading}
            >
                <CheckCircle2 size={14} />
                {loading ? "..." : "Complete"}
            </Button>
        </div>
    );
}
