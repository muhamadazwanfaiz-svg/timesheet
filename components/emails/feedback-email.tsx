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

interface FeedbackEmailProps {
    studentName: string;
    slotDate: string;
    feedbackUrl: string;
}

export const FeedbackEmail = ({
    studentName,
    slotDate,
    feedbackUrl,
}: FeedbackEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>How was your session? Rate your experience.</Preview>
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-sans">
                    <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
                        <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                            Session Completed
                        </Heading>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Hi {studentName},
                        </Text>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Your session on <strong>{slotDate}</strong> has been marked as complete.
                        </Text>
                        <Text className="text-black text-[14px] leading-[24px]">
                            We'd love to hear how it went. Please take a moment to rate your session.
                        </Text>
                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Button
                                className="bg-[#4f46e5] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                                href={feedbackUrl}
                            >
                                Rate Session
                            </Button>
                        </Section>
                        <Text className="text-[#666666] text-[12px] leading-[24px]">
                            If you didn't attend this session, please contact your tutor immediately.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};
