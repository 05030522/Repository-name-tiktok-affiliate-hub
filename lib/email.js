import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationCode(email, code) {
  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM || 'TrendVault <noreply@trendvault.shop>',
    to: email,
    subject: `Your TrendVault login code: ${code}`,
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
        <h2 style="color: #111; margin-bottom: 8px;">Your Login Code</h2>
        <p style="color: #666; font-size: 15px; margin-bottom: 24px;">Enter this code to sign in to TrendVault:</p>
        <div style="background: #f5f5f5; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
          <span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #111;">${code}</span>
        </div>
        <p style="color: #999; font-size: 13px;">This code expires in 10 minutes. If you didn't request this, ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
        <p style="color: #ccc; font-size: 11px;">TrendVault — Trend Intelligence for TikTok Shop Sellers</p>
      </div>
    `
  });

  if (error) {
    console.error('Email send error:', error);
    throw new Error('Failed to send verification email');
  }
}
