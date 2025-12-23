"use server";

import { resend, EMAIL_FROM } from "@/lib/email";
import { prisma } from "@/lib/db";
import { BookingConfirmationEmail } from "@/components/emails/booking-confirmation";
import { generateGoogleCalendarUrl } from "@/lib/google-calendar";
import { format } from "date-fns";
import * as React from 'react';

export async function sendBookingConfirmation(slotId: string) {
    console.log(`Sending booking confirmation for slot: ${slotId}`);

    // 1. Fetch Slot & Student
    const slot = await prisma.slot.findUnique({
        where: { id: slotId },
        include: { student: true }
    });

    if (!slot || !slot.studentId || !slot.student) {
        console.error("Slot or student not found for email.");
        return;
    }

    const { student, startTime, endTime } = slot;

    // 2. Generate Google Calendar URL
    const googleCalendarUrl = generateGoogleCalendarUrl({
        title: `Session with ${student.name}`,
        details: "Join Zoom Link: https://zoom.us/j/123456789", // Placeholder or dynamic if you have it
        startTime,
        endTime,
        location: "Zoom",
        guests: ["venuslowshimin@gmail.com"] // Auto-add Tutor as guest
    });

    // 3. Prepare Email Content
    const emailProps = {
        studentName: student.name,
        date: format(startTime, "EEEE, MMM d"),
        time: format(startTime, "h:mm a"),
        zoomLink: "https://zoom.us/j/123456789", // Placeholder
        googleCalendarUrl
    };

    // 4. Send Email via Resend
    try {
        const { error } = await resend.emails.send({
            from: EMAIL_FROM,
            to: [student.email, "venuslowshimin@gmail.com"], // Send to Student AND Tutor (Admin)
            subject: `Session Confirmed: ${format(startTime, "MMM d @ h:mm a")}`,
            react: BookingConfirmationEmail(emailProps) as React.ReactElement,
        });

        if (error) {
            console.error("Resend Error:", error);
            throw new Error("Failed to send email");
        }

        console.log(`Email sent successfully to ${student.email}`);
    } catch (e) {
        console.error("Email sending exception:", e);
        // Don't throw to prevent blocking the UI, just log it.
    }
}
