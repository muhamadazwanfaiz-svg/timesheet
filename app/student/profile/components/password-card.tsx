"use client";

import { useTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lock, Loader2 } from "lucide-react";
import { changePassword } from "@/app/actions/auth";
import { toast } from "sonner";

export function PasswordCard() {
    const [isPending, startTransition] = useTransition();
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("password", password);

        startTransition(async () => {
            try {
                await changePassword(formData);
                toast.success("Password updated successfully");
                setPassword("");
            } catch (error) {
                toast.error("Failed to update password");
            }
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Lock size={20} className="text-indigo-600" />
                    Security
                </CardTitle>
                <CardDescription>Update your password.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">New Password</label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Min. 6 characters"
                            minLength={6}
                            required
                        />
                    </div>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Change Password
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
