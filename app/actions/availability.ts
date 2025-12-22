"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

import { cookies } from "next/headers";

async function requireAdmin() {
    const cookieStore = await cookies();
    const isAdmin = cookieStore.get("admin_session")?.value === "true";
    if (!isAdmin) throw new Error("Unauthorized");
}

export async function getSlots(date: Date, endDate?: Date) {
    // Get slots for a specific date or range
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = endDate ? new Date(endDate) : new Date(date);
    end.setHours(23, 59, 59, 999);

    return await prisma.slot.findMany({
        where: {
            startTime: {
                gte: start,
                lte: end,
            },
        },
        include: { student: true }, // See who booked it
        orderBy: { startTime: "asc" },
    });
}

export async function createSlot(startTime: Date, endTime: Date) {
    await requireAdmin();
    // Validate basic logic
    if (startTime >= endTime) {
        throw new Error("End time must be after start time");
    }

    await prisma.slot.create({
        data: {
            startTime,
            endTime,
        },
    });

    revalidatePath("/admin/availability");
    revalidatePath("/book");
}

export async function deleteSlot(id: string) {
    await requireAdmin();
    await prisma.slot.delete({
        where: { id },
    });

    revalidatePath("/admin/availability");
    revalidatePath("/book");
}

export async function generateRecurringSlots(
    days: number[], // 0=Sun, 1=Mon, ...
    time: string, // "14:00"
    durationMinutes: number,
    startDateStr: string,
    endDateStr: string
) {
    await requireAdmin();
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    const [hour, minute] = time.split(":").map(Number);

    // Safety check
    if (isNaN(hour) || isNaN(minute)) throw new Error("Invalid time format");

    const slotsToCreate = [];

    // Loop loop loop
    const current = new Date(startDate);
    // Reset time part of current loop pointer to avoid drift, though we only check date part for loop
    current.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    while (current <= endDate) {
        if (days.includes(current.getDay())) {
            // It's a match!
            const slotStart = new Date(current);
            slotStart.setHours(hour, minute, 0, 0);

            const slotEnd = new Date(slotStart);
            slotEnd.setMinutes(slotEnd.getMinutes() + durationMinutes);

            const existing = await prisma.slot.findFirst({
                where: {
                    startTime: slotStart
                }
            });

            if (!existing) {
                slotsToCreate.push({
                    startTime: slotStart,
                    endTime: slotEnd,
                    status: "SCHEDULED"
                });
            }
        }
        // Next day
        current.setDate(current.getDate() + 1);
    }

    if (slotsToCreate.length > 0) {
        await prisma.slot.createMany({
            data: slotsToCreate
        });
    }

    revalidatePath("/admin/availability");
    revalidatePath("/book");

    return { created: slotsToCreate.length };
}
