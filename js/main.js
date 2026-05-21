/**
 * MAIN INTERACTION ENGINE - AUTO SPORT CENTRO AUTOMOTIVO
 * Vanilla JavaScript - Zero Dependencies - Highly Performant
 */

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initNavbarScroll();
  initMobileMenu();
  initScrollReveal();
  initBeforeAfterSlider();
  initStatsCounters();
  initBookingSimulator();
});

/* ==========================================================================
   1. PREMIUM LOADING SCREEN FADEOUT
   ========================================================================== */
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  // Let loading screen stand for 1.2s to show off premium feel, then fade out
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('fade-out');
      // Enable keyboard interactions on main content after reveal
      document.getElementById('main-content').focus();
    }, 1200);
  });
}

/* ==========================================================================
   2. NAVBAR STICKY GLASSMORPHIC EFFECT
   ========================================================================== */
function initNavbarScroll() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('navbar-scrolled');
    } else {
      nav.classList.remove('navbar-scrolled');
    }
  });
}

/* ==========================================================================
   3. MOBILE NAVIGATION HAMBURGER MENU
   ========================================================================== */
function initMobileMenu() {
  const burger = document.getElementById('burger-btn');
  const menu = document.getElementById('nav-menu');
  const links = document.querySelectorAll('.nav-link');

  if (!burger || !menu) return;

  function toggleMenu() {
    const isExpanded = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', !isExpanded);
    menu.classList.toggle('active');
    
    // Animate burger lines
    const lines = burger.querySelectorAll('.burger-line');
    if (!isExpanded) {
      lines[0].style.transform = 'translateY(8px) rotate(45deg)';
      lines[1].style.opacity = '0';
      lines[2].style.transform = 'translateY(-8px) rotate(-45deg)';
    } else {
      lines[0].style.transform = 'none';
      lines[1].style.opacity = '1';
      lines[2].style.transform = 'none';
    }
  }

  burger.addEventListener('click', toggleMenu);

  // Close menu when clicking links
  links.forEach(link => {
    link.addEventListener('click', () => {
      if (menu.classList.contains('active')) {
        toggleMenu();
      }
    });
  });
}

/* ==========================================================================
   4. SCROLL REVEAL VIA NATIVE INTERSECTIONOBSERVER
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Once animated, stop observing this item
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback if browser doesn't support IntersectionObserver
    revealElements.forEach(el => el.classList.add('revealed'));
  }
}

/* ==========================================================================
   5. ACCESSIBLE BEFORE/AFTER COMPARISON SLIDER
   ========================================================================== */
function initBeforeAfterSlider() {
  const container = document.getElementById('wow-slider');
  const afterImage = document.getElementById('slider-after');
  const handle = document.getElementById('slider-handle');
  const rangeInput = document.getElementById('slider-range');

  if (!container || !afterImage || !handle || !rangeInput) return;

  function updateSlider(percent) {
    // Restrain bounds
    const value = Math.max(0, Math.min(100, percent));
    
    // Update clip-path of after-image (right side reveals glossy finish)
    afterImage.style.clipPath = `polygon(0 0, ${value}% 0, ${value}% 100%, 0 100%)`;
    
    // Move divider line
    handle.style.left = `${value}%`;
  }

  // Sychronize with accessible HTML5 range input
  rangeInput.addEventListener('input', (e) => {
    updateSlider(e.target.value);
  });
}

/* ==========================================================================
   6. HIGH-PRECISION NUMERIC COUNT-UP STATS
   ========================================================================== */
