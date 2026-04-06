import { deleteSession } from '../../lib/kv.js';
import { getSessionToken, clearSessionCookie } from '../../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const token = getSessionToken(req);
    if (token) {
      await deleteSession(token);
    }

    res.setHeader('Set-Cookie', clearSessionCookie());
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('logout error:', error);
    res.setHeader('Set-Cookie', clearSessionCookie());
    return res.status(200).json({ success: true });
  }
}
