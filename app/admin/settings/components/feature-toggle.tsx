"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch"; // Assuming this exists or button
import { toast } from "sonner";
import { toggleSystemSetting } from "@/app/actions/settings";
import { Button } from "@/components/ui/button";

interface FeatureToggleProps {
    label: string;
    description: string;
    initialValue: boolean;
    settingKey: "showCommunity" | "showCourses" | "showSessions";
}

export function FeatureToggle({ label, description, initialValue, settingKey }: FeatureToggleProps) {
    const [isEnabled, setIsEnabled] = useState(initialValue);

    async function handleToggle() {
        const newValue = !isEnabled;

        // 1. Optimistic Update
        setIsEnabled(newValue);

        // 2. Show loading toast
        const toastId = toast.loading("Updating settings...");

        try {
            // 3. Call Server Action
            await toggleSystemSetting(settingKey, newValue);

            // 4. Success feedback
            toast.success("Settings saved", { id: toastId });
        } catch (error) {
            // 5. Revert on failure
            setIsEnabled(!newValue);
            toast.error("Failed to save settings", { id: toastId });
        }
    }

    return (
        <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {label}
                </label>
                <p className="text-sm text-slate-500">
                    {description}
                </p>
            </div>
            {/* Using standard Button for now to match previous design, or Switch if available. 
                The previous code used a Button that said "On" or "Off". 
                I will switch to a proper Toggle Switch UI as it's better UX for boolean states.
            */}
            <Button
                type="button"
                variant={isEnabled ? "default" : "outline"}
                size="sm"
                onClick={handleToggle}
                className={isEnabled ? "bg-indigo-600 hover:bg-indigo-700" : ""}
            >
                {isEnabled ? "On" : "Off"}
            </Button>
        </div>
    );
}
