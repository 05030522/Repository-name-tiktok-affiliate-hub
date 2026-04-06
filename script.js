// ===== TrendVault Script — Enhanced v2.0 =====

// ===== Configuration =====
// Google Sheets URL — Replace with your deployed Apps Script URL
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbxPRrxO1oX34xRMxVyJxHO303cpLu34DDDVqaGeoxcIUQvL-ZzkdI9pZg7SmdCGuPe7/exec';

// Google Analytics 4 — Replace with your Measurement ID
const GA_MEASUREMENT_ID = 'G-PSW1MY7HB4';

// ===== Google Analytics Setup =====
(function initGA() {
  if (GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') return; // Skip if not configured
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() { dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID);
})();

// ===== Toast Notification System =====
function showToast(message, type = 'success', duration = 3000) {
  // Remove existing toast
  const existing = document.querySelector('.tv-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `tv-toast tv-toast-${type}`;
  toast.innerHTML = `
    <span class="tv-toast-icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
    <span class="tv-toast-msg">${message}</span>
  `;
  document.body.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => toast.classList.add('tv-toast-show'));

  setTimeout(() => {
    toast.classList.remove('tv-toast-show');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ===== Subscription State Management =====
const SubscriptionManager = {
  TIERS: { FREE: 'free', PRO: 'pro', INSIDER: 'insider' },

  getTier() {
    return localStorage.getItem('tv_subscription_tier') || this.TIERS.FREE;
  },

  setTier(tier) {
    localStorage.setItem('tv_subscription_tier', tier);
    localStorage.setItem('tv_subscription_date', new Date().toISOString());
    this.applyTier();
  },

  isPro() {
    const tier = this.getTier();
    return tier === this.TIERS.PRO || tier === this.TIERS.INSIDER;
  },

  isInsider() {
    return this.getTier() === this.TIERS.INSIDER;
  },

  applyTier() {
    const tier = this.getTier();
    if (tier === this.TIERS.FREE) return;

    // Unlock locked rows in data tables
    document.querySelectorAll('.locked-row').forEach(row => {
      row.classList.remove('locked-row');
      row.removeAttribute('onclick');
      row.querySelectorAll('.blur').forEach(el => el.classList.remove('blur'));
    });

    // Unlock locked cards
    document.querySelectorAll('.lock-overlay').forEach(el => el.remove());
    document.querySelectorAll('.product-card.locked').forEach(card => {
      card.classList.remove('locked');
      card.classList.add('free');
    });

    // Unlock hashtag cards
    document.querySelectorAll('.hashtag-card.locked').forEach(card => {
      card.classList.remove('locked');
      card.classList.add('free');
      card.removeAttribute('onclick');
      const badge = card.querySelector('.lock-badge');
      if (badge) badge.remove();
    });

    // Unlock strategy cards
    document.querySelectorAll('.strategy-card.locked').forEach(card => {
      card.classList.remove('locked');
      card.classList.add('free');
      const overlay = card.querySelector('.lock-overlay');
      if (overlay) overlay.remove();
    });

    // Unlock korean cards
    document.querySelectorAll('.korean-card.locked').forEach(card => {
      card.classList.remove('locked');
      card.classList.add('free');
    });

    // Hide unlock banners and paywall triggers
    document.querySelectorAll('.unlock-banner').forEach(el => el.style.display = 'none');

    // Update Go Pro button in nav
    const proCta = document.querySelector('.nav-cta');
    if (proCta) {
      proCta.textContent = tier === 'insider' ? '⭐ Insider' : '✓ Pro';
      proCta.style.background = '#22c55e';
      proCta.href = 'intelligence.html';
    }

    // Track with GA
    if (window.gtag) {
      gtag('event', 'subscription_active', { tier: tier });
    }
  },

  // Check URL params for subscription confirmation (from Lemon Squeezy redirect)
  checkActivation() {
    const params = new URLSearchParams(window.location.search);
    const plan = params.get('plan');
    if (plan && ['pro', 'insider'].includes(plan)) {
      this.setTier(plan);
      showToast(`Welcome to TrendVault ${plan.charAt(0).toUpperCase() + plan.slice(1)}! All content is now unlocked.`, 'success', 5000);
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }
};

// ===== Mobile Menu =====
function toggleMenu() {
  const nav = document.getElementById('mainNav');
  const btn = document.querySelector('.mobile-menu');
  if (nav.classList.contains('nav-open')) {
    nav.classList.remove('nav-open');
    nav.style.cssText = '';
    btn.textContent = '☰';
    btn.setAttribute('aria-expanded', 'false');
  } else {
    nav.classList.add('nav-open');
    nav.style.cssText = 'display:flex;flex-direction:column;position:absolute;top:60px;left:0;right:0;background:rgba(10,10,15,0.98);backdrop-filter:blur(20px);padding:16px 20px;box-shadow:0 4px 24px rgba(0,0,0,0.4);gap:8px;border-bottom:1px solid rgba(255,255,255,0.06);z-index:99;';
    btn.textContent = '✕';
    btn.setAttribute('aria-expanded', 'true');
  }
}

// ===== Product Filter =====
function filterProducts(category) {
  const cards = document.querySelectorAll('.product-card');
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  event.target.classList.add('active');
  cards.forEach(card => {
    const cat = card.dataset.category;
    card.style.display = (category === 'all' || cat === category || cat === 'all') ? 'flex' : 'none';
  });

  // Track filter usage
  if (window.gtag) {
    gtag('event', 'filter_products', { category: category });
  }
}

// ===== Paywall Modal =====
function showPaywall() {
  const modal = document.getElementById('paywallModal');
  if (!modal) return;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  // Focus trap
  const firstBtn = modal.querySelector('button, a, input');
  if (firstBtn) firstBtn.focus();
  // Track
  if (window.gtag) {
    gtag('event', 'paywall_shown', { page: window.location.pathname });
  }
}

function closePaywall() {
  const modal = document.getElementById('paywallModal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// Close modal on backdrop click
document.getElementById('paywallModal')?.addEventListener('click', function(e) {
  if (e.target === this) closePaywall();
});

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closePaywall();
  }
});

// ===== Payment Handler (Lemon Squeezy) =====
function handlePayment() {
  const planInput = document.querySelector('input[name="plan"]:checked');
  if (!planInput) {
    showToast('Please select a plan first.', 'error');
    return;
  }
  const plan = planInput.value;
  const links = {
    monthly: 'https://shoptrendinsider.lemonsqueezy.com/checkout/buy/2b9e60f6-1124-4d2d-9e50-2861a28be774',
    yearly: 'https://shoptrendinsider.lemonsqueezy.com/checkout/buy/3f8736de-7a87-49ea-af15-97e28bc7d7a9',
    insider: 'https://shoptrendinsider.lemonsqueezy.com/checkout/buy/69866d10-2fac-4f3c-8791-92b9edd53dde'
  };
  // Track conversion
  if (window.gtag) {
    gtag('event', 'begin_checkout', { plan: plan });
  }
  window.open(links[plan], '_blank');
}

// ===== Email Signup =====
function handleEmailSubmit(e) {
  e.preventDefault();
  const emailInput = document.getElementById('emailInput');
  const email = emailInput.value.trim();
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;

  // Validation
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast('Please enter a valid email address.', 'error');
    return;
  }

  // Check duplicate
  const subscribers = JSON.parse(localStorage.getItem('trendvault_subscribers') || '[]');
  if (subscribers.some(s => s.email === email)) {
    showToast('You\'re already subscribed! Check your inbox for weekly updates.', 'info');
    emailInput.value = '';
    return;
  }

  // Loading state
  submitBtn.textContent = 'Subscribing...';
  submitBtn.disabled = true;
  submitBtn.style.opacity = '0.7';

  const subscribeData = { email, date: new Date().toISOString(), source: window.location.pathname };

  // Store locally (always, as backup)
  subscribers.push(subscribeData);
  localStorage.setItem('trendvault_subscribers', JSON.stringify(subscribers));

  if (GOOGLE_SHEET_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
    // Local-only mode
    setTimeout(() => {
      showToast('Welcome! You\'ll receive weekly trend insights every Monday.', 'success');
      emailInput.value = '';
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      submitBtn.style.opacity = '';
    }, 600);

    if (window.gtag) {
      gtag('event', 'subscribe', { method: 'local' });
    }
    return;
  }

  // Send to Google Sheets
  fetch(GOOGLE_SHEET_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(subscribeData)
  })
  .then(() => {
    showToast('Welcome! You\'ll receive weekly trend insights every Monday.', 'success');
    emailInput.value = '';
    if (window.gtag) {
      gtag('event', 'subscribe', { method: 'google_sheets' });
    }
  })
  .catch((err) => {
    showToast('Subscription saved! You\'re all set.', 'success');
    console.warn('Google Sheets sync failed (saved locally):', err);
  })
  .finally(() => {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    submitBtn.style.opacity = '';
  });
}

// ===== Contact Form =====
function handleContactSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;

  const data = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    topic: form.topic.value,
    message: form.message.value.trim(),
    date: new Date().toISOString()
  };

  // Validation
  if (!data.name || !data.email || !data.message) {
    showToast('Please fill in all required fields.', 'error');
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    showToast('Please enter a valid email address.', 'error');
    return;
  }

  if (data.message.length < 10) {
    showToast('Please write a longer message (at least 10 characters).', 'error');
    return;
  }

  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;
  submitBtn.style.opacity = '0.7';

  // Store locally always
  const messages = JSON.parse(localStorage.getItem('trendvault_contacts') || '[]');
  messages.push(data);
  localStorage.setItem('trendvault_contacts', JSON.stringify(messages));

  if (GOOGLE_SHEET_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
    setTimeout(() => {
      showToast('Message sent! We\'ll reply within 24 hours.', 'success');
      form.reset();
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      submitBtn.style.opacity = '';
    }, 600);
    return;
  }

  fetch(GOOGLE_SHEET_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'contact', ...data })
  })
  .then(() => {
    showToast('Message sent! We\'ll reply within 24 hours.', 'success');
    form.reset();
  })
  .catch((err) => {
    showToast('Message saved! We\'ll get back to you soon.', 'success');
    console.warn('Google Sheets sync failed (saved locally):', err);
  })
  .finally(() => {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    submitBtn.style.opacity = '';
  });
}

