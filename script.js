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

// ===== Payment Handler =====
function handlePayment() {
  const plan = document.querySelector('input[name="plan"]:checked').value;
  const prices = { monthly: '$15/mo', yearly: '$149/yr', insider: '$29/mo' };
  // TODO: Integrate Stripe Checkout
  alert(`You selected: ${plan} (${prices[plan]})\n\nPayment integration coming soon!`);
}

// ===== Email Signup =====
function handleEmailSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('emailInput').value;
  // TODO: Connect to email service (Ghost, Beehiiv, ConvertKit, etc.)
  alert(`Thanks for subscribing! We'll send weekly insights to ${email}`);
  document.getElementById('emailInput').value = '';
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
