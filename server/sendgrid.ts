// SendGrid email service - from javascript_sendgrid integration
import { MailService } from '@sendgrid/mail';

// Initialize SendGrid service
const mailService = new MailService();

// Set API key from environment
if (process.env.SENDGRID_API_KEY) {
  mailService.setApiKey(process.env.SENDGRID_API_KEY);
  console.log('✅ SendGrid initialized successfully');
} else {
  console.warn('⚠️ SENDGRID_API_KEY not found - email functionality will be disabled');
}

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY) {
    console.log('🚫 SendGrid not configured - would have sent email to:', params.to);
    return false;
  }

  try {
    await mailService.send({
      to: params.to,
      from: params.from,
      subject: params.subject,
      text: params.text,
      html: params.html,
    });
    console.log('✅ Email sent successfully to:', params.to);
    return true;
  } catch (error) {
    console.error('❌ SendGrid email error:', error);
    return false;
  }
}

// Welcome email template for new subscribers
export async function sendWelcomeEmail(email: string): Promise<boolean> {
  const welcomeHtml = `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px; overflow: hidden;">
      <div style="padding: 40px 30px; text-align: center;">
        <h1 style="margin: 0 0 20px 0; font-size: 28px; font-weight: bold;">🎉 Welcome to GinyWow!</h1>
        <p style="margin: 0 0 25px 0; font-size: 16px; line-height: 1.6; opacity: 0.9;">
          Thank you for subscribing to our newsletter! You're now part of our community that gets the latest updates on YouTube optimization tools and features.
        </p>
        
        <div style="background: rgba(255,255,255,0.1); border-radius: 8px; padding: 25px; margin: 25px 0;">
          <h2 style="margin: 0 0 15px 0; font-size: 20px;">What you'll get:</h2>
          <ul style="list-style: none; padding: 0; margin: 0; text-align: left;">
            <li style="margin-bottom: 10px; padding-left: 25px; position: relative;">
              <span style="position: absolute; left: 0; top: 0;">🚀</span>
              Latest tool updates and new features
            </li>
            <li style="margin-bottom: 10px; padding-left: 25px; position: relative;">
              <span style="position: absolute; left: 0; top: 0;">💡</span>
              YouTube optimization tips and tricks
            </li>
            <li style="margin-bottom: 10px; padding-left: 25px; position: relative;">
              <span style="position: absolute; left: 0; top: 0;">📊</span>
              Industry insights and best practices
            </li>
            <li style="margin-bottom: 0; padding-left: 25px; position: relative;">
              <span style="position: absolute; left: 0; top: 0;">🎁</span>
              Exclusive offers and early access to new tools
            </li>
          </ul>
        </div>
        
        <p style="margin: 25px 0 0 0; font-size: 14px; opacity: 0.8;">
          You can unsubscribe at any time by clicking the unsubscribe link in our emails.
        </p>
      </div>
    </div>
  `;

  return await sendEmail({
    to: email,
    from: 'no-reply@ginywow.com', // Replace with your verified sender email
    subject: '🎉 Welcome to GinyWow Newsletter!',
    text: 'Welcome to GinyWow! Thank you for subscribing to our newsletter. You will receive the latest updates on YouTube optimization tools and features.',
    html: welcomeHtml
  });
}

// Notification email to admin when someone subscribes
export async function sendSubscriptionNotification(email: string): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY) {
    console.log('📧 New subscriber:', email);
    return false;
  }

  return await sendEmail({
    to: 'admin@ginywow.com', // Replace with your admin email
    from: 'no-reply@ginywow.com',
    subject: '📬 New Newsletter Subscription',
    text: `New subscriber: ${email}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">🎉 New Newsletter Subscription</h2>
        <p style="font-size: 16px; color: #666;">
          Someone new just subscribed to your newsletter:
        </p>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <strong style="color: #007bff;">${email}</strong>
        </div>
        <p style="font-size: 14px; color: #999; margin-top: 20px;">
          Subscribed at: ${new Date().toLocaleString()}
        </p>
      </div>
    `
  });
}