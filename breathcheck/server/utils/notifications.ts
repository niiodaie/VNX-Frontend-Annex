import twilio from 'twilio';
import sgMail from '@sendgrid/mail';

// Check if the required environment variables are set
const hasTwilio = process.env.TWILIO_ACCOUNT_SID && 
                  process.env.TWILIO_AUTH_TOKEN && 
                  process.env.TWILIO_PHONE_NUMBER;

const hasSendGrid = process.env.SENDGRID_API_KEY;

// Initialize Twilio if credentials are available
let twilioClient: any;
if (hasTwilio) {
  twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID!, 
    process.env.TWILIO_AUTH_TOKEN!
  );
}

// Initialize SendGrid if API key is available
if (hasSendGrid) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
}

/**
 * Send an SMS notification via Twilio
 */
export async function sendSMS(to: string, message: string): Promise<boolean> {
  if (!twilioClient) {
    console.log('[SMS Notification] Twilio not configured. Would have sent:', { to, message });
    return false;
  }

  try {
    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER!,
      to
    });
    return true;
  } catch (error) {
    console.error('[SMS Notification] Error:', error);
    return false;
  }
}

/**
 * Send an email notification via SendGrid
 */
export async function sendEmail(to: string, subject: string, text: string, html?: string): Promise<boolean> {
  if (!hasSendGrid) {
    console.log('[Email Notification] SendGrid not configured. Would have sent:', { to, subject, text });
    return false;
  }

  try {
    const msg = {
      to,
      from: 'notifications@breathcheck.example.com', // Use your verified sender in SendGrid
      subject,
      text,
      html: html || text
    };
    
    await sgMail.send(msg);
    return true;
  } catch (error) {
    console.error('[Email Notification] Error:', error);
    return false;
  }
}

/**
 * Send a notification to a parent (tries both SMS and email if available)
 */
export async function notifyParent(
  parentContact: { email?: string; phone?: string },
  message: string
): Promise<{ sms: boolean; email: boolean }> {
  const results = {
    sms: false,
    email: false
  };

  if (parentContact.phone) {
    results.sms = await sendSMS(parentContact.phone, message);
  }

  if (parentContact.email) {
    results.email = await sendEmail(
      parentContact.email,
      'BreathCheck Teen Driver Alert',
      message,
      `<div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #00D6B7; text-align: center;">BreathCheck Teen Driver Alert</h2>
        <div style="background-color: #1D2233; color: #F1F1F1; padding: 16px; border-radius: 8px;">
          <p>${message}</p>
        </div>
        <p style="text-align: center; margin-top: 20px; color: #9CA3AF; font-size: 14px;">
          This is an automated message from the BreathCheck Teen Driver Safety System.
        </p>
      </div>`
    );
  }

  return results;
}