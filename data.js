// ===== Kalodata-sourced Rankings Data =====
// Update this file weekly with fresh data from Kalodata
// Last updated: April 6, 2026

const DATA_UPDATED = "Apr 6, 2026";
const DATA_PERIOD = "Mar 5 – Apr 3, 2026";

// ===== TOP BRANDS =====
const topBrands = [
  { rank: 1, name: "Shark Home", revenue: "$17.79M", growth: "+50.5%", itemsSold: "69.5K", avgPrice: "$255.92", affiliateRev: "$16.32M", liveRev: "$1.72M", videoRev: "$14.59M", free: true },
  { rank: 2, name: "medicube US Store", revenue: "$15.66M", growth: "-15.2%", itemsSold: "484.8K", avgPrice: "$32.31", affiliateRev: "$14.76M", liveRev: "$3.40M", videoRev: "$11.99M", free: true },
  { rank: 3, name: "Dr.Melaxin", revenue: "$15.07M", growth: "-6.0%", itemsSold: "494.3K", avgPrice: "$30.49", affiliateRev: "$14.63M", liveRev: "$2.38M", videoRev: "$12.57M", free: true },
  { rank: 4, name: "Unlock with Pro", revenue: "—", growth: "—", itemsSold: "—", avgPrice: "—", affiliateRev: "—", liveRev: "—", videoRev: "—", free: false },
  { rank: 5, name: "Unlock with Pro", revenue: "—", growth: "—", itemsSold: "—", avgPrice: "—", affiliateRev: "—", liveRev: "—", videoRev: "—", free: false },
  { rank: 6, name: "—", revenue: "—", growth: "—", itemsSold: "—", avgPrice: "—", affiliateRev: "—", liveRev: "—", videoRev: "—", free: false },
  { rank: 7, name: "—", revenue: "—", growth: "—", itemsSold: "—", avgPrice: "—", affiliateRev: "—", liveRev: "—", videoRev: "—", free: false },
  { rank: 8, name: "—", revenue: "—", growth: "—", itemsSold: "—", avgPrice: "—", affiliateRev: "—", liveRev: "—", videoRev: "—", free: false },
  { rank: 9, name: "—", revenue: "—", growth: "—", itemsSold: "—", avgPrice: "—", affiliateRev: "—", liveRev: "—", videoRev: "—", free: false },
  { rank: 10, name: "—", revenue: "—", growth: "—", itemsSold: "—", avgPrice: "—", affiliateRev: "—", liveRev: "—", videoRev: "—", free: false },
];

// ===== TOP CATEGORIES =====
const topCategories = [
  { rank: 1, name: "Beauty & Personal Care", revenue: "$324.51M", growth: "-1.20%", shops: "19,664", revPerShop: "$16.50K", affiliateRev: "$265.06M", top3Ratio: "13.80%", free: true },
  { rank: 2, name: "Womenswear & Underwear", revenue: "$236.11M", growth: "+1.73%", shops: "18,280", revPerShop: "$12.92K", affiliateRev: "$177.45M", top3Ratio: "5.31%", free: true },
  { rank: 3, name: "Sports & Outdoor", revenue: "$140.39M", growth: "+5.58%", shops: "16,429", revPerShop: "$8.55K", affiliateRev: "$106.96M", top3Ratio: "11.74%", free: true },
  { rank: 4, name: "Unlock with Pro", revenue: "—", growth: "—", shops: "—", revPerShop: "—", affiliateRev: "—", top3Ratio: "—", free: false },
  { rank: 5, name: "Unlock with Pro", revenue: "—", growth: "—", shops: "—", revPerShop: "—", affiliateRev: "—", top3Ratio: "—", free: false },
  { rank: 6, name: "—", revenue: "—", growth: "—", shops: "—", revPerShop: "—", affiliateRev: "—", top3Ratio: "—", free: false },
  { rank: 7, name: "—", revenue: "—", growth: "—", shops: "—", revPerShop: "—", affiliateRev: "—", top3Ratio: "—", free: false },
  { rank: 8, name: "—", revenue: "—", growth: "—", shops: "—", revPerShop: "—", affiliateRev: "—", top3Ratio: "—", free: false },
];

