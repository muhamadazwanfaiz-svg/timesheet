import { getSystemSettings } from "@/app/actions/settings";
import { FeatureToggle } from "./components/feature-toggle";
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

                        <FeatureToggle
                            label="Community Tab"
                            description="Show the 'Community' link in student sidebar."
                            initialValue={settings.showCommunity}
                            settingKey="showCommunity"
                        />

                        <FeatureToggle
                            label="Courses Tab"
                            description="Show the 'Courses' link in student sidebar."
                            initialValue={settings.showCourses}
                            settingKey="showCourses"
                        />

                        <FeatureToggle
                            label="Sessions Tab"
                            description="Show the 'Sessions' link in student sidebar."
                            initialValue={settings.showSessions}
                            settingKey="showSessions"
                        />

                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
