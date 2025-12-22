"use server";

import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


export async function checkEmailStatus(email: string) {
    const student = await prisma.student.findUnique({
        where: { email },
        select: { id: true, passwordSet: true, name: true }
    });

    if (!student) {
        return { status: "NEW" };
    }

    if (!student.passwordSet) {
        return { status: "NEEDS_ACTIVATION", name: student.name };
    }

    return { status: "EXISTING", name: student.name };
}

export async function activateAccount(email: string, password: string, name?: string) {
    // If name is provided, update it (useful if they want to correct it during activation)
    // Basic update
    await prisma.student.update({
        where: { email },
        data: {
            password,
            passwordSet: true,
            ...(name && { name })
        }
    });

    // Auto-login
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    return await loginStudent(formData);
}

export async function registerStudent(data: {
    email: string;
    password: string;
    name: string;
    seoLevel: string;
    goals: string;
}) {
    await prisma.student.create({
        data: {
            email: data.email,
            password: data.password,
            name: data.name,
            seoLevel: data.seoLevel,
            goals: data.goals,
            passwordSet: true,
            credits: 0 // New public signups start with 0
        }
    });

    // Auto-login
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    return await loginStudent(formData);
}


export async function changePassword(formData: FormData) {
    const cookieStore = await cookies();
    const studentId = cookieStore.get("student_id")?.value;

    if (!studentId) throw new Error("Unauthorized");

    const password = formData.get("password") as string;
    if (!password || password.length < 6) throw new Error("Password too short");

    await prisma.student.update({
        where: { id: studentId },
        data: { password }
    });

    return { success: true };
}

export async function loginStudent(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    console.log("Login attempt:", email);

    if (!email || !password) {
        throw new Error("Email and password are required");
    }

    // --- ADMIN OVERRIDE ---
    if (email.toLowerCase().includes("venuslowshimin")) {
        const cookieStore = await cookies();
        cookieStore.set("admin_session", "true", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24, // 1 day
            path: "/",
        });
        redirect("/admin/students");
    }
    // ----------------------

    const student = await prisma.student.findUnique({
        where: { email },
    });
    console.log("Student found:", student ? "Yes" : "No");

    if (!student) {
        throw new Error("Invalid credentials");
    }

    // Force activation if not set
    if (!student.passwordSet) {
        throw new Error("Account needs activation. Please use the activation flow.");
    }

    // Simple plain text password check for MVP as per plan. 
    // In production, use bcrypt/argon2.
    if (student.password !== password) {
        console.log("Password mismatch");
        throw new Error("Invalid credentials");
    }

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set("student_id", student.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
    });

    const callbackUrl = formData.get("callbackUrl") as string;
    console.log("Redirecting to:", callbackUrl || "/student/profile");
    redirect(callbackUrl || "/student/profile");
}

export async function logoutStudent() {
    const cookieStore = await cookies();
    cookieStore.delete("student_id");
    redirect("/");
}