function initStatsCounters() {
  const stats = document.querySelectorAll('.stat-number');
  if (!stats.length) return;

  function animateCounter(el) {
    const target = parseFloat(el.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    let startTime = null;

    function countUp(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      // Easing function (easeOutQuad)
      const easeVal = percentage * (2 - percentage);
      
      const current = Math.floor(easeVal * target);
      el.textContent = current.toLocaleString('pt-BR') + (el.getAttribute('data-suffix') || '');

      if (progress < duration) {
        requestAnimationFrame(countUp);
      } else {
        el.textContent = target.toLocaleString('pt-BR') + (el.getAttribute('data-suffix') || '');
      }
    }

    requestAnimationFrame(countUp);
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    stats.forEach(stat => observer.observe(stat));
  } else {
    stats.forEach(stat => {
      stat.textContent = stat.getAttribute('data-target') + (stat.getAttribute('data-suffix') || '');
    });
  }
}

/* ==========================================================================
   7. DYNAMIC BOOKING & PAYMENT SIMULATOR ENGINE
   ========================================================================== */
function initBookingSimulator() {
  // Simulator DOM Elements
  const carButtons = document.querySelectorAll('.car-btn');
  const serviceCards = document.querySelectorAll('.option-card');
  const priceDisplay = document.getElementById('sim-total-price');
  const pixPriceDisplay = document.getElementById('pix-price');
  const cardPriceDisplay = document.getElementById('card-price');
  const bookingForm = document.getElementById('sim-booking-form');
  const submitBtn = document.getElementById('sim-submit-btn');

  if (!priceDisplay) return;

  // Detailing Pricing Matrix mapped to Linhares region context
  const pricingData = {
    // Multipliers based on vehicle size / detailing surface workload
    multipliers: {
      hatch_sedan: 1.0,
      suv: 1.25,
      pickup_super: 1.45
    },
    // Base service prices for Hatch/Sedan porte
    baseServices: {
      ppf: 8000,
      vitrificacao: 1500,
      peliculas: 800,
      detalhamento: 500
    }
  };

  let activeCarType = 'hatch_sedan';
  const selectedServices = new Set(['ppf']); // Default selected

  // 7a. Vehicle selector triggers
  carButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      carButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      activeCarType = btn.getAttribute('data-type');
      calculatePrices();
    });
  });

  // 7b. Service selector triggers
  serviceCards.forEach(card => {
    card.addEventListener('click', () => {
      const serviceId = card.getAttribute('data-service');
      if (selectedServices.has(serviceId)) {
        // Must keep at least one service selected
        if (selectedServices.size > 1) {
          selectedServices.delete(serviceId);
          card.classList.remove('selected');
          card.setAttribute('aria-checked', 'false');
        }
      } else {
        selectedServices.add(serviceId);
        card.classList.add('selected');
        card.setAttribute('aria-checked', 'true');
      }
      calculatePrices();
    });
  });

  // 7c. Price Engine calculator
  function calculatePrices() {
    const multiplier = pricingData.multipliers[activeCarType];
    let subtotal = 0;

    selectedServices.forEach(serviceId => {
      const basePrice = pricingData.baseServices[serviceId];
      subtotal += basePrice * multiplier;
    });

    // Payment splits logic
    const pixTotal = subtotal * 0.90; // 10% Cash/PIX Discount
    const cardInstallment = subtotal / 12; // 12x split

    // Render cleanly without trigger shifts (Tabular numerals)
    priceDisplay.textContent = formatCurrency(subtotal);
    pixPriceDisplay.textContent = formatCurrency(pixTotal);
    cardPriceDisplay.textContent = `${formatCurrency(cardInstallment)}`;
  }

  function formatCurrency(value) {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }

  // 7d. Form validation and WhatsApp lead extraction
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const clientName = document.getElementById('client-name');
      const clientPhone = document.getElementById('client-phone');
      const clientDate = document.getElementById('client-date');

      let isValid = true;
      let firstErrorField = null;

      // Simple robust validation
      [clientName, clientPhone, clientDate].forEach(field => {
        const errorEl = document.getElementById(`${field.id}-error`);
        if (!field.value.trim()) {
          isValid = false;
          errorEl.style.display = 'block';
          field.setAttribute('aria-invalid', 'true');
          if (!firstErrorField) firstErrorField = field;
        } else {
          errorEl.style.display = 'none';
          field.setAttribute('aria-invalid', 'false');
        }
      });

      if (!isValid) {
        if (firstErrorField) firstErrorField.focus();
        return;
      }

      // Format WhatsApp details
      submitBtn.textContent = 'Enviando Orçamento…';
      submitBtn.disabled = true;

      // Extract details
      const carNames = {
        hatch_sedan: 'Hatch / Sedan',
        suv: 'SUV / Crossover',
        pickup_super: 'Picape / Superesportivo'
      };
      
      const serviceNames = {
        ppf: 'Aplicação de PPF (Full Body)',
        vitrificacao: 'Vitrificação de Pintura (9H)',
        peliculas: 'Películas Térmicas Premium',
        detalhamento: 'Detalhamento Técnico de Interior'
      };

      const selectedNames = [];
      selectedServices.forEach(id => selectedNames.push(serviceNames[id]));

      const rawTotal = priceDisplay.textContent;
      const pixTotal = pixPriceDisplay.textContent;
      const cardInstallmentText = cardPriceDisplay.textContent;

      // Formulate A/B conversions template message (Variação 1: Direta/Completa)
      const waText = `Olá Auto Sport! Gostaria de agendar o orçamento simulado no site:\n\n` +
                     `👤 *Nome:* ${clientName.value}\n` +
                     `📞 *Telefone:* ${clientPhone.value}\n` +
                     `📅 *Data Sugerida:* ${formatDate(clientDate.value)}\n\n` +
                     `🚗 *Veículo:* ${carNames[activeCarType]}\n` +
                     `🛠️ *Serviços Selecionados:*\n- ${selectedNames.join('\n- ')}\n\n` +
                     `💰 *Estimativa de Valores:*\n` +
                     `- À Vista (PIX 10% OFF): *${pixTotal}*\n` +
                     `- Parcelado no Cartão: *12x de ${cardInstallmentText}* (Total: ${rawTotal})`;

      const waUrl = `https://wa.me/5527998803770?text=${encodeURIComponent(waText)}`;

      // Simulate network wait briefly, then fire WhatsApp
      setTimeout(() => {
        submitBtn.textContent = 'Agendar Orçamento Sem Compromisso';
        submitBtn.disabled = false;
        window.open(waUrl, '_blank');
      }, 1000);
    });
  }

  function formatDate(dateStr) {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  }

  // Run calculation immediately to display default pricing values
  calculatePrices();
}

/* ==========================================================================
   8. FAQ ACCORDION — class-based grid-row animation
   ========================================================================== */
const accordionTriggers = document.querySelectorAll('.accordion-trigger');
accordionTriggers.forEach(trigger => {
  trigger.addEventListener('click', () => {
    const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

    // Collapse all panels
    document.querySelectorAll('.accordion-trigger').forEach(t => {
      t.setAttribute('aria-expanded', 'false');
      const c = t.parentElement.querySelector('.accordion-content');
      if (c) c.classList.remove('open');
    });

    // If it was closed, open it
    if (!isExpanded) {
      trigger.setAttribute('aria-expanded', 'true');
      const content = trigger.parentElement.querySelector('.accordion-content');
      if (content) content.classList.add('open');
    }
  });
});

