// ===== TrendVault Script — v3.0 (Server Auth) =====

// ===== Configuration =====
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbxPRrxO1oX34xRMxVyJxHO303cpLu34DDDVqaGeoxcIUQvL-ZzkdI9pZg7SmdCGuPe7/exec';
const GA_MEASUREMENT_ID = 'G-PSW1MY7HB4';

// ===== Google Analytics Setup =====
(function initGA() {
  if (GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') return;
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
  const existing = document.querySelector('.tv-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `tv-toast tv-toast-${type}`;
  toast.innerHTML = `
    <span class="tv-toast-icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
    <span class="tv-toast-msg">${message}</span>
  `;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('tv-toast-show'));
  setTimeout(() => {
    toast.classList.remove('tv-toast-show');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ===== Auth Manager (Server-based) =====
const AuthManager = {
  _state: { authenticated: false, email: null, tier: 'free' },

  async init() {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      if (res.ok) {
        this._state = await res.json();
      }
    } catch (e) {
      this._state = { authenticated: false, email: null, tier: 'free' };
    }
    this.applyTier();
    this.updateNavUI();
    this.checkPaymentReturn();
  },

  isPro() {
    return this._state.tier === 'pro' || this._state.tier === 'insider';
  },

  isInsider() {
    return this._state.tier === 'insider';
  },

  isAuthenticated() {
    return this._state.authenticated;
  },

  getEmail() {
    return this._state.email;
  },

  getTier() {
    return this._state.tier;
  },

  async sendCode(email) {
    const res = await fetch('/api/auth/send-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
      credentials: 'include'
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to send code');
    return data;
  },

  async verifyCode(email, code) {
    const res = await fetch('/api/auth/verify-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
      credentials: 'include'
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Verification failed');
    this._state = { authenticated: true, email: data.email, tier: data.tier };
    this.applyTier();
    this.updateNavUI();
    await this.loadFullData();
    return data;
  },

  async logout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch (e) {}
    this._state = { authenticated: false, email: null, tier: 'free' };
    this.updateNavUI();
    showToast('Logged out successfully.', 'info');
    setTimeout(() => window.location.reload(), 1000);
  },

  async loadFullData() {
    if (!this.isPro()) return;
    try {
      const res = await fetch('/api/data', { credentials: 'include' });
      if (!res.ok) return;
      const data = await res.json();
      // Re-render tables with full data if render functions exist
      if (data.brands && typeof renderBrandsFromData === 'function') {
        renderBrandsFromData('brandsContainer', data.brands);
      }
      if (data.categories && typeof renderCategoriesFromData === 'function') {
        renderCategoriesFromData('categoriesContainer', data.categories);
      }
      if (data.products && typeof renderProductsFromData === 'function') {
        renderProductsFromData('productsContainer', data.products);
      }
    } catch (e) {
      console.warn('Failed to load full data:', e);
    }
  },

  applyTier() {
    if (!this.isPro()) return;

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

    // Hide unlock banners
    document.querySelectorAll('.unlock-banner').forEach(el => el.style.display = 'none');
  },

  updateNavUI() {
    const proCta = document.querySelector('.nav-cta');
    if (!proCta) return;

    if (this._state.authenticated) {
      if (this.isPro()) {
        proCta.textContent = this._state.tier === 'insider' ? '⭐ Insider' : '✓ Pro';
        proCta.style.background = '#22c55e';
        proCta.href = '#';
        proCta.onclick = (e) => { e.preventDefault(); showAccountMenu(); };
      } else {
        proCta.textContent = 'Go Pro';
        proCta.href = 'pricing.html';
      }
    } else {
      proCta.textContent = 'Go Pro';
      proCta.href = 'pricing.html';
    }
  },

  checkPaymentReturn() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success') {
      showToast('Payment successful! Log in with your email to unlock all content.', 'success', 6000);
      showLoginModal();
      window.history.replaceState({}, '', window.location.pathname);
    }
  }
};

// ===== Login Modal =====
function createLoginModal() {
  if (document.getElementById('loginModal')) return;

  const modal = document.createElement('div');
  modal.id = 'loginModal';
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content" style="max-width:380px">
      <button class="modal-close" onclick="closeLoginModal()">&times;</button>
      <h2 style="margin-bottom:6px">Sign In</h2>
      <p style="color:rgba(255,255,255,0.4);font-size:13px;margin-bottom:20px">Enter your email to receive a login code</p>

      <div id="loginStep1">
        <input type="email" id="loginEmail" placeholder="your@email.com" class="email-input" style="width:100%;margin-bottom:12px" aria-label="Email address">
        <button onclick="handleSendCode()" class="btn btn-primary btn-full" id="sendCodeBtn">Send Login Code</button>
      </div>

      <div id="loginStep2" style="display:none">
        <p style="font-size:13px;color:rgba(255,255,255,0.5);margin-bottom:14px">Code sent to <strong id="loginEmailDisplay" style="color:#fff"></strong></p>
        <input type="text" id="loginCode" placeholder="Enter 6-digit code" class="email-input" style="width:100%;margin-bottom:12px;text-align:center;font-size:20px;letter-spacing:6px" maxlength="6" aria-label="Verification code">
        <button onclick="handleVerifyCode()" class="btn btn-primary btn-full" id="verifyCodeBtn">Verify & Sign In</button>
        <button onclick="resetLoginModal()" style="background:none;border:none;color:rgba(255,255,255,0.3);font-size:12px;cursor:pointer;margin-top:10px;display:block;width:100%;text-align:center">Use a different email</button>
      </div>

      <p style="font-size:11px;color:rgba(255,255,255,0.2);margin-top:16px">No password needed. We'll email you a code.</p>
    </div>
  `;
  document.body.appendChild(modal);

  modal.addEventListener('click', function(e) {
    if (e.target === this) closeLoginModal();
  });
}

function showLoginModal() {
  createLoginModal();
  document.getElementById('loginModal').classList.add('active');
  document.body.style.overflow = 'hidden';
  document.getElementById('loginEmail').focus();
  if (window.gtag) gtag('event', 'login_modal_shown');
}

function closeLoginModal() {
  const modal = document.getElementById('loginModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function resetLoginModal() {
  document.getElementById('loginStep1').style.display = 'block';
  document.getElementById('loginStep2').style.display = 'none';
  document.getElementById('loginEmail').value = '';
  document.getElementById('loginCode').value = '';
}

async function handleSendCode() {
  const emailInput = document.getElementById('loginEmail');
  const email = emailInput.value.trim();
  const btn = document.getElementById('sendCodeBtn');

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast('Please enter a valid email address.', 'error');
    return;
  }

  btn.textContent = 'Sending...';
  btn.disabled = true;

  try {
    await AuthManager.sendCode(email);
    document.getElementById('loginStep1').style.display = 'none';
    document.getElementById('loginStep2').style.display = 'block';
    document.getElementById('loginEmailDisplay').textContent = email;
    document.getElementById('loginCode').focus();
    showToast('Code sent! Check your email.', 'success');
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    btn.textContent = 'Send Login Code';
    btn.disabled = false;
  }
}

async function handleVerifyCode() {
  const email = document.getElementById('loginEmail').value.trim();
  const code = document.getElementById('loginCode').value.trim();
  const btn = document.getElementById('verifyCodeBtn');

  if (!code || code.length !== 6) {
    showToast('Please enter the 6-digit code.', 'error');
    return;
  }

  btn.textContent = 'Verifying...';
  btn.disabled = true;

  try {
    const result = await AuthManager.verifyCode(email, code);
    closeLoginModal();
    if (result.tier === 'pro' || result.tier === 'insider') {
      showToast(`Welcome back! You have ${result.tier.charAt(0).toUpperCase() + result.tier.slice(1)} access.`, 'success', 5000);
    } else {
      showToast('Signed in successfully!', 'success');
    }
    if (window.gtag) gtag('event', 'login', { tier: result.tier });
  } catch (err) {
    showToast(err.message, 'error');
    btn.textContent = 'Verify & Sign In';
    btn.disabled = false;
  }
}

// ===== Account Menu =====
function showAccountMenu() {
  const email = AuthManager.getEmail();
  const tier = AuthManager.getTier();

  if (document.querySelector('.account-dropdown')) {
    document.querySelector('.account-dropdown').remove();
    return;
  }

  const dropdown = document.createElement('div');
  dropdown.className = 'account-dropdown';
  dropdown.innerHTML = `
    <div style="padding:14px 18px;border-bottom:1px solid rgba(255,255,255,0.06)">
      <div style="font-size:13px;font-weight:600;color:#fff">${email}</div>
      <div style="font-size:11px;color:rgba(255,255,255,0.3);margin-top:2px">${tier.charAt(0).toUpperCase() + tier.slice(1)} Member</div>
    </div>
    <button onclick="AuthManager.logout();document.querySelector('.account-dropdown')?.remove()" style="width:100%;padding:10px 18px;background:none;border:none;color:#fe2c55;font-size:13px;cursor:pointer;text-align:left">Sign Out</button>
  `;
  document.querySelector('.header .container').appendChild(dropdown);

  setTimeout(() => {
    document.addEventListener('click', function closeDropdown(e) {
      if (!dropdown.contains(e.target)) {
        dropdown.remove();
        document.removeEventListener('click', closeDropdown);
      }
    });
  }, 10);
}

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
  if (window.gtag) gtag('event', 'filter_products', { category });
}

// ===== Paywall Modal =====
function showPaywall() {
  const modal = document.getElementById('paywallModal');
  if (!modal) return;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  if (window.gtag) gtag('event', 'paywall_shown', { page: window.location.pathname });
}

function closePaywall() {
  const modal = document.getElementById('paywallModal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

document.getElementById('paywallModal')?.addEventListener('click', function(e) {
  if (e.target === this) closePaywall();
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closePaywall();
    closeLoginModal();
  }
});

// ===== Payment Handler =====
function handlePayment() {
  const planInput = document.querySelector('input[name="plan"]:checked');
  if (!planInput) {
    showToast('Please select a plan first.', 'error');
    return;
  }
  const plan = planInput.value;
  const baseLinks = {
    monthly: 'https://shoptrendinsider.lemonsqueezy.com/checkout/buy/2b9e60f6-1124-4d2d-9e50-2861a28be774',
    yearly: 'https://shoptrendinsider.lemonsqueezy.com/checkout/buy/3f8736de-7a87-49ea-af15-97e28bc7d7a9',
    insider: 'https://shoptrendinsider.lemonsqueezy.com/checkout/buy/69866d10-2fac-4f3c-8791-92b9edd53dde'
  };

  let url = baseLinks[plan];

  // Add redirect URL
  const redirectUrl = window.location.origin + '/pricing.html?payment=success';
  url += '?checkout[custom][redirect_url]=' + encodeURIComponent(redirectUrl);

  // Prefill email if logged in
  if (AuthManager.isAuthenticated()) {
    url += '&checkout[email]=' + encodeURIComponent(AuthManager.getEmail());
  }

  if (window.gtag) gtag('event', 'begin_checkout', { plan });
  window.open(url, '_blank');
}

// ===== Email Signup =====
function handleEmailSubmit(e) {
  e.preventDefault();
  const emailInput = document.getElementById('emailInput');
  const email = emailInput.value.trim();
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast('Please enter a valid email address.', 'error');
    return;
  }

  const subscribers = JSON.parse(localStorage.getItem('trendvault_subscribers') || '[]');
  if (subscribers.some(s => s.email === email)) {
    showToast('You\'re already subscribed!', 'info');
    emailInput.value = '';
    return;
  }

  submitBtn.textContent = 'Subscribing...';
  submitBtn.disabled = true;
  submitBtn.style.opacity = '0.7';

  const subscribeData = { email, date: new Date().toISOString(), source: window.location.pathname };
  subscribers.push(subscribeData);
  localStorage.setItem('trendvault_subscribers', JSON.stringify(subscribers));

  fetch(GOOGLE_SHEET_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(subscribeData)
  })
  .then(() => {
    showToast('Welcome! Weekly insights every Monday.', 'success');
    emailInput.value = '';
    if (window.gtag) gtag('event', 'subscribe');
  })
  .catch(() => {
    showToast('Subscribed! You\'re all set.', 'success');
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

  if (!data.name || !data.email || !data.message) {
    showToast('Please fill in all required fields.', 'error');
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    showToast('Please enter a valid email address.', 'error');
    return;
  }

  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;
  submitBtn.style.opacity = '0.7';

  const messages = JSON.parse(localStorage.getItem('trendvault_contacts') || '[]');
  messages.push(data);
  localStorage.setItem('trendvault_contacts', JSON.stringify(messages));

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
  .catch(() => {
    showToast('Message saved! We\'ll get back to you soon.', 'success');
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
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const nav = document.getElementById('mainNav');
    if (nav && window.innerWidth <= 768) {
      nav.classList.remove('nav-open');
      nav.style.cssText = '';
      const btn = document.querySelector('.mobile-menu');
      if (btn) { btn.textContent = '☰'; btn.setAttribute('aria-expanded', 'false'); }
    }
  });
});

// ===== Header scroll shadow =====
window.addEventListener('scroll', () => {
  const header = document.querySelector('.header');
  if (header) header.style.boxShadow = window.scrollY > 10 ? '0 2px 20px rgba(0,0,0,0.3)' : 'none';
});

// ===== Tab Switching =====
function switchTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  const tab = document.getElementById('tab-' + tabName);
  if (tab) tab.classList.add('active');
  if (event && event.target) event.target.classList.add('active');
  const tabNav = document.querySelector('.tab-nav');
  if (tabNav) window.scrollTo({ top: tabNav.offsetTop - 64, behavior: 'smooth' });
  if (window.gtag) gtag('event', 'tab_switch', { tab: tabName });
}

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
  document.querySelectorAll('.faq-a').forEach(a => a.classList.remove('open'));
  document.querySelectorAll('.faq-q').forEach(q => { q.classList.remove('open'); q.setAttribute('aria-expanded', 'false'); });
  if (!isOpen) { answer.classList.add('open'); btn.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
}

// ===== Initialization =====
document.addEventListener('DOMContentLoaded', () => {
  AuthManager.init();

  const mobileBtn = document.querySelector('.mobile-menu');
  if (mobileBtn) {
    mobileBtn.setAttribute('aria-label', 'Toggle navigation menu');
    mobileBtn.setAttribute('aria-expanded', 'false');
  }

  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.setAttribute('role', 'button');
    btn.setAttribute('aria-expanded', 'false');
  });

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

  if (window.gtag) {
    gtag('event', 'page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname
    });
  }
});

// ===== Global API =====
window.TrendVault = {
  login: () => showLoginModal(),
  logout: () => AuthManager.logout(),
  status: () => console.log(AuthManager._state)
};
