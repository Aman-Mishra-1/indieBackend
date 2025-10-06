import { Resend } from 'resend';
import { env } from '../config/env.config';

const resend = new Resend(env.RESEND_API_KEY);

export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html?: string
): Promise<void> => {
  console.log(`[DEBUG] Attempting to send email via Resend to: ${to}`);
  try {
    const data = await resend.emails.send({
      from: 'IndieConnect <onboarding@resend.dev>', // ✅ works without domain verification
      to,
      subject,
      html,
      text,
    });

    console.log('[DEBUG] Resend response:', data);

    if (data.error) {
      console.error('❌ Email send failed:', data.error.message);
    } else {
      console.log('✅ Email sent successfully:', data.data?.id);
    }
  } catch (error: any) {
    console.error('❌ Exception in sendEmail:', error.message);
    console.error(error);
  }
};
