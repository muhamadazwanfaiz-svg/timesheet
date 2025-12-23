"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { areIntervalsOverlapping } from "date-fns";
import { getAvailability } from "./availability";

// NEW: Dynamic Booking Action
export async function bookSession(startTime: Date, studentId: string) {
    // 1. Find student & get duration
    const student = await prisma.student.findUnique({
        where: { id: studentId },
    });

    if (!student) throw new Error("Student not found.");

    const durationMinutes = student.defaultDurationMinutes; // e.g. 60 or 90
    const endTime = new Date(new Date(startTime).getTime() + durationMinutes * 60000);

    // 2. Check Credits
    // 3. Check Availability Window
    // 4. Check Collision

    const activeReservations = await prisma.slot.count({
        where: { studentId: student.id, status: "SCHEDULED" }
    });

    if (activeReservations >= student.credits) {
        throw new Error(`Insufficient credits. You have ${student.credits} credits and ${activeReservations} active bookings.`);
    }

    // Check Availability (Must be fully within an availability window)
    const availabilityWindows = await prisma.availability.findMany({
        where: {
            startTime: { lte: startTime },
            endTime: { gte: endTime }
        }
    });

    if (availabilityWindows.length === 0) {
        throw new Error("Selected time is not within available hours.");
    }

    // Check Collisions (Must not overlap with any existing slot)
    const collision = await prisma.slot.findFirst({
        where: {
            status: { not: "CANCELED" },
            OR: [
                {
                    startTime: { lt: endTime },
                    endTime: { gt: startTime }
                }
            ]
        }
    });

    if (collision) {
        throw new Error("This slot is already booked.");
    }

    // 5. Create Booking
    const newSlot = await prisma.slot.create({
        data: {
            startTime,
            endTime,
            studentId: student.id,
            status: "SCHEDULED"
        }
    });

    // 6. Send Email
    try {
        const { sendBookingConfirmation } = await import("./email");
        // Fire and forget (don't await to keep UI fast? Or await to ensure sent?)
        // Let's await to be safe, or run in background. 
        // Next.js server actions can block. Let's await but catch errors so we don't rollback DB.
        await sendBookingConfirmation(newSlot.id);
    } catch (e) {
        console.error("Failed to send confirmation email:", e);
    }

    revalidatePath("/book");
    revalidatePath("/admin/availability");
}


// DEPRECATED: Old fixed slot booking
export async function bookSlot(slotId: string, studentId: string) {
    throw new Error("This booking method is deprecated.");
}

export async function completeSession(slotId: string) {
    const slot = await prisma.slot.findUnique({
        where: { id: slotId },
        include: { student: true }
    });

    if (!slot || !slot.studentId) throw new Error("Invalid slot");

    // Atomic transaction: Mark Complete + Deduct Credit + Log Transaction
    await prisma.$transaction([
        prisma.slot.update({
            where: { id: slotId },
            data: { status: "COMPLETED" }
        }),
        prisma.student.update({
            where: { id: slot.studentId },
            data: { credits: { decrement: 1 } }
        }),
        prisma.creditTransaction.create({
            data: {
                studentId: slot.studentId,
                amount: -1,
                type: "SESSION_BOOKING",
                description: `Session completed: ${slot.startTime.toISOString()}`
            }
        })
    ]);

    // TODO: Trigger Feedback Email here

    revalidatePath("/admin");
    revalidatePath("/admin/availability");
}