// ===== TOP PRODUCTS =====
const topProducts = [
  { rank: 1, name: "Shark PowerPro Flex Reveal Plus Cordless Vacuum", revenue: "$6.96M", growth: "+46.2%", itemsSold: "18.7K", avgPrice: "$372.53", commission: "5%", creators: 551, videoRev: "$6.59M", free: true },
  { rank: 2, name: "Dr.Melaxin Gifted Collagen Boost Set", revenue: "$3.62M", growth: "-3.5%", itemsSold: "62.5K", avgPrice: "$57.96", commission: "15%", creators: "1.57K", videoRev: "$3.49M", free: true },
  { rank: 3, name: "the buffer™ brush — fluffy dome foundation brush", revenue: "$3.35M", growth: "+38.9%", itemsSold: "87.0K", avgPrice: "$38.44", commission: "15%", creators: 841, videoRev: "$946K", free: true },
  { rank: 4, name: "Unlock with Pro", revenue: "—", growth: "—", itemsSold: "—", avgPrice: "—", commission: "—", creators: "—", videoRev: "—", free: false },
  { rank: 5, name: "Unlock with Pro", revenue: "—", growth: "—", itemsSold: "—", avgPrice: "—", commission: "—", creators: "—", videoRev: "—", free: false },
  { rank: 6, name: "—", revenue: "—", growth: "—", itemsSold: "—", avgPrice: "—", commission: "—", creators: "—", videoRev: "—", free: false },
  { rank: 7, name: "—", revenue: "—", growth: "—", itemsSold: "—", avgPrice: "—", commission: "—", creators: "—", videoRev: "—", free: false },
  { rank: 8, name: "—", revenue: "—", growth: "—", itemsSold: "—", avgPrice: "—", commission: "—", creators: "—", videoRev: "—", free: false },
  { rank: 9, name: "—", revenue: "—", growth: "—", itemsSold: "—", avgPrice: "—", commission: "—", creators: "—", videoRev: "—", free: false },
  { rank: 10, name: "—", revenue: "—", growth: "—", itemsSold: "—", avgPrice: "—", commission: "—", creators: "—", videoRev: "—", free: false },
];

// ===== SERVER DATA RE-RENDER FUNCTIONS =====
// Called by AuthManager after fetching full data from /api/data

function renderBrandsFromData(containerId, brands) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = `
    <div class="data-header">
      <span>Updated: ${DATA_UPDATED}</span>
      <span>Period: ${DATA_PERIOD}</span>
    </div>
    <div class="data-table-wrap">
      <table class="data-table">
        <thead>
          <tr><th>#</th><th>Brand</th><th>Revenue</th><th>Growth</th><th>Items Sold</th><th>Avg Price</th><th>Affiliate Rev</th><th>Video Rev</th></tr>
        </thead>
        <tbody>
          ${brands.map(b => `
            <tr>
              <td><span class="rank-badge ${b.rank <= 3 ? 'rank-' + b.rank : ''}">${b.rank}</span></td>
              <td>${b.name}</td>
              <td class="revenue">${b.revenue}</td>
              <td class="${(b.growth||'').startsWith('+') ? 'positive' : (b.growth||'').startsWith('-') ? 'negative' : ''}">${b.growth}</td>
              <td>${b.itemsSold}</td>
              <td>${b.avgPrice}</td>
              <td>${b.affiliateRev}</td>
              <td>${b.videoRev}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderCategoriesFromData(containerId, categories) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = `
    <div class="data-header">
      <span>Updated: ${DATA_UPDATED}</span>
      <span>Period: ${DATA_PERIOD}</span>
    </div>
    <div class="data-table-wrap">
      <table class="data-table">
        <thead>
          <tr><th>#</th><th>Category</th><th>Revenue</th><th>Growth</th><th>Shops</th><th>Rev/Shop</th><th>Affiliate Rev</th><th>Top 3 Ratio</th></tr>
        </thead>
        <tbody>
          ${categories.map(c => `
            <tr>
              <td><span class="rank-badge ${c.rank <= 3 ? 'rank-' + c.rank : ''}">${c.rank}</span></td>
              <td>${c.name}</td>
              <td class="revenue">${c.revenue}</td>
              <td class="${(c.growth||'').startsWith('+') ? 'positive' : (c.growth||'').startsWith('-') ? 'negative' : ''}">${c.growth}</td>
              <td>${c.shops}</td>
              <td>${c.revPerShop}</td>
              <td>${c.affiliateRev}</td>
              <td>${c.top3Ratio}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderProductsFromData(containerId, products) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = `
    <div class="data-header">
      <span>Updated: ${DATA_UPDATED}</span>
      <span>Period: ${DATA_PERIOD}</span>
    </div>
    <div class="data-table-wrap">
      <table class="data-table">
        <thead>
          <tr><th>#</th><th>Product</th><th>Revenue</th><th>Growth</th><th>Sold</th><th>Price</th><th>Commission</th><th>Creators</th></tr>
        </thead>
        <tbody>
          ${products.map(p => `
            <tr>
              <td><span class="rank-badge ${p.rank <= 3 ? 'rank-' + p.rank : ''}">${p.rank}</span></td>
              <td class="product-name-cell">${p.name}</td>
              <td class="revenue">${p.revenue}</td>
              <td class="${(p.growth||'').startsWith('+') ? 'positive' : (p.growth||'').startsWith('-') ? 'negative' : ''}">${p.growth}</td>
              <td>${p.itemsSold}</td>
              <td>${p.avgPrice}</td>
              <td>${p.commission}</td>
              <td>${p.creators}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// ===== RENDER FUNCTIONS =====

