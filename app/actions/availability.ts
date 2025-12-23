"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getViableStartTimes } from "@/app/lib/booking-logic";

async function requireAdmin() {
    const cookieStore = await cookies();
    const isAdmin = cookieStore.get("admin_session")?.value === "true";
    if (!isAdmin) throw new Error("Unauthorized");
}

export async function getAvailability(date: Date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    return await prisma.availability.findMany({
        where: {
            startTime: {
                gte: start,
                lte: end,
            },
        },
        orderBy: { startTime: "asc" },
    });
}

// Admin needs to see actual bookings
export async function getBookings(date: Date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    return await prisma.slot.findMany({
        where: {
            startTime: { gte: start, lte: end },
            status: { not: "CANCELED" }
        },
        include: { student: true },
        orderBy: { startTime: "asc" },
    });
}

export async function getCalculatedSlots(dateStr: string | Date, studentId?: string) {
    // Ensure we work with the string format to avoid timezone shifts
    // If a Date object is passed, convert to YYYY-MM-DD assuming it represents the correct local day requested
    const targetDateStr = typeof dateStr === 'string'
        ? dateStr
        : dateStr.toISOString().split('T')[0];

    // Create start/end range for this specific date in UTC
    // new Date("YYYY-MM-DD") creates UTC midnight
    const start = new Date(targetDateStr);
    // Explicitly ensure valid date
    if (isNaN(start.getTime())) throw new Error("Invalid date provided");

    const end = new Date(start);
    end.setUTCHours(23, 59, 59, 999);

    const availability = await prisma.availability.findMany({
        where: {
            startTime: { gte: start, lte: end },
        },
    });

    // 2. Get existing bookings (Slots) for the day
    // Note: Bookings might overlap into this day from previous day, or into next.
    // Ideally we fetch a bit wider range, but for now simple day query.
    const bookings = await prisma.slot.findMany({
        where: {
            startTime: { gte: start, lte: end },
            status: { not: "CANCELED" }
        },
    });

    // 3. Determine Duration
    let durationMinutes = 60; // Default
    if (studentId) {
        const student = await prisma.student.findUnique({ where: { id: studentId } });
        if (student) durationMinutes = student.defaultDurationMinutes;
    }

    // 4. Calculate
    const validStartTimes = getViableStartTimes(availability, bookings, durationMinutes);

    return validStartTimes.map(slot => ({
        startTime: slot.startTime,
        endTime: new Date(slot.startTime.getTime() + durationMinutes * 60000),
        available: slot.available
    }));
}

export async function createAvailability(startTime: Date, endTime: Date) {
    await requireAdmin();
    if (startTime >= endTime) throw new Error("End time must be after start time");

    await prisma.availability.create({
        data: {
            startTime,
            endTime
        }
    });

    revalidatePath("/admin/availability");
    revalidatePath("/book");
}

export async function deleteAvailability(id: string) {
    await requireAdmin();
    await prisma.availability.delete({ where: { id } });
    revalidatePath("/admin/availability");
    revalidatePath("/book");
}

export async function deleteSlot(id: string) {
    await requireAdmin();
    await prisma.slot.delete({ where: { id } });
    revalidatePath("/admin/availability");
    revalidatePath("/admin");
}

// Keeping this for now if admin wants to ensure specific recurring Availability
// Replaces the old createRecurringAvailability and the nested broken code
export async function generateRecurringSlots(
    days: number[], // 0=Sun, 1=Mon, ...
    startTime: string, // "14:00"
    durationMinutes: number,
    startDateStr: string,
    endDateStr: string
) {
    await requireAdmin();
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    // Parse start time
    const [startHour, startMinute] = startTime.split(":").map(Number);

    if (isNaN(startHour) || isNaN(startMinute)) {
        throw new Error("Invalid time format");
    }

    const availabilitiesToCreate = [];

    // Loop through dates
    const current = new Date(startDate);
    current.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    while (current <= endDate) {
        if (days.includes(current.getDay())) {
            // Create start time for this day
            const start = new Date(current);
            start.setHours(startHour, startMinute, 0, 0);

            // Calculate end time based on duration
            const end = new Date(start.getTime() + durationMinutes * 60000);

            if (start < end) {
                availabilitiesToCreate.push({
                    startTime: start,
                    endTime: end,
                });
            }
        }
        // Next day
        current.setDate(current.getDate() + 1);
    }

    if (availabilitiesToCreate.length > 0) {
        await prisma.availability.createMany({
            data: availabilitiesToCreate,
        });
    }

    revalidatePath("/admin/availability");
    revalidatePath("/book");

    return { created: availabilitiesToCreate.length };
}

