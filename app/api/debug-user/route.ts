import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
    try {
        const email = "muhamadazwanfaiz@gmail.com";
        const student = await prisma.student.findUnique({
            where: { email }
        });
        return NextResponse.json({ student });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
