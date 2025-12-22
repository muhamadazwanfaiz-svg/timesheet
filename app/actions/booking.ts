"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function bookSlot(slotId: string, studentId: string) {
    // 1. Find student
    const student = await prisma.student.findUnique({
        where: { id: studentId },
    });

    if (!student) {
        throw new Error("Student not found.");
    }

    // 2. Check if student has credits available (Reservation Model)
    // Count ONLY slots that are "SCHEDULED" (active reservations). 
    // Completed/Canceled slots don't count against the limit (though Completed are deducted normally).
    const activeReservations = await prisma.slot.count({
        where: {
            studentId: student.id,
            status: "SCHEDULED"
        }
    });

    if (activeReservations >= student.credits) {
        throw new Error(`Insufficient credits. You have ${student.credits} credits and ${activeReservations} active bookings.`);
    }

    // 3. Check if slot is free
    const slot = await prisma.slot.findUnique({
        where: { id: slotId },
    });

    if (!slot) throw new Error("Slot not found");
    if (slot.studentId) throw new Error("Slot already booked");

    // 4. Book it
    await prisma.slot.update({
        where: { id: slotId },
        data: {
            studentId: student.id,
            status: "SCHEDULED" // Explicitly set status
        },
    });

    // 5. Send Email Confirmation with ICS
    try {
        const { sendBookingConfirmation } = await import("./calendar");
        await sendBookingConfirmation(slotId);
    } catch (e) {
        console.error("Failed to send confirmation email:", e);
    }

    revalidatePath("/book");
    revalidatePath("/admin/availability");
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
