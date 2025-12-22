"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

async function requireAdmin() {
    const cookieStore = await cookies();
    const isAdmin = cookieStore.get("admin_session")?.value === "true";
    if (!isAdmin) throw new Error("Unauthorized");
}

export async function updateClassNotes(slotId: string, notes: string) {
    await requireAdmin();

    await prisma.slot.update({
        where: { id: slotId },
        data: {
            classNotes: notes
        }
    });

    revalidatePath("/admin/students");
    revalidatePath("/student"); // Update student view too
}
