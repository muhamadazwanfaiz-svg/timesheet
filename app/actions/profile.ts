"use server";

import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateProfile(formData: FormData) {
    const cookieStore = await cookies();
    const studentId = cookieStore.get("student_id")?.value;
    if (!studentId) return;

    const bio = formData.get("bio") as string;
    // Potentially allow name update too if user wants
    // const name = formData.get("name") as string; 

    await prisma.student.update({
        where: { id: studentId },
        data: { bio },
    });

    revalidatePath("/student/profile");
    revalidatePath("/student/settings");
    redirect("/student/settings"); // Redirect to settings after save
}
