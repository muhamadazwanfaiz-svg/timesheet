"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getStudents() {
    return await prisma.student.findMany({
        orderBy: [
            { credits: "asc" },
            { name: "asc" }
        ],
        include: { slots: true },
    });
}

export async function getStudentDetails(id: string) {
    return await prisma.student.findUnique({
        where: { id },
        include: {
            slots: {
                orderBy: { startTime: "desc" },
            },
            transactions: {
                orderBy: { createdAt: "desc" },
            },
        },
    });
}

export async function createStudent(data: FormData) {
    const name = data.get("name") as string;
    const email = data.get("email") as string;
    const module = data.get("module") as string;
    const initialCredits = Number(data.get("initialCredits") || 0);
    const defaultDurationMinutes = Number(data.get("defaultDurationMinutes") || 60);

    if (!name || !email) {
        throw new Error("Name and Email are required");
    }

    await prisma.$transaction(async (tx) => {
        const student = await tx.student.create({
            data: {
                name,
                email,
                module,
                credits: initialCredits,
                defaultDurationMinutes,
            },
        });

        if (initialCredits > 0) {
            await tx.creditTransaction.create({
                data: {
                    studentId: student.id,
                    amount: initialCredits,
                    type: "PURCHASE",
                    description: "Initial package assignment",
                },
            });
        }
    });

    revalidatePath("/admin/students");
}

export async function updateStudentSettings(studentId: string, durationMinutes: number) {
    await prisma.student.update({
        where: { id: studentId },
        data: { defaultDurationMinutes: durationMinutes }
    });
    revalidatePath(`/admin/students/${studentId}`);
    revalidatePath("/admin/students");
}

export async function deleteStudent(id: string) {
    await prisma.student.delete({
        where: { id },
    });

    revalidatePath("/admin/students");
}

export async function addCredits(studentId: string, amount: number) {
    console.log(`Adding ${amount} credits to student ${studentId}`);
    try {
        await prisma.$transaction(async (tx) => {
            const student = await tx.student.update({
                where: { id: studentId },
                data: {
                    credits: { increment: amount },
                },
            });

            await tx.creditTransaction.create({
                data: {
                    studentId,
                    amount,
                    type: "ADJUSTMENT",
                    description: "Manual credit adjustment by Admin",
                },
            });

            console.log(`Updated credits for ${student.email}: ${student.credits}`);
        });
    } catch (e) {
        console.error("Failed to add credits:", e);
        throw e;
    }

    revalidatePath("/admin/students");
}

export async function backfillSessions(studentId: string, dateStrings: string[]) {
    if (dateStrings.length === 0) return;

    await prisma.$transaction(async (tx) => {
        // 1. Create completed slots for each date
        for (const dateStr of dateStrings) {
            // dateStr is "YYYY-MM-DD". new Date(dateStr) creates UTC midnight.
            const startTime = new Date(dateStr);
            // Force it to 12:00 PM UTC to be safe in middle of day
            startTime.setUTCHours(12, 0, 0, 0);

            const endTime = new Date(startTime);
            endTime.setHours(startTime.getHours() + 1); // 1 hour duration

            await tx.slot.create({
                data: {
                    startTime,
                    endTime,
                    studentId,
                    status: "COMPLETED",
                    classNotes: "Backfilled Session",
                }
            });
        }

        // 2. Deduct credits
        const amount = dateStrings.length;
        await tx.student.update({
            where: { id: studentId },
            data: { credits: { decrement: amount } }
        });

        // 3. Log transaction
        await tx.creditTransaction.create({
            data: {
                studentId,
                amount: -amount,
                type: "DEDUCTION",
                description: `Backfill: Logged ${amount} past sessions`,
            }
        });
    });

    revalidatePath("/admin/students");
}

export async function deleteSession(slotId: string) {
    console.log(`Deleting session ${slotId}`);
    try {
        await prisma.$transaction(async (tx) => {
            const slot = await tx.slot.findUnique({
                where: { id: slotId }
            });

            if (!slot) throw new Error("Slot not found");

            // If it was a completed session (meaning credits were deducted), refund the credit
            if (slot.status === "COMPLETED") {
                await tx.student.update({
                    where: { id: slot.studentId! },
                    data: { credits: { increment: 1 } }
                });

                await tx.creditTransaction.create({
                    data: {
                        studentId: slot.studentId!,
                        amount: 1,
                        type: "REFUND",
                        description: `Refund: Session on ${slot.startTime.toDateString()} deleted`,
                    }
                });
            }

            // Delete the slot
            await tx.slot.delete({ where: { id: slotId } });
        });
    } catch (e) {
        console.error("Failed to delete session:", e);
        throw e;
    }
    revalidatePath("/admin/students");
}

export async function scheduleSession(studentId: string, date: Date, durationMinutes: number = 60) {
    await prisma.slot.create({
        data: {
            studentId,
            startTime: date,
            endTime: new Date(date.getTime() + durationMinutes * 60 * 1000),
            status: "SCHEDULED",
            classNotes: "",
        }
    });

    revalidatePath("/admin/students");
}

export async function completeSession(slotId: string) {
    console.log(`Marking session ${slotId} as complete`);

    // 1. Fetch slot to verify and get studentId
    const slot = await prisma.slot.findUnique({
        where: { id: slotId },
        include: { student: true }
    });

    if (!slot) throw new Error("Slot not found");
    if (!slot.studentId) throw new Error("Slot has no student assigned");

    // Allow re-completing if needed, but usually we check status.
    // if (slot.status !== "SCHEDULED") throw new Error("Session is not in SCHEDULED status");

    try {
        await prisma.$transaction(async (tx) => {
            // 2. Update Slot Status
            await tx.slot.update({
                where: { id: slotId },
                data: { status: "COMPLETED" },
            });

            // 3. Deduct Credit
            await tx.student.update({
                where: { id: slot.studentId! },
                data: { credits: { decrement: 1 } },
            });

            // 4. Create Transaction
            await tx.creditTransaction.create({
                data: {
                    studentId: slot.studentId!,
                    amount: -1,
                    type: "USAGE",
                    description: `Session completed on ${slot.startTime.toISOString().split('T')[0]}`,
                },
            });
        });
    } catch (e) {
        console.error("Failed to complete session:", e);
        throw e;
    }

    revalidatePath("/admin/students");
    revalidatePath(`/admin/students/${slot.studentId}`);
}


