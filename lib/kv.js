import { kv } from '@vercel/kv';

// Subscription helpers
export async function getSubscription(email) {
  const data = await kv.get(`sub:${email.toLowerCase()}`);
  if (!data) return { tier: 'free', status: 'none' };
  // Check if expired
  if (data.status === 'active' && data.currentPeriodEnd) {
    if (new Date(data.currentPeriodEnd) < new Date()) {
      data.status = 'expired';
      data.tier = 'free';
      await kv.set(`sub:${email.toLowerCase()}`, data);
    }
  }
  return data;
}

export async function setSubscription(email, subData) {
  await kv.set(`sub:${email.toLowerCase()}`, subData);
}

// Session helpers
export async function createSession(email, tier) {
  const token = crypto.randomUUID() + '-' + crypto.randomUUID();
  const session = { email: email.toLowerCase(), tier, createdAt: new Date().toISOString() };
  await kv.set(`session:${token}`, session, { ex: 604800 }); // 7 days
  return token;
}

export async function getSession(token) {
  if (!token) return null;
  return await kv.get(`session:${token}`);
}

export async function deleteSession(token) {
  if (!token) return;
  await kv.del(`session:${token}`);
}

// Magic code helpers
export async function storeMagicCode(email, code) {
  await kv.set(`magic:${code}-${email.toLowerCase()}`, { email: email.toLowerCase() }, { ex: 600 }); // 10 min
}

export async function verifyMagicCode(email, code) {
  const key = `magic:${code}-${email.toLowerCase()}`;
  const data = await kv.get(key);
  if (!data) return false;
  await kv.del(key); // single use
  return true;
}

// Rate limit helper
export async function checkRateLimit(email) {
  const key = `rate:${email.toLowerCase()}`;
  const exists = await kv.get(key);
  if (exists) return false; // rate limited
  await kv.set(key, 1, { ex: 60 }); // 60 seconds
  return true;
}
