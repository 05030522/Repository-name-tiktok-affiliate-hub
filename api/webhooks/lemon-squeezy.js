import { verifyWebhookSignature, getTierFromVariant } from '../../lib/lemon-squeezy.js';
import { setSubscription } from '../../lib/kv.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get raw body for signature verification
    const rawBody = JSON.stringify(req.body);
    const signature = req.headers['x-signature'];

    if (!verifyWebhookSignature(rawBody, signature)) {
      console.error('Invalid webhook signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const event = req.body;
    const eventName = event.meta?.event_name;
    const attrs = event.data?.attributes;

    if (!eventName || !attrs) {
      return res.status(400).json({ error: 'Invalid event format' });
    }

    const email = attrs.user_email;
    if (!email) {
      console.error('No email in webhook event');
      return res.status(200).json({ received: true });
    }

    const variantId = String(attrs.variant_id || '');
    const productId = String(attrs.product_id || '');

    console.log(`Webhook: ${eventName} for ${email}`);

    switch (eventName) {
      case 'subscription_created':
      case 'subscription_updated':
      case 'subscription_resumed': {
        const tier = getTierFromVariant(variantId, productId);
        await setSubscription(email, {
          tier,
          status: 'active',
          lemonSqueezyId: String(event.data?.id || ''),
          customerId: String(attrs.customer_id || ''),
          variantId,
          currentPeriodEnd: attrs.renews_at || attrs.ends_at || null,
          updatedAt: new Date().toISOString()
        });
        break;
      }

      case 'subscription_cancelled': {
        const tier = getTierFromVariant(variantId, productId);
        await setSubscription(email, {
          tier,
          status: 'cancelled', // Still active until period end
          lemonSqueezyId: String(event.data?.id || ''),
          customerId: String(attrs.customer_id || ''),
          variantId,
          currentPeriodEnd: attrs.ends_at || null,
          updatedAt: new Date().toISOString()
        });
        break;
      }

      case 'subscription_expired':
      case 'subscription_payment_failed': {
        await setSubscription(email, {
          tier: 'free',
          status: 'expired',
          lemonSqueezyId: String(event.data?.id || ''),
          customerId: String(attrs.customer_id || ''),
          variantId,
          currentPeriodEnd: null,
          updatedAt: new Date().toISOString()
        });
        break;
      }

      case 'subscription_payment_success': {
        const tier = getTierFromVariant(variantId, productId);
        await setSubscription(email, {
          tier,
          status: 'active',
          lemonSqueezyId: String(event.data?.id || ''),
          customerId: String(attrs.customer_id || ''),
          variantId,
          currentPeriodEnd: attrs.renews_at || null,
          updatedAt: new Date().toISOString()
        });
        break;
      }

      default:
        console.log(`Unhandled event: ${eventName}`);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
}
