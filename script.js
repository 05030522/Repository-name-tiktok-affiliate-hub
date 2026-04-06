// ===== Mobile Menu =====
function toggleMenu() {
  const nav = document.getElementById('mainNav');
  if (nav.classList.contains('nav-open')) {
    nav.classList.remove('nav-open');
    nav.style.cssText = '';
  } else {
    nav.classList.add('nav-open');
    nav.style.cssText = 'display:flex;flex-direction:column;position:absolute;top:64px;left:0;right:0;background:#fff;padding:16px 20px;box-shadow:0 4px 12px rgba(0,0,0,0.1);gap:12px;';
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
}

// ===== Paywall Modal =====
function showPaywall() {
  document.getElementById('paywallModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closePaywall() {
  document.getElementById('paywallModal').classList.remove('active');
  document.body.style.overflow = '';
}
document.getElementById('paywallModal')?.addEventListener('click', function(e) {
  if (e.target === this) closePaywall();
});

// ===== Payment Handler (Lemon Squeezy) =====
function handlePayment() {
  const plan = document.querySelector('input[name="plan"]:checked').value;
  const links = {
    monthly: 'https://shoptrendinsider.lemonsqueezy.com/checkout/buy/2b9e60f6-1124-4d2d-9e50-2861a28be774',
    yearly: 'https://shoptrendinsider.lemonsqueezy.com/checkout/buy/3f8736de-7a87-49ea-af15-97e28bc7d7a9',
    insider: 'https://shoptrendinsider.lemonsqueezy.com/checkout/buy/69866d10-2fac-4f3c-8791-92b9edd53dde'
  };
  window.open(links[plan], '_blank');
}

// ===== Email Signup (Google Sheets) =====
// HOW TO SET UP:
// 1. Create a new Google Sheet
// 2. Go to Extensions > Apps Script
// 3. Paste the code from google-apps-script.js in this repo
// 4. Click Deploy > New deployment > Web app
//    - Execute as: Me
//    - Who has access: Anyone
// 5. Copy the deployment URL and paste it below
const GOOGLE_SHEET_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

function handleEmailSubmit(e) {
  e.preventDefault();
  const emailInput = document.getElementById('emailInput');
  const email = emailInput.value;
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;

  // Show loading state
  submitBtn.textContent = 'Subscribing...';
  submitBtn.disabled = true;

  // If Google Sheets URL is not configured, store locally and show success
  if (GOOGLE_SHEET_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
    // Fallback: store in localStorage until Google Sheets is connected
    const subscribers = JSON.parse(localStorage.getItem('trendvault_subscribers') || '[]');
    subscribers.push({ email: email, date: new Date().toISOString(), source: window.location.pathname });
    localStorage.setItem('trendvault_subscribers', JSON.stringify(subscribers));
    submitBtn.textContent = 'Subscribed!';
    emailInput.value = '';
    setTimeout(() => { submitBtn.textContent = originalText; submitBtn.disabled = false; }, 2000);
    return;
  }

  // Send to Google Sheets via Apps Script
  fetch(GOOGLE_SHEET_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: email,
      date: new Date().toISOString(),
      source: window.location.pathname
    })
  })
  .then(() => {
    submitBtn.textContent = 'Subscribed!';
    emailInput.value = '';
    setTimeout(() => { submitBtn.textContent = originalText; submitBtn.disabled = false; }, 2000);
  })
  .catch(() => {
    submitBtn.textContent = 'Error — try again';
    submitBtn.disabled = false;
    setTimeout(() => { submitBtn.textContent = originalText; }, 2000);
  });
}

// ===== Contact Form =====
function handleContactSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  const data = {
    name: form.name.value,
    email: form.email.value,
    topic: form.topic.value,
    message: form.message.value,
    date: new Date().toISOString()
  };

  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;

  if (GOOGLE_SHEET_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
    // Fallback: store locally
    const messages = JSON.parse(localStorage.getItem('trendvault_contacts') || '[]');
    messages.push(data);
    localStorage.setItem('trendvault_contacts', JSON.stringify(messages));
    submitBtn.textContent = 'Message Sent!';
    form.reset();
    setTimeout(() => { submitBtn.textContent = originalText; submitBtn.disabled = false; }, 2000);
    return;
  }

  fetch(GOOGLE_SHEET_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'contact', ...data })
  })
  .then(() => {
    submitBtn.textContent = 'Message Sent!';
    form.reset();
    setTimeout(() => { submitBtn.textContent = originalText; submitBtn.disabled = false; }, 2000);
  })
  .catch(() => {
    submitBtn.textContent = 'Error — try again';
    submitBtn.disabled = false;
    setTimeout(() => { submitBtn.textContent = originalText; }, 2000);
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
    if (window.innerWidth <= 768) {
      nav.classList.remove('nav-open');
      nav.style.cssText = '';
    }
  });
});

// ===== Header scroll shadow =====
window.addEventListener('scroll', () => {
  const header = document.querySelector('.header');
  header.style.boxShadow = window.scrollY > 10 ? '0 1px 8px rgba(0,0,0,0.06)' : 'none';
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
  event.target.classList.add('active');
  // Scroll to top of content
  window.scrollTo({ top: document.querySelector('.tab-nav')?.offsetTop - 64 || 0, behavior: 'smooth' });
}

// Handle hash-based tab switching (e.g. intelligence.html#tab-korean)
window.addEventListener('load', () => {
  const hash = window.location.hash.replace('#', '').replace('tab-', '');
  if (hash && document.getElementById('tab-' + hash)) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('tab-' + hash).classList.add('active');
    // Find matching button
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
  document.querySelectorAll('.faq-q').forEach(q => q.classList.remove('open'));
  // Open clicked (if was closed)
  if (!isOpen) {
    answer.classList.add('open');
    btn.classList.add('open');
  }
}
