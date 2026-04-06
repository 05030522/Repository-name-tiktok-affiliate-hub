import { verifyMagicCode, getSubscription, createSession } from '../../lib/kv.js';
import { setSessionCookie, corsHeaders } from '../../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ error: 'Email and code are required' });
    }

    const valid = await verifyMagicCode(email, code);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid or expired code' });
    }

    // Get subscription tier
    const sub = await getSubscription(email);
    const tier = (sub.status === 'active' || sub.status === 'cancelled') ? sub.tier : 'free';

    // Create session
    const token = await createSession(email, tier);

    res.setHeader('Set-Cookie', setSessionCookie(token));
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ success: true, tier, email: email.toLowerCase() });
  } catch (error) {
    console.error('verify-code error:', error);
    return res.status(500).json({ error: 'Verification failed. Please try again.' });
  }
}
