import { Resend } from 'resend';
import { env } from '../config/env.config';

const resend = new Resend(env.RESEND_API_KEY);

export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html?: string
): Promise<void> => {
  try {
    const data = await resend.emails.send({
      from: 'IndieConnect <noreply@indieconnect.dev>',
      to,
      subject,
      html,
      text,
    });

    if (data.error) {
      console.error('❌ Email send failed:', data.error.message);
    } else {
      console.log('✅ Email sent successfully:', data.data?.id);
    }
  } catch (error: any) {
    console.error('❌ Error sending email:', error.message);
  }
};
