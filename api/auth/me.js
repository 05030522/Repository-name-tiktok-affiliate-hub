import { getSession, getSubscription } from '../../lib/kv.js';
import { getSessionToken, clearSessionCookie } from '../../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const token = getSessionToken(req);

    if (!token) {
      return res.status(200).json({ authenticated: false, tier: 'free' });
    }

    const session = await getSession(token);
    if (!session) {
      res.setHeader('Set-Cookie', clearSessionCookie());
      return res.status(200).json({ authenticated: false, tier: 'free' });
    }

    // Get fresh subscription data
    const sub = await getSubscription(session.email);
    const tier = (sub.status === 'active' || sub.status === 'cancelled') ? sub.tier : 'free';

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({
      authenticated: true,
      email: session.email,
      tier
    });
  } catch (error) {
    console.error('me error:', error);
    return res.status(200).json({ authenticated: false, tier: 'free' });
  }
}
