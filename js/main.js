function initMobileNav() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 16);
    });
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }
}

function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  const navbar = document.getElementById('navbar');

  if (!navbar || sections.length === 0 || navAnchors.length === 0) return;

  function updateActiveLink() {
    const scrollPos = window.scrollY + navbar.offsetHeight + 100;
    let current = '';

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    navAnchors.forEach((anchor) => {
      anchor.classList.toggle('active', anchor.getAttribute('href') === `#${current}`);
    });
  }

  window.addEventListener('scroll', updateActiveLink);
  updateActiveLink();
}

function initLanguageSelector() {
  const trigger = document.getElementById('lang-select-trigger');
  const dropdown = document.getElementById('lang-select-dropdown');
  const current = document.getElementById('lang-select-current');

  if (!trigger || !dropdown) return;

  function updateCurrentLabel() {
    if (current && window.I18n) {
      current.textContent = window.I18n.t(`lang.${window.I18n.getLanguage()}`);
    }
  }

  function toggle(open) {
    dropdown.classList.toggle('open', open);
    trigger.setAttribute('aria-expanded', String(open));
  }

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = dropdown.classList.contains('open');
    toggle(!isOpen);
  });

  dropdown.querySelectorAll('[data-lang]').forEach((item) => {
    item.addEventListener('click', () => {
      const lang = item.getAttribute('data-lang');
      if (window.I18n) {
        window.I18n.setLanguage(lang);
      }
      updateCurrentLabel();
      toggle(false);
    });

    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target) && e.target !== trigger) {
      toggle(false);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggle(false);
  });

  window.addEventListener('modelflow:languagechange', updateCurrentLabel);
  updateCurrentLabel();
}

function initPricingToggle() {
  const card = document.querySelector('[data-pricing-card="pro"]');
  if (!card) return;

  const buttons = card.querySelectorAll('[data-billing]');
  const priceEl = document.getElementById('pro-price');
  const billingEl = document.getElementById('pro-billing');
  const btnEl = document.getElementById('pro-btn');
  const saveEl = document.getElementById('pricing-save');

  if (!priceEl || !billingEl || !btnEl) return;

  function applyBilling(billing) {
    buttons.forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-billing') === billing);
    });

    if (billing === 'yearly') {
      priceEl.setAttribute('data-i18n', 'pricing.proYearlyPrice');
      billingEl.setAttribute('data-i18n', 'pricing.proYearlyBilling');
      btnEl.setAttribute('data-i18n', 'pricing.proYearlyBtn');
      if (saveEl) saveEl.style.display = 'inline-block';
    } else {
      priceEl.setAttribute('data-i18n', 'pricing.proMonthlyPrice');
      billingEl.setAttribute('data-i18n', 'pricing.proMonthlyBilling');
      btnEl.setAttribute('data-i18n', 'pricing.proMonthlyBtn');
      if (saveEl) saveEl.style.display = 'none';
    }

    if (window.I18n) {
      window.I18n.render();
    }
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const billing = btn.getAttribute('data-billing');
      applyBilling(billing);
    });
  });
}

function updateDocsLink() {
  const links = document.querySelectorAll('[data-docs-link]');
  if (!window.I18n || links.length === 0) return;
  const lang = window.I18n.getLanguage();
  links.forEach((link) => {
    link.href = `./docs/${lang}/index.html`;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initScrollSpy();
  initLanguageSelector();
  initPricingToggle();
  updateDocsLink();
});

window.addEventListener('modelflow:languagechange', updateDocsLink);
