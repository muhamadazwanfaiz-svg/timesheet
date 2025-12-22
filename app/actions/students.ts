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

    if (!name || !email) {
        throw new Error("Name and Email are required");
    }

    await prisma.student.create({
        data: {
            name,
            email,
            module,
        },
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
