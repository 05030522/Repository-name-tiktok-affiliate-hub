import { getSession, getSubscription } from '../../lib/kv.js';
import { getSessionToken } from '../../lib/auth.js';

// Full dataset — only sent to authenticated Pro/Insider users
const fullBrands = [
  { rank: 1, name: "Shark Home", revenue: "$17.79M", growth: "+50.5%", itemsSold: "69.5K", avgPrice: "$255.92", affiliateRev: "$16.32M", videoRev: "$14.59M" },
  { rank: 2, name: "medicube US Store", revenue: "$15.66M", growth: "-15.2%", itemsSold: "484.8K", avgPrice: "$32.31", affiliateRev: "$14.76M", videoRev: "$11.99M" },
  { rank: 3, name: "Dr.Melaxin", revenue: "$15.07M", growth: "-6.0%", itemsSold: "494.3K", avgPrice: "$30.49", affiliateRev: "$14.63M", videoRev: "$12.57M" },
  { rank: 4, name: "Tarte Cosmetics", revenue: "$14.07M", growth: "+40.1%", itemsSold: "425.8K", avgPrice: "$33.04", affiliateRev: "$10.99M", videoRev: "$8.59M" },
  { rank: 5, name: "VEVOR Store", revenue: "$12.21M", growth: "+19.5%", itemsSold: "167.3K", avgPrice: "$72.98", affiliateRev: "$9.87M", videoRev: "N/A" },
  { rank: 6, name: "Our Place", revenue: "$11.48M", growth: "+32.7%", itemsSold: "98.2K", avgPrice: "$116.91", affiliateRev: "$8.42M", videoRev: "$7.15M" },
  { rank: 7, name: "Dyson", revenue: "$10.95M", growth: "+12.3%", itemsSold: "42.1K", avgPrice: "$260.10", affiliateRev: "$7.88M", videoRev: "$6.22M" },
  { rank: 8, name: "CeraVe", revenue: "$10.22M", growth: "+28.4%", itemsSold: "612.5K", avgPrice: "$16.69", affiliateRev: "$8.91M", videoRev: "$7.44M" },
  { rank: 9, name: "e.l.f. Cosmetics", revenue: "$9.87M", growth: "+45.2%", itemsSold: "725.3K", avgPrice: "$13.61", affiliateRev: "$8.12M", videoRev: "$6.89M" },
  { rank: 10, name: "Stanley", revenue: "$9.41M", growth: "+8.7%", itemsSold: "188.4K", avgPrice: "$49.95", affiliateRev: "$7.53M", videoRev: "$5.98M" },
];

const fullCategories = [
  { rank: 1, name: "Beauty & Personal Care", revenue: "$324.51M", growth: "-1.20%", shops: "19,664", revPerShop: "$16.50K", affiliateRev: "$265.06M", top3Ratio: "13.80%" },
  { rank: 2, name: "Womenswear & Underwear", revenue: "$236.11M", growth: "+1.73%", shops: "18,280", revPerShop: "$12.92K", affiliateRev: "$177.45M", top3Ratio: "5.31%" },
  { rank: 3, name: "Sports & Outdoor", revenue: "$140.39M", growth: "+5.58%", shops: "16,429", revPerShop: "$8.55K", affiliateRev: "$106.96M", top3Ratio: "11.74%" },
  { rank: 4, name: "Health", revenue: "$117.93M", growth: "-0.02%", shops: "4,440", revPerShop: "$26.56K", affiliateRev: "$102.34M", top3Ratio: "14.02%" },
  { rank: 5, name: "Nutrition & Wellness", revenue: "$113.99M", growth: "+0.25%", shops: "3,495", revPerShop: "$32.61K", affiliateRev: "$98.17M", top3Ratio: "14.47%" },
  { rank: 6, name: "Food & Beverages", revenue: "$98.44M", growth: "+3.12%", shops: "8,721", revPerShop: "$11.29K", affiliateRev: "$72.88M", top3Ratio: "9.82%" },
  { rank: 7, name: "Home Supplies", revenue: "$87.63M", growth: "+7.45%", shops: "12,334", revPerShop: "$7.10K", affiliateRev: "$63.29M", top3Ratio: "8.15%" },
  { rank: 8, name: "Phones & Electronics", revenue: "$76.21M", growth: "+2.88%", shops: "9,876", revPerShop: "$7.72K", affiliateRev: "$54.17M", top3Ratio: "12.33%" },
];

const fullProducts = [
  { rank: 1, name: "Shark PowerPro Flex Reveal Plus Cordless Vacuum", revenue: "$6.96M", growth: "+46.2%", itemsSold: "18.7K", avgPrice: "$372.53", commission: "5%", creators: 551 },
  { rank: 2, name: "Dr.Melaxin Gifted Collagen Boost Set", revenue: "$3.62M", growth: "-3.5%", itemsSold: "62.5K", avgPrice: "$57.96", commission: "15%", creators: "1.57K" },
  { rank: 3, name: "the buffer™ brush — fluffy dome foundation brush", revenue: "$3.35M", growth: "+38.9%", itemsSold: "87.0K", avgPrice: "$38.44", commission: "15%", creators: 841 },
  { rank: 4, name: "tarte BB blur tinted moisturizer SPF 30", revenue: "$3.31M", growth: "+36.2%", itemsSold: "86.8K", avgPrice: "$38.16", commission: "20%", creators: "4.91K" },
  { rank: 5, name: "Shark Air Purifier with True HEPA — HP102", revenue: "$3.05M", growth: "+347.7%", itemsSold: "15.3K", avgPrice: "$199.29", commission: "5%", creators: 315 },
  { rank: 6, name: "Our Place Always Pan 2.0", revenue: "$2.87M", growth: "+22.1%", itemsSold: "28.4K", avgPrice: "$101.06", commission: "12%", creators: 423 },
  { rank: 7, name: "CeraVe Hydrating Facial Cleanser 16oz", revenue: "$2.54M", growth: "+31.8%", itemsSold: "164.2K", avgPrice: "$15.47", commission: "10%", creators: "2.18K" },
  { rank: 8, name: "e.l.f. Power Grip Primer", revenue: "$2.31M", growth: "+52.3%", itemsSold: "231.0K", avgPrice: "$10.00", commission: "15%", creators: "3.44K" },
  { rank: 9, name: "Stanley Quencher H2.0 40oz Tumbler", revenue: "$2.18M", growth: "+5.4%", itemsSold: "48.9K", avgPrice: "$44.58", commission: "8%", creators: 672 },
  { rank: 10, name: "Dyson Airwrap Complete Long", revenue: "$1.96M", growth: "+18.9%", itemsSold: "3.8K", avgPrice: "$515.79", commission: "3%", creators: 289 },
];

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const token = getSessionToken(req);
    let tier = 'free';

    if (token) {
      const session = await getSession(token);
      if (session) {
        const sub = await getSubscription(session.email);
        if (sub.status === 'active' || sub.status === 'cancelled') {
          tier = sub.tier;
        }
      }
    }

    const isPaid = tier === 'pro' || tier === 'insider';

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', isPaid ? 'private, no-cache' : 'public, max-age=3600');

    if (isPaid) {
      return res.status(200).json({
        tier,
        brands: fullBrands,
        categories: fullCategories,
        products: fullProducts
      });
    }

    // Free tier: only first 3 of each
    return res.status(200).json({
      tier: 'free',
      brands: fullBrands.slice(0, 3),
      categories: fullCategories.slice(0, 3),
      products: fullProducts.slice(0, 3)
    });
  } catch (error) {
    console.error('data error:', error);
    return res.status(500).json({ error: 'Failed to load data' });
  }
}
