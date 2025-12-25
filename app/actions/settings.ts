"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getSystemSettings() {
    let settings = await prisma.systemSettings.findFirst();

    if (!settings) {
        settings = await prisma.systemSettings.create({
            data: {
                showCommunity: false,
                showCourses: false,
                showSessions: true,
                showSeoNews: true,
                showRewards: true
            }
        });
    }

    return settings;
}

export async function toggleSystemSetting(
    key: "showCommunity" | "showCourses" | "showSessions" | "showSeoNews" | "showRewards",
    value: boolean
) {
    const settings = await getSystemSettings();

    await prisma.systemSettings.update({
        where: { id: settings.id },
        data: {
            [key]: value
        }
    });

    revalidatePath("/admin/settings");
    revalidatePath("/student"); // Revalidate student dashboard
}
