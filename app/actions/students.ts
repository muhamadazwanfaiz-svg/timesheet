"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getStudents() {
    return await prisma.student.findMany({
        orderBy: { name: "asc" },
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

export async function backfillSessions(studentId: string, dates: Date[]) {
    if (dates.length === 0) return;

    await prisma.$transaction(async (tx) => {
        // 1. Create completed slots for each date
        for (const date of dates) {
            // Set default time to 12:00 PM for record keeping
            const startTime = new Date(date);
            startTime.setHours(12, 0, 0, 0);

            const endTime = new Date(startTime);
            endTime.setHours(13, 0, 0, 0);

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
        const amount = dates.length;
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


