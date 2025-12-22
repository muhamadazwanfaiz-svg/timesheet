"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { generateRecurringSlots } from "@/app/actions/availability";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

const DAYS = [
    { label: "Sunday", value: 0 },
    { label: "Monday", value: 1 },
    { label: "Tuesday", value: 2 },
    { label: "Wednesday", value: 3 },
    { label: "Thursday", value: 4 },
    { label: "Friday", value: 5 },
    { label: "Saturday", value: 6 },
];

export function RecurringDialog() {
    const [open, setOpen] = useState(false);
    const [selectedDays, setSelectedDays] = useState<number[]>([]);
    const [time, setTime] = useState("09:00");
    const [duration, setDuration] = useState(60);
    const [weeks, setWeeks] = useState(4);
    const [loading, setLoading] = useState(false);

    const toggleDay = (day: number) => {
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter(d => d !== day));
        } else {
            setSelectedDays([...selectedDays, day]);
        }
    };

    const handleGenerate = async () => {
        if (selectedDays.length === 0) {
            toast.error("Please select at least one day.");
            return;
        }

        setLoading(true);
        try {
            const startDate = new Date();
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + (weeks * 7));

            const result = await generateRecurringSlots(
                selectedDays,
                time,
                duration,
                startDate.toISOString(),
                endDate.toISOString()
            );

            toast.success(`Generated ${result.created} slots!`);
            setOpen(false);
        } catch (e) {
            console.error(e);
            toast.error("Failed to generate slots");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Recurring Slots
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Generate Recurring Slots</DialogTitle>
                    <DialogDescription>
                        Auomatically create slots for the next few weeks. Duplicates will be skipped.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label>Days of Week</Label>
                        <div className="flex flex-wrap gap-2">
                            {DAYS.map((day) => (
                                <button
                                    key={day.value}
                                    onClick={() => toggleDay(day.value)}
                                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${selectedDays.includes(day.value)
                                            ? "bg-indigo-600 text-white border-indigo-600"
                                            : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
                                        }`}
                                >
                                    {day.label.slice(0, 3)}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Time</Label>
                            <Input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Duration (min)</Label>
                            <Input
                                type="number"
                                value={duration}
                                onChange={(e) => setDuration(Number(e.target.value))}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>How many weeks ahead?</Label>
                        <Input
                            type="number"
                            value={weeks}
                            onChange={(e) => setWeeks(Number(e.target.value))}
                            min={1}
                            max={12}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleGenerate} disabled={loading}>
                        {loading ? "Generating..." : "Generate Slots"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
