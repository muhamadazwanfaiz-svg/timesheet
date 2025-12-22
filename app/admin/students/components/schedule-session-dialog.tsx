"use client";

import { useState } from "react";
import { Calendar as CalendarIcon, Loader2, Plus } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
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
import { cn } from "@/lib/utils";
import { scheduleSession } from "@/app/actions/students";
import { toast } from "sonner";

export function ScheduleSessionDialog({ studentId, trigger }: { studentId: string, trigger?: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<Date>();
    const [time, setTime] = useState("10:00");
    const [duration, setDuration] = useState("60");
    const [loading, setLoading] = useState(false);

    async function handleSchedule() {
        if (!date || !time) return;

        setLoading(true);
        try {
            const [hours, minutes] = time.split(":").map(Number);
            const scheduledDate = new Date(date);
            scheduledDate.setHours(hours, minutes, 0, 0);

            await scheduleSession(studentId, scheduledDate, parseInt(duration));
            setOpen(false);
            toast.success("Session scheduled successfully");
        } catch (error) {
            toast.error("Failed to schedule session");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button size="icon" variant="ghost" className="h-6 w-6 rounded-full hover:bg-indigo-100 text-indigo-600">
                        <Plus size={14} />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Schedule New Session</DialogTitle>
                    <DialogDescription>
                        Set a date, time, and duration for the upcoming class.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label>Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                    className="pointer-events-auto"
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Time</Label>
                            <Select value={time} onValueChange={setTime}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Time" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="09:00">9:00 AM</SelectItem>
                                    <SelectItem value="09:30">9:30 AM</SelectItem>
                                    <SelectItem value="10:00">10:00 AM</SelectItem>
                                    <SelectItem value="10:30">10:30 AM</SelectItem>
                                    <SelectItem value="11:00">11:00 AM</SelectItem>
                                    <SelectItem value="11:30">11:30 AM</SelectItem>
                                    <SelectItem value="12:00">12:00 PM</SelectItem>
                                    <SelectItem value="13:00">1:00 PM</SelectItem>
                                    <SelectItem value="14:00">2:00 PM</SelectItem>
                                    <SelectItem value="15:00">3:00 PM</SelectItem>
                                    <SelectItem value="16:00">4:00 PM</SelectItem>
                                    <SelectItem value="17:00">5:00 PM</SelectItem>
                                    <SelectItem value="18:00">6:00 PM</SelectItem>
                                    <SelectItem value="19:00">7:00 PM</SelectItem>
                                    <SelectItem value="20:00">8:00 PM</SelectItem>
                                    <SelectItem value="21:00">9:00 PM</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Duration</Label>
                            <Select value={duration} onValueChange={setDuration}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Duration" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="30">30 Mins</SelectItem>
                                    <SelectItem value="45">45 Mins</SelectItem>
                                    <SelectItem value="60">1 Hour</SelectItem>
                                    <SelectItem value="90">1.5 Hours</SelectItem>
                                    <SelectItem value="120">2 Hours</SelectItem>
                                    <SelectItem value="180">3 Hours</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSchedule} disabled={!date || loading} className="bg-indigo-600 hover:bg-indigo-700">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Schedule
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
