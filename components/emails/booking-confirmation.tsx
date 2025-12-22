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
} from "@react-email/components";
import * as React from "react";

interface BookingConfirmationEmailProps {
    studentName: string;
    date: string;
    time: string;
    meetLink?: string;
}

export const BookingConfirmationEmail = ({
    studentName,
    date,
    time,
    meetLink,
}: BookingConfirmationEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Your session is confirmed!</Preview>
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-sans">
                    <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
                        <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                            Booking Confirmed
                        </Heading>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Hi {studentName},
                        </Text>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Your tutoring session has been successfully booked.
                        </Text>
                        <Section className="bg-gray-50 p-4 rounded-lg my-4">
                            <Text className="m-0 text-gray-500 text-xs uppercase font-bold">When</Text>
                            <Text className="m-0 text-black text-lg font-medium">{date}</Text>
                            <Text className="m-0 text-black text-base">{time}</Text>
                        </Section>

                        {meetLink && (
                            <Section className="text-center mt-[32px] mb-[32px]">
                                <Button
                                    className="bg-[#4f46e5] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                                    href={meetLink}
                                >
                                    Join Meeting
                                </Button>
                            </Section>
                        )}

                        <Text className="text-black text-[14px] leading-[24px]">
                            A calendar invitation has been attached to this email. Please accept it to add it to your calendar.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};