// ===== Lock overlay clicks =====
document.querySelectorAll('.lock-overlay').forEach(el => {
  el.addEventListener('click', function(e) {
    e.stopPropagation();
    showPaywall();
  });
});

// ===== Smooth scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // Close mobile menu
    const nav = document.getElementById('mainNav');
    if (nav && window.innerWidth <= 768) {
      nav.classList.remove('nav-open');
      nav.style.cssText = '';
      const btn = document.querySelector('.mobile-menu');
      if (btn) {
        btn.textContent = '☰';
        btn.setAttribute('aria-expanded', 'false');
      }
    }
  });
});

// ===== Header scroll shadow =====
window.addEventListener('scroll', () => {
  const header = document.querySelector('.header');
  if (header) {
    header.style.boxShadow = window.scrollY > 10 ? '0 2px 20px rgba(0,0,0,0.3)' : 'none';
  }
});

// ===== Tab Switching =====
function switchTab(tabName) {
  // Hide all tabs
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  // Show selected
  const tab = document.getElementById('tab-' + tabName);
  if (tab) tab.classList.add('active');
  // Highlight button
  if (event && event.target) event.target.classList.add('active');
  // Scroll to top of content
  const tabNav = document.querySelector('.tab-nav');
  if (tabNav) {
    window.scrollTo({ top: tabNav.offsetTop - 64, behavior: 'smooth' });
  }
  // Track
  if (window.gtag) {
    gtag('event', 'tab_switch', { tab: tabName });
  }
}

