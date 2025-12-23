"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { updateStudentSettings } from "@/app/actions/students";
import { toast } from "sonner";
import { Settings } from "lucide-react";

interface EditStudentSettingsDialogProps {
    studentId: string;
    currentDuration: number;
}

export function EditStudentSettingsDialog({ studentId, currentDuration }: EditStudentSettingsDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [duration, setDuration] = useState(currentDuration.toString());

    async function handleSave() {
        setLoading(true);
        try {
            await updateStudentSettings(studentId, parseInt(duration));
            setOpen(false);
            toast.success("Settings updated");
        } catch (error) {
            toast.error("Failed to update settings");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Settings size={14} />
                    Settings
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Student Settings</DialogTitle>
                    <DialogDescription>
                        Configure booking rules for this student.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="duration" className="text-right">
                            Duration
                        </Label>
                        <Select value={duration} onValueChange={setDuration}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="60">1 Hour</SelectItem>
                                <SelectItem value="90">1.5 Hours</SelectItem>
                                <SelectItem value="120">2 Hours</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSave} disabled={loading}>
                        {loading ? "Saving..." : "Save changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
