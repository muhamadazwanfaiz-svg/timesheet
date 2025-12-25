"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export type CreateInvoiceItem = {
    description: string;
    quantity: number;
    rate: number;
    amount: number;
};

export async function getNextInvoiceNumber() {
    const lastInvoice = await prisma.invoice.findFirst({
        orderBy: { createdAt: "desc" },
    });

    if (!lastInvoice) return "INV-0001";

    const lastNumber = lastInvoice.number.replace("INV-", "");
    const nextNumber = parseInt(lastNumber) + 1;
    return `INV-${nextNumber.toString().padStart(4, "0")}`;
}

export async function createInvoice(data: {
    studentId?: string;
    recipientName?: string;
    recipientEmail?: string;
    recipientAddress?: string;
    date: Date;
    dueDate?: Date;
    items: CreateInvoiceItem[];
    notes?: string;
}) {
    try {
        const number = await getNextInvoiceNumber();
        const total = data.items.reduce((acc, item) => acc + item.amount, 0);

        if (!data.studentId && !data.recipientName) {
            return { success: false, error: "Must provide a student or recipient name" };
        }

        const invoice = await prisma.invoice.create({
            data: {
                number,
                studentId: data.studentId,
                recipientName: data.recipientName,
                recipientEmail: data.recipientEmail,
                recipientAddress: data.recipientAddress,
                date: data.date,
                dueDate: data.dueDate,
                notes: data.notes,
                total,
                status: "DRAFT",
                items: {
                    create: data.items,
                },
            },
        });

        revalidatePath("/admin/invoices");
        return { success: true, invoice };
    } catch (error) {
        console.error("Error creating invoice:", error);
        return { success: false, error: "Failed to create invoice" };
    }
}

export async function getInvoices() {
    try {
        const invoices = await prisma.invoice.findMany({
            include: {
                student: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return { success: true, invoices };
    } catch (error) {
        console.error("Error fetching invoices:", error);
        return { success: false, error: "Failed to fetch invoices" };
    }
}

export async function deleteInvoice(id: string) {
    try {
        await prisma.invoice.delete({
            where: { id },
        });
        revalidatePath("/admin/invoices");
        return { success: true };
    } catch (error) {
        console.error("Error deleting invoice:", error);
        return { success: false, error: "Failed to delete invoice" };
    }
}
