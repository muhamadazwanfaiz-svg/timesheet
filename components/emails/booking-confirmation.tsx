import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
    Tailwind,
    Link,
    Hr
} from "@react-email/components";
import * as React from "react";

interface BookingConfirmationEmailProps {
    studentName: string;
    date: string; // e.g. "Wednesday, Dec 31"
    time: string; // e.g. "1:00 PM"
    meetLink: string;
    googleCalendarUrl?: string; // Optional now
}

export const BookingConfirmationEmail = ({
    studentName,
    date,
    time,
    meetLink,
    googleCalendarUrl,
}: BookingConfirmationEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Session Secured: {date} @ {time}</Preview>
            <Tailwind>
                <Body className="bg-slate-950 my-auto mx-auto font-sans text-white">
                    <Container className="border border-solid border-indigo-900 bg-slate-900 rounded-lg my-[40px] mx-auto p-[20px] w-[465px] shadow-lg">

                        {/* Header / Ticket Top */}
                        <Heading className="text-white text-[24px] font-bold text-center p-0 my-[20px] mx-0 uppercase tracking-widest text-indigo-400">
                            Session Secured 🚀
                        </Heading>

                        <Text className="text-slate-300 text-[14px] leading-[24px] text-center">
                            Hi {studentName}, your slot is locked in.
                        </Text>

                        {/* Ticket Details */}
                        <Section className="my-[20px] bg-slate-950 border border-dashed border-slate-700 rounded-md p-6 text-center">
                            <Text className="text-slate-400 text-[12px] uppercase tracking-wide mb-1">
                                Date
                            </Text>
                            <Text className="text-white text-[18px] font-bold mb-4">
                                {date}
                            </Text>

                            <Text className="text-slate-400 text-[12px] uppercase tracking-wide mb-1">
                                Time
                            </Text>
                            <Text className="text-white text-[24px] font-bold text-indigo-300">
                                {time}
                            </Text>
                        </Section>

                        {/* Primary Call to Action */}
                        {googleCalendarUrl && (
                            <Section className="text-center mt-[10px] mb-[20px]">
                                <Button
                                    className="bg-indigo-600 rounded-full text-white text-[14px] font-bold no-underline text-center px-8 py-4 shadow-[0_0_20px_rgba(79,70,229,0.5)] hover:bg-indigo-500 transition-all"
                                    href={googleCalendarUrl}
                                >
                                    Add to Google Calendar
                                </Button>
                            </Section>
                        )}

                        {/* Secondary Link */}
                        <Text className="text-center text-slate-500 text-[12px]">
                            Join Link: <Link href={meetLink} className="text-indigo-400 underline">{meetLink}</Link>
                        </Text>

                        <Hr className="border-slate-800 my-[20px]" />

                        {/* Footer Quote */}
                        <Text className="text-slate-600 text-[12px] italic text-center leading-[20px]">
                            "Success is the sum of small efforts repeated day in and day out."
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default BookingConfirmationEmail;
