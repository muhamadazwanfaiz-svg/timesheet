import { Resend } from 'resend';

// Initialize Resend with API Key from environment
// If key is missing, operations will fail gracefully or throw depending on usage.
export const resend = new Resend(process.env.RESEND_API_KEY);

export const EMAIL_FROM = "Tutor <onboarding@resend.dev>"; // Default testing sender
