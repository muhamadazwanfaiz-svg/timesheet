"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function adminBookSession(studentId: string, date: Date, durationMinutes: number = 60) {
    console.log(`Admin booking session for ${studentId} at ${date}`);

    // 1. Validation
    if (!studentId || !date) throw new Error("Missing required fields");

    const startTime = new Date(date);
    const endTime = new Date(startTime.getTime() + durationMinutes * 60 * 1000);

    // 2. Check for Conflicts (Tutor Availability)
    // We check if there's already a slot that overlaps specifically.
    // Allow override? For now, let's just throw error if strictly creating a double booking.
    const conflict = await prisma.slot.findFirst({
        where: {
            OR: [
                { startTime: { lte: startTime }, endTime: { gt: startTime } }, // Starts during another
                { startTime: { lt: endTime }, endTime: { gte: endTime } }      // Ends during another
            ],
            status: { not: "CANCELED" }
        }
    });

    if (conflict) {
        // We could return a warning, but for safety lets block
        throw new Error("This time slot overlaps with an existing session.");
    }

    // 3. Get Student & Check Credits
    const student = await prisma.student.findUnique({
        where: { id: studentId }
    });

    if (!student) throw new Error("Student not found");

    // 4. Create Slot & Transaction
    await prisma.$transaction(async (tx) => {
        // Create Slot
        const newSlot = await tx.slot.create({
            data: {
                studentId,
                startTime,
                endTime,
                status: "SCHEDULED",
                classNotes: "Manually booked by Admin",
            }
        });

        // Deduct Credit (Even if 0, goes to -1)
        await tx.student.update({
            where: { id: studentId },
            data: { credits: { decrement: 1 } }
        });

        // Log Transaction
        await tx.creditTransaction.create({
            data: {
                studentId,
                amount: -1,
                type: "SESSION_BOOKING",
                description: `Manual booking by Admin for ${startTime.toDateString()}`
            }
        });

        // 5. Send Email
        try {
            // Dynamic import to avoid circular dep issues if any
            const { sendBookingConfirmation } = await import("./email");
            await sendBookingConfirmation(newSlot.id);
        } catch (e) {
            console.error("Failed to send email", e);
            // Don't fail the transaction just for email
        }
    });

    revalidatePath("/admin");
    revalidatePath("/admin/students");
    revalidatePath("/student");
    revalidatePath("/student");
    revalidatePath("/student/sessions");
    return { success: true };
}

export async function updateSessionTime(slotId: string, newDate: Date, durationMinutes: number = 60) {
    if (!slotId || !newDate) throw new Error("Missing required fields");

    const startTime = new Date(newDate);
    const endTime = new Date(startTime.getTime() + durationMinutes * 60 * 1000);

    // 1. Check for Conflicts (exclude current slot)
    const conflict = await prisma.slot.findFirst({
        where: {
            id: { not: slotId }, // Exclude self
            OR: [
                { startTime: { lte: startTime }, endTime: { gt: startTime } },
                { startTime: { lt: endTime }, endTime: { gte: endTime } }
            ],
            status: { not: "CANCELED" }
        }
    });

    if (conflict) {
        throw new Error("This time slot overlaps with another existing session.");
    }

    // 2. Update Slot
    await prisma.slot.update({
        where: { id: slotId },
        data: {
            startTime,
            endTime
        }
    });

    // 3. Email Notification (Optional but good)
    // We could send a "Rescheduled" email here.

    revalidatePath("/admin");
    revalidatePath("/admin/students");
    revalidatePath("/student");
    revalidatePath("/student/sessions"); // Ensure student sees new time immediately

    return { success: true };
}
