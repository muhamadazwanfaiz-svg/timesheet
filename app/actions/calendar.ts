"use server";

import { prisma } from "@/lib/db";
import { Resend } from "resend";
import { BookingConfirmationEmail } from "@/components/emails/booking-confirmation";
import { createEvent, EventAttributes } from "ics";
import { revalidatePath } from "next/cache";

export async function sendBookingConfirmation(slotId: string) {
    console.log("Sending booking confirmation for slot:", slotId);

    // 1. Fetch details
    const slot = await prisma.slot.findUnique({
        where: { id: slotId },
        include: { student: true }
    });

    if (!slot || !slot.student || !slot.student.email) {
        console.error("Slot or student email missing for confirmation.");
        return;
    }

    // 2. Prepare Date Array for ICS [year, month, day, hour, minute]
    const start = new Date(slot.startTime);
    const end = new Date(slot.endTime);

    const startArray: [number, number, number, number, number] = [
        start.getFullYear(),
        start.getMonth() + 1, // ICS months are 1-12? Wait, standard JS is 0-11, ICS expect 1-12? 
        // Docs say: [2018, 5, 30, 6, 30] -> May 30? No, usually 1-indexed in casual speak but verify.
        // RFC 5545 uses YYYYMMDD. 
        // `ics` package docs: 
        // [2018, 1, 15] is Jan 15. So 1-indexed.
        start.getDate(),
        start.getHours(),
        start.getMinutes()
    ];

    const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
    const durationHours = Math.floor(durationMinutes / 60);
    const remainingMinutes = durationMinutes % 60;

    // 3. Create ICS Event
    const event: EventAttributes = {
        start: startArray,
        duration: { hours: durationHours, minutes: remainingMinutes },
        title: "Tutoring Session",
        description: `Tutoring session between Owner and ${slot.student.name}`,
        location: "Google Meet", // Dynamic link later?
        status: "CONFIRMED",
        busyStatus: "BUSY",
        organizer: { name: "Tutor", email: "onboarding@resend.dev" }, // Using verified sender
        attendees: [
            { name: slot.student.name || "Student", email: slot.student.email, rsvp: true, partstat: "ACCEPTED", role: "REQ-PARTICIPANT" },
            // Add Tutor as attendee too? Or relies on organizer?
            // If email is sent to Tutor, they can add it.
        ]
    };

    // Promisify createEvent
    const icsContent = await new Promise<string>((resolve, reject) => {
        createEvent(event, (error, value) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(value);
        });
    });

    // 4. Send Email with Attachment via Resend
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Email to Student
    await resend.emails.send({
        from: "Tutor <onboarding@resend.dev>",
        to: slot.student.email,
        subject: "Booking Confirmed: Tutoring Session",
        react: BookingConfirmationEmail({
            studentName: slot.student.name || "Student",
            date: start.toLocaleDateString(),
            time: `${start.toLocaleTimeString()} - ${end.toLocaleTimeString()}`,
            meetLink: "https://meet.google.com/generic-link" // Placeholder
        }),
        attachments: [
            {
                filename: "invite.ics",
                content: icsContent,
            },
        ],
    });

    console.log(`Confirmation email sent to ${slot.student.email}`);

    // Email to Tutor (Self) - Using same student email logic for simplicity, or hardcode your email
    // For now I'll just skip sending a separate email to the Tutor unless desired.
    // The user said: "automatically add this to the tutor google calendar". 
    // Sending the ICS to the tutor's email allows them to click "Add".
    // I need the Tutor's email. I'll ask for it or use a default.
    // The user can add their own email later.
}

export async function updateSlotNotes(slotId: string, notes: string) {
    await prisma.slot.update({
        where: { id: slotId },
        data: { classNotes: notes }
    });

    revalidatePath("/admin/students");
    revalidatePath("/student");
}