function renderBrands(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = `
    <div class="data-header">
      <span>Updated: ${DATA_UPDATED}</span>
      <span>Period: ${DATA_PERIOD}</span>
    </div>
    <div class="data-table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>#</th><th>Brand</th><th>Revenue</th><th>Growth</th><th>Items Sold</th><th>Avg Price</th><th>Affiliate Rev</th><th>Video Rev</th>
          </tr>
        </thead>
        <tbody>
          ${topBrands.map(b => `
            <tr class="${b.free ? '' : 'locked-row'}" ${!b.free ? 'onclick="showPaywall()"' : ''}>
              <td><span class="rank-badge ${b.rank <= 3 ? 'rank-' + b.rank : ''}">${b.rank}</span></td>
              <td class="${b.free ? '' : 'blur'}">${b.name}</td>
              <td class="revenue">${b.revenue}</td>
              <td class="${b.growth.startsWith('+') ? 'positive' : b.growth.startsWith('-') ? 'negative' : ''}">${b.free ? b.growth : '<span class="blur">—</span>'}</td>
              <td>${b.free ? b.itemsSold : '<span class="blur">—</span>'}</td>
              <td>${b.free ? b.avgPrice : '<span class="blur">—</span>'}</td>
              <td>${b.free ? b.affiliateRev : '<span class="blur">—</span>'}</td>
              <td>${b.free ? b.videoRev : '<span class="blur">—</span>'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderCategories(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = `
    <div class="data-header">
      <span>Updated: ${DATA_UPDATED}</span>
      <span>Period: ${DATA_PERIOD}</span>
    </div>
    <div class="data-table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>#</th><th>Category</th><th>Revenue</th><th>Growth</th><th>Shops</th><th>Rev/Shop</th><th>Affiliate Rev</th><th>Top 3 Ratio</th>
          </tr>
        </thead>
        <tbody>
          ${topCategories.map(c => `
            <tr class="${c.free ? '' : 'locked-row'}" ${!c.free ? 'onclick="showPaywall()"' : ''}>
              <td><span class="rank-badge ${c.rank <= 3 ? 'rank-' + c.rank : ''}">${c.rank}</span></td>
              <td class="${c.free ? '' : 'blur'}">${c.name}</td>
              <td class="revenue">${c.revenue}</td>
              <td class="${c.growth.startsWith('+') ? 'positive' : c.growth.startsWith('-') ? 'negative' : ''}">${c.free ? c.growth : '<span class="blur">—</span>'}</td>
              <td>${c.free ? c.shops : '<span class="blur">—</span>'}</td>
              <td>${c.free ? c.revPerShop : '<span class="blur">—</span>'}</td>
              <td>${c.free ? c.affiliateRev : '<span class="blur">—</span>'}</td>
              <td>${c.free ? c.top3Ratio : '<span class="blur">—</span>'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderProducts(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = `
    <div class="data-header">
      <span>Updated: ${DATA_UPDATED}</span>
      <span>Period: ${DATA_PERIOD}</span>
    </div>
    <div class="data-table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>#</th><th>Product</th><th>Revenue</th><th>Growth</th><th>Sold</th><th>Price</th><th>Commission</th><th>Creators</th>
          </tr>
        </thead>
        <tbody>
          ${topProducts.map(p => `
            <tr class="${p.free ? '' : 'locked-row'}" ${!p.free ? 'onclick="showPaywall()"' : ''}>
              <td><span class="rank-badge ${p.rank <= 3 ? 'rank-' + p.rank : ''}">${p.rank}</span></td>
              <td class="product-name-cell ${p.free ? '' : 'blur'}">${p.name}</td>
              <td class="revenue">${p.revenue}</td>
              <td class="${p.growth.startsWith('+') ? 'positive' : p.growth.startsWith('-') ? 'negative' : ''}">${p.free ? p.growth : '<span class="blur">—</span>'}</td>
              <td>${p.free ? p.itemsSold : '<span class="blur">—</span>'}</td>
              <td>${p.free ? p.avgPrice : '<span class="blur">—</span>'}</td>
              <td>${p.free ? p.commission : '<span class="blur">—</span>'}</td>
              <td>${p.free ? p.creators : '<span class="blur">—</span>'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}
