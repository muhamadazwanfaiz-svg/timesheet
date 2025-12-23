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
import { addCredits } from "@/app/actions/students";
import { toast } from "sonner";
import { PlusCircle } from "lucide-react";

interface AddCreditDialogProps {
    studentId: string;
    studentName: string;
}

export function AddCreditDialog({ studentId, studentName }: AddCreditDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState("4");

    async function handleSave() {
        setLoading(true);
        try {
            const result = await addCredits(studentId, parseInt(amount));
            if (!result.success) {
                toast.error(result.error);
                return;
            }
            setOpen(false);
            toast.success(`Added ${amount} credits to ${studentName}`);
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 text-xs h-8 px-2 font-medium"
                >
                    <PlusCircle className="mr-1.5 h-3.5 w-3.5" />
                    Add Credits
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Top Up Credits</DialogTitle>
                    <DialogDescription>
                        Add credits to <strong>{studentName}</strong>'s balance.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="credits" className="text-right">
                            Package
                        </Label>
                        <Select value={amount} onValueChange={setAmount}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select amount" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">1 Credit (Trial)</SelectItem>
                                <SelectItem value="4">4 Credits (Basic)</SelectItem>
                                <SelectItem value="8">8 Credits (Pro)</SelectItem>
                                <SelectItem value="12">12 Credits (Premium)</SelectItem>
                                <SelectItem value="20">20 Credits (Enterprise)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSave} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700">
                        {loading ? "Adding..." : "Confirm Top Up"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
