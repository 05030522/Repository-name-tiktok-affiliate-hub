import { checkRateLimit, storeMagicCode } from '../../lib/kv.js';
import { generateCode, corsHeaders } from '../../lib/auth.js';
import { sendVerificationCode } from '../../lib/email.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    // Rate limit: 1 code per 60 seconds per email
    const allowed = await checkRateLimit(email);
    if (!allowed) {
      return res.status(429).json({ error: 'Please wait 60 seconds before requesting a new code' });
    }

    const code = generateCode();
    await storeMagicCode(email, code);
    await sendVerificationCode(email, code);

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('send-code error:', error);
    return res.status(500).json({ error: 'Failed to send code. Please try again.' });
  }
}
