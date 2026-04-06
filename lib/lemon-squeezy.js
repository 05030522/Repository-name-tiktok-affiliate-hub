import { createHmac } from 'crypto';

export function verifyWebhookSignature(payload, signature) {
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
  if (!secret || !signature) return false;

  const hmac = createHmac('sha256', secret);
  const digest = hmac.update(payload).digest('hex');
  return signature === digest;
}

// Map Lemon Squeezy variant/product to tier
// Update these IDs after checking your Lemon Squeezy dashboard
const TIER_MAP = {
  // Product UUIDs from checkout URLs
  '2b9e60f6-1124-4d2d-9e50-2861a28be774': 'pro',     // Monthly Pro
  '3f8736de-7a87-49ea-af15-97e28bc7d7a9': 'pro',     // Yearly Pro
  '69866d10-2fac-4f3c-8791-92b9edd53dde': 'insider',  // Insider
};

export function getTierFromVariant(variantId, productId) {
  // Try variant ID first, then product ID
  return TIER_MAP[variantId] || TIER_MAP[productId] || 'pro';
}
