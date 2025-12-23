"use client";

import { useState } from "react";
import { completeSession } from "@/app/actions/students";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function CompleteSessionButton({ slotId }: { slotId: string }) {
    const [loading, setLoading] = useState(false);

    async function handleComplete() {
        setLoading(true);
        try {
            await completeSession(slotId);
            toast.success("Session marked as complete. Credits deducted.");
        } catch (error) {
            toast.error("Failed to mark session complete");
        } finally {
            setLoading(false);
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 px-2 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900"
                >
                    Mark Complete
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Mark Session as Complete?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will change the status to "COMPLETED" and deduct 1 credit from the student's balance.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleComplete}
                        className="bg-indigo-600 hover:bg-indigo-700"
                        disabled={loading}
                    >
                        {loading ? "Completing..." : "Confirm Complete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
