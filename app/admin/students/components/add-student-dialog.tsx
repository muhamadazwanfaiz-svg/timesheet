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
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { createStudent } from "@/app/actions/students";
import { toast } from "sonner";
import { Plus } from "lucide-react";

export function AddStudentDialog() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    async function onSubmit(formData: FormData) {
        setLoading(true);
        try {
            await createStudent(formData);
            setOpen(false);
            toast.success("Student added successfully");
        } catch (error) {
            toast.error("Failed to add student");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="mr-2 h-4 w-4" /> Add Student
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Student</DialogTitle>
                    <DialogDescription>
                        Enter the student's details here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <form action={onSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="John Doe"
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                Email
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="john@example.com"
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="module" className="text-right">
                                Module
                            </Label>
                            <Input
                                id="module"
                                name="module"
                                placeholder="SEO Basics"
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="initialCredits" className="text-right">
                                Package
                            </Label>
                            <Select name="initialCredits" defaultValue="0">
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select starting credits" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0">None (0 Credits)</SelectItem>
                                    <SelectItem value="1">Trial (1 Credit)</SelectItem>
                                    <SelectItem value="4">Basic (4 Credits)</SelectItem>
                                    <SelectItem value="8">Pro (8 Credits)</SelectItem>
                                    <SelectItem value="12">Premium (12 Credits)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="defaultDurationMinutes" className="text-right">
                                Duration
                            </Label>
                            <Select name="defaultDurationMinutes" defaultValue="60">
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select session duration" />
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
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Save changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
