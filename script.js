// ===== Mobile Menu Toggle =====
function toggleMenu() {
  const nav = document.querySelector('.nav');
  nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
  if (nav.style.display === 'flex') {
    nav.style.flexDirection = 'column';
    nav.style.position = 'absolute';
    nav.style.top = '64px';
    nav.style.left = '0';
    nav.style.right = '0';
    nav.style.background = '#fff';
    nav.style.padding = '16px 20px';
    nav.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
  }
}

// ===== Product Filter =====
function filterProducts(category) {
  const cards = document.querySelectorAll('.product-card');
  const chips = document.querySelectorAll('.chip');

  chips.forEach(c => c.classList.remove('active'));
  event.target.classList.add('active');

  cards.forEach(card => {
    if (category === 'all' || card.dataset.category === category) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
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

// Close modal on backdrop click
document.getElementById('paywallModal')?.addEventListener('click', function(e) {
  if (e.target === this) closePaywall();
});

// ===== Payment Handler =====
function handlePayment() {
  const plan = document.querySelector('input[name="plan"]:checked').value;
  const price = plan === 'monthly' ? '9,900' : '79,000';

  // TODO: 실제 결제 연동 (Stripe, Toss Payments 등)
  alert(`${plan === 'monthly' ? '월간' : '연간'} PRO 구독 (₩${price})\n\n결제 시스템 준비 중입니다.\n곧 오픈 예정!`);
}

// ===== Locked Content Click → Show Paywall =====
document.querySelectorAll('.lock-overlay').forEach(el => {
  el.addEventListener('click', showPaywall);
});
document.querySelectorAll('.hashtag-card.locked').forEach(el => {
  el.addEventListener('click', showPaywall);
});
document.querySelectorAll('.strategy-card.locked').forEach(el => {
  el.addEventListener('click', showPaywall);
});

// ===== Smooth scroll for nav links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // Close mobile menu
    const nav = document.querySelector('.nav');
    if (window.innerWidth <= 768) {
      nav.style.display = 'none';
    }
  });
});

// ===== Header scroll effect =====
window.addEventListener('scroll', () => {
  const header = document.querySelector('.header');
  if (window.scrollY > 10) {
    header.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)';
  } else {
    header.style.boxShadow = 'none';
  }
});
