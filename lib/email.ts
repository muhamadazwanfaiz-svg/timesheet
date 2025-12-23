import { Resend } from 'resend';

// Initialize Resend with API Key from environment
// If key is missing, we return null to prevent crashes (and handle it in usage)
const stepApiKey = process.env.RESEND_API_KEY;
export const resend = stepApiKey ? new Resend(stepApiKey) : null;

export const EMAIL_FROM = "Tutor <onboarding@resend.dev>"; // Default testing sender