// Handle hash-based tab switching
window.addEventListener('load', () => {
  const hash = window.location.hash.replace('#', '').replace('tab-', '');
  if (hash && document.getElementById('tab-' + hash)) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('tab-' + hash).classList.add('active');
    document.querySelectorAll('.tab-btn').forEach(b => {
      if (b.textContent.toLowerCase().includes(hash.substring(0, 4))) b.classList.add('active');
    });
  }
});

// ===== FAQ Toggle =====
function toggleFaq(btn) {
  const answer = btn.nextElementSibling;
  const isOpen = answer.classList.contains('open');
  // Close all
  document.querySelectorAll('.faq-a').forEach(a => a.classList.remove('open'));
  document.querySelectorAll('.faq-q').forEach(q => {
    q.classList.remove('open');
    q.setAttribute('aria-expanded', 'false');
  });
  // Open clicked (if was closed)
  if (!isOpen) {
    answer.classList.add('open');
    btn.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
  }
}

// ===== Initialization =====
document.addEventListener('DOMContentLoaded', () => {
  // Check subscription activation from URL params
  SubscriptionManager.checkActivation();
  // Apply current subscription tier
  SubscriptionManager.applyTier();

  // Add ARIA attributes to mobile menu button
  const mobileBtn = document.querySelector('.mobile-menu');
  if (mobileBtn) {
    mobileBtn.setAttribute('aria-label', 'Toggle navigation menu');
    mobileBtn.setAttribute('aria-expanded', 'false');
  }

  // Add ARIA to FAQ buttons
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.setAttribute('role', 'button');
    btn.setAttribute('aria-expanded', 'false');
  });

  // Lazy load images if any exist
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[data-src]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    });
    lazyImages.forEach(img => observer.observe(img));
  }

  // Track page view
  if (window.gtag) {
    gtag('event', 'page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname
    });
  }
});

// ===== Dev Mode: Quick tier switching for testing =====
// Usage in console: TrendVault.setTier('pro') or TrendVault.setTier('free')
window.TrendVault = {
  setTier: (tier) => {
    SubscriptionManager.setTier(tier);
    showToast(`Tier set to: ${tier}. Refresh to see full changes.`, 'info');
  },
  getTier: () => SubscriptionManager.getTier(),
  reset: () => {
    localStorage.removeItem('tv_subscription_tier');
    localStorage.removeItem('tv_subscription_date');
    showToast('Subscription reset to Free. Refresh page.', 'info');
  }
};
