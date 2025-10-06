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
      from: 'IndieConnect <noreply@indieconnect.dev>', // You can customize this
      to,
      subject,
      text,
      html,
    });

    console.log('✅ Email sent successfully:', data.id);
  } catch (error: any) {
    console.error('❌ Error sending email:', error.message);
    console.error('Full error:', error);
  }
};
