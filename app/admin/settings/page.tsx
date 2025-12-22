import { getSystemSettings, toggleSystemSetting } from "@/app/actions/settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { revalidatePath } from "next/cache";

export default async function AdminSettingsPage() {
    const settings = await getSystemSettings();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
                <p className="text-slate-500">Global configuration for the student portal.</p>
            </div>

            <div className="grid gap-6 max-w-2xl">
                <Card>
                    <CardHeader>
                        <CardTitle>Feature Toggles</CardTitle>
                        <CardDescription>Control which sections are visible to students.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">

                        {/* Toggle: Community */}
                        <div className="flex items-center justify-between space-x-2">
                            <div className="space-y-0.5">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Community Tab
                                </label>
                                <p className="text-sm text-slate-500">
                                    Show the "Community" link in student sidebar.
                                </p>
                            </div>
                            <form action={async () => {
                                "use server";
                                await toggleSystemSetting("showCommunity", !settings.showCommunity);
                            }}>
                                <Button
                                    type="submit"
                                    variant={settings.showCommunity ? "default" : "outline"}
                                    size="sm"
                                >
                                    {settings.showCommunity ? "On" : "Off"}
                                </Button>
                            </form>
                        </div>

                        {/* Toggle: Courses */}
                        <div className="flex items-center justify-between space-x-2">
                            <div className="space-y-0.5">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Courses Tab
                                </label>
                                <p className="text-sm text-slate-500">
                                    Show the "Courses" link in student sidebar.
                                </p>
                            </div>
                            <form action={async () => {
                                "use server";
                                await toggleSystemSetting("showCourses", !settings.showCourses);
                            }}>
                                <Button
                                    type="submit"
                                    variant={settings.showCourses ? "default" : "outline"}
                                    size="sm"
                                >
                                    {settings.showCourses ? "On" : "Off"}
                                </Button>
                            </form>
                        </div>

                        {/* Toggle: Sessions */}
                        <div className="flex items-center justify-between space-x-2">
                            <div className="space-y-0.5">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Sessions Tab
                                </label>
                                <p className="text-sm text-slate-500">
                                    Show the "Sessions" link in student sidebar.
                                </p>
                            </div>
                            <form action={async () => {
                                "use server";
                                await toggleSystemSetting("showSessions", !settings.showSessions);
                            }}>
                                <Button
                                    type="submit"
                                    variant={settings.showSessions ? "default" : "outline"}
                                    size="sm"
                                >
                                    {settings.showSessions ? "On" : "Off"}
                                </Button>
                            </form>
                        </div>

                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
