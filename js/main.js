/**
 * AUTO SPORT CENTRO AUTOMOTIVO - ENGINE DE INTERAÇÕES E AGENDAMENTO
 * Vanilla JS de Alta Performance - Sem Dependências Externas
 * Padrão UI/UX Pro Max (Sem Emojis, Ícones SVGs, Calendário Interativo)
 */

document.addEventListener("DOMContentLoaded", () => {
  initLoader();
  initNavbarScroll();
  initMobileMenu();
  initScrollReveal();
  initBeforeAfterSlider();
  initStatsCounters();
  initHeroCarousel();
  initWebScheduler();
  initHomeQuickBooking();
  initTestimonialSlider();
  initFAQAccordion();
});

/* ==========================================================================
   1. LOADER DE PÁGINA COM FADEOUT SUAVE
   ========================================================================== */
function initLoader() {
  const loader = document.getElementById("loader");
  if (!loader) return;

  window.addEventListener("load", () => {
    setTimeout(() => {
      loader.classList.add("fade-out");
      // Mover o foco para o conteúdo principal para acessibilidade
      const mainContent = document.getElementById("main-content");
      if (mainContent) mainContent.focus();
    }, 1000);
  });
}

/* ==========================================================================
   2. NAVBAR GLASSMORPHIC STICKY SCROLL
   ========================================================================== */
function initNavbarScroll() {
  const nav = document.getElementById("navbar");
  const themeToggle = document.getElementById("theme-toggle");
  const lightIcon = document.getElementById("theme-light-icon");
  const darkIcon = document.getElementById("theme-dark-icon");

  if (!nav) return;

  // Efeito de rolagem na Navbar (apenas se houver a seção Hero, caso contrário é sólida)
  const hasHero = document.querySelector(".hero-section");
  const mainHeader = document.querySelector(".main-header-fixed");
  if (!hasHero) {
    nav.classList.add("navbar-scrolled");
    if (mainHeader) mainHeader.classList.add("scrolled");
  } else {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 40) {
        nav.classList.add("navbar-scrolled");
        if (mainHeader) mainHeader.classList.add("scrolled");
      } else {
        nav.classList.remove("navbar-scrolled");
        if (mainHeader) mainHeader.classList.remove("scrolled");
      }
    });
  }

  // Gerenciador de Temas (Tema Claro Forçado)
  document.body.classList.remove("dark-theme");
  localStorage.setItem("theme", "light");
}

/* ==========================================================================
   3. MENU MOBILE HAMBÚRGUER COM ARIA E ACESSIBILIDADE
   ========================================================================== */
function initMobileMenu() {
  const burger = document.getElementById("burger-btn");
  const menu = document.getElementById("nav-menu");
  const links = document.querySelectorAll(".nav-link");

  if (!burger || !menu) return;

  function toggleMenu() {
    const isExpanded = burger.getAttribute("aria-expanded") === "true";
    burger.setAttribute("aria-expanded", !isExpanded);
    menu.classList.toggle("active");
    
    const lines = burger.querySelectorAll(".burger-line");
    if (!isExpanded) {
      lines[0].style.transform = "translateY(8px) rotate(45deg)";
      lines[1].style.opacity = "0";
      lines[2].style.transform = "translateY(-8px) rotate(-45deg)";
    } else {
      lines[0].style.transform = "none";
      lines[1].style.opacity = "1";
      lines[2].style.transform = "none";
    }
  }

  burger.addEventListener("click", toggleMenu);

  links.forEach(link => {
    link.addEventListener("click", () => {
      if (menu.classList.contains("active")) {
        toggleMenu();
      }
    });
  });
}

/* ==========================================================================
   4. SCROLL REVEAL VIA INTERSECTION OBSERVER
   ========================================================================== */
function initScrollReveal() {
  const elements = document.querySelectorAll(".reveal-on-scroll");
  if (!elements.length) return;

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: "0px 0px -40px 0px"
    });

    elements.forEach(el => observer.observe(el));
  } else {
    elements.forEach(el => el.classList.add("revealed"));
  }
}

/* ==========================================================================
   5. COMPARADOR ANTES / DEPOIS SLIDER PREMIUM
   ========================================================================== */
function initBeforeAfterSlider() {
  const container = document.getElementById("wow-slider");
  const afterImage = document.getElementById("slider-after");
  const handle = document.getElementById("slider-handle");
  const rangeInput = document.getElementById("slider-range");

  if (!container || !afterImage || !handle || !rangeInput) return;

  function updateSlider(value) {
    const clampedVal = Math.max(0, Math.min(100, value));
    // Corta a imagem da direita (Depois) de forma linear
    afterImage.style.clipPath = `polygon(0 0, ${clampedVal}% 0, ${clampedVal}% 100%, 0 100%)`;
    // Move o puxador visual
    handle.style.left = `${clampedVal}%`;
  }

  rangeInput.addEventListener("input", (e) => {
    updateSlider(e.target.value);
  });

  // Suporte para teclas de seta do teclado quando em foco (Acessibilidade)
  rangeInput.addEventListener("keydown", (e) => {
    let val = parseInt(rangeInput.value);
    if (e.key === "ArrowRight") {
      val = Math.min(100, val + 5);
      rangeInput.value = val;
      updateSlider(val);
    } else if (e.key === "ArrowLeft") {
      val = Math.max(0, val - 5);
      rangeInput.value = val;
      updateSlider(val);
    }
  });
}

/* ==========================================================================
   6. CONTADORES NUMÉRICOS ANIMADOS
   ========================================================================== */
function initStatsCounters() {
  const counters = document.querySelectorAll(".stat-number");
  if (!counters.length) return;

  function animate(el) {
    const target = parseFloat(el.getAttribute("data-target"));
    const suffix = el.getAttribute("data-suffix") || "";
    const duration = 2000; // 2 segundos
    let startTime = null;

    function run(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const pct = Math.min(progress / duration, 1);
      
      // Easing quadratico
      const easeVal = pct * (2 - pct);
      const current = Math.floor(easeVal * target);
      
      el.textContent = current.toLocaleString("pt-BR") + suffix;

      if (progress < duration) {
        requestAnimationFrame(run);
      } else {
        el.textContent = target.toLocaleString("pt-BR") + suffix;
      }
    }
    requestAnimationFrame(run);
  }

  if ("IntersectionObserver" in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animate(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => obs.observe(c));
  } else {
    counters.forEach(c => {
      c.textContent = c.getAttribute("data-target") + (c.getAttribute("data-suffix") || "");
    });
  }
}

/* ==========================================================================
   7. SISTEMA DE AGENDAMENTO INTELEGENTE INTEGRADO COM BACKEND E CRM
   ========================================================================== */
function initWebScheduler() {
  const container = document.getElementById("scheduling-container");
  if (!container) return;

  // DOM Elements
  const carButtons = document.querySelectorAll(".car-btn");
  const optionsContainer = document.getElementById("service-options-container");
  const totalPriceDisplay = document.getElementById("sim-total-price");
  const pixPriceDisplay = document.getElementById("pix-price");
  const cardPriceDisplay = document.getElementById("card-price");
  const bookingForm = document.getElementById("sim-booking-form");
  const submitBtn = document.getElementById("sim-submit-btn");

  // Calendário DOM Elements
  const calendarTitle = document.getElementById("web-calendar-month-year");
  const calendarDaysContainer = document.getElementById("web-calendar-days-container");
  const btnPrevMonth = document.getElementById("web-btn-prev-month");
  const btnNextMonth = document.getElementById("web-btn-next-month");
  const turnButtons = document.querySelectorAll(".turn-btn");

  // Variáveis de Estado do Agendamento
  let activeCarType = "Pequeno"; // Hatch / Sedan
  let selectedServices = new Set();
  let servicesDatabase = {}; // Carregados dinamicamente
  let activeTurn = "Manhã (08h - 12h)";

  // Variáveis de Estado do Calendário
  let currentDate = new Date();
  let selectedDateObj = null;

  // Fallback de Serviços Estáticos em caso de erro da API (Consistente com config.json)
  const staticFallbackServices = {
    "1": {
      "nome": "Lavagem Técnica Detalhada",
      "precos": { "Pequeno": 80, "SUV": 130, "Caminhonete": 150 }
    },
    "2": {
      "nome": "Higienização e Detalhamento Interno",
      "precos": { "Pequeno": 200, "SUV": 300, "Caminhonete": 350 }
    },
    "3": {
      "nome": "Polimento Técnico & Lustro",
      "precos": { "Pequeno": 400, "SUV": 600, "Caminhonete": 700 }
    },
    "4": {
      "nome": "Vitrificação de Pintura 9H",
      "precos": { "Pequeno": 700, "SUV": 1000, "Caminhonete": 1200 }
    },
    "5": {
      "nome": "Verniz e Detalhamento de Motor",
      "precos": { "Pequeno": 100, "SUV": 140, "Caminhonete": 160 }
    },
    "6": {
      "nome": "Revitalização de Faróis",
      "precos": { "Pequeno": 120, "SUV": 120, "Caminhonete": 120 }
    }
  };

  // 7a. Carregar Configurações Dinâmicas do Servidor
  async function fetchConfig() {
    try {
      const res = await fetch("/api/config");
      if (!res.ok) throw new Error("Erro na API");
      const config = await res.json();
      
      if (config.servicos && Object.keys(config.servicos).length > 0) {
        servicesDatabase = config.servicos;
        console.log("⚙️ Serviços carregados dinamicamente do Painel Administrativo.");
      } else {
        throw new Error("Serviços vazios");
      }
    } catch (err) {
      console.warn("⚠️ API de Configuração offline, aplicando Fallback Estático.");
      servicesDatabase = staticFallbackServices;
    }
    
    // Renderizar os serviços dinamicamente livres de emojis
    renderServicesList();
  }

  // 7b. Renderizar Checklist de Serviços (Princípio Acessibilidade)
  function renderServicesList() {
    if (!optionsContainer) return;
    optionsContainer.innerHTML = "";

    Object.keys(servicesDatabase).forEach((key, index) => {
      const item = servicesDatabase[key];
      const card = document.createElement("button");
      card.type = "button";
      card.className = "option-card";
      card.setAttribute("data-service", key);
      card.setAttribute("role", "checkbox");
      card.setAttribute("aria-checked", "false");

      // Auto-selecionar o primeiro serviço para orientar o cliente
      if (index === 0) {
        selectedServices.add(key);
        card.classList.add("selected");
        card.setAttribute("aria-checked", "true");
      }

      card.innerHTML = `
        <span class="option-info">
          <span class="option-checkbox" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </span>
          <span class="option-title">${item.nome}</span>
        </span>
        <span class="option-price" id="web-price-${key}">R$ 0,00</span>
      `;

      card.addEventListener("click", () => {
        if (selectedServices.has(key)) {
          // Manter pelo menos 1 selecionado
          if (selectedServices.size > 1) {
            selectedServices.delete(key);
            card.classList.remove("selected");
            card.setAttribute("aria-checked", "false");
          } else {
            showToast("Selecione pelo menos um serviço!");
          }
        } else {
          selectedServices.add(key);
          card.classList.add("selected");
          card.setAttribute("aria-checked", "true");
        }
        calculatePricing();
      });

      optionsContainer.appendChild(card);
    });

    // Calcula preços imediatos após renderizar
    calculatePricing();
  }

  // 7c. Atualização de Porte do Carro (Step 1)
  carButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      carButtons.forEach(b => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
        b.setAttribute("aria-checked", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      btn.setAttribute("aria-checked", "true");
      
      const type = btn.getAttribute("data-type");
      activeCarType = type; // "Pequeno", "SUV" ou "Caminhonete" (conforme config.json)
      calculatePricing();
    });
  });

  // 7d. Motor de Cálculo e Formatação de Preços
  function calculatePricing() {
    let subtotal = 0;

    selectedServices.forEach(key => {
      const service = servicesDatabase[key];
      if (!service) return;

      // Pegar preço conforme o porte do carro (Fallback se o preço de porte específico não existir)
      let price = service.precos[activeCarType] || service.precos["Médio"] || 100;
      
      // Atualizar o preço individual na label do serviço
      const labelPrice = document.getElementById(`web-price-${key}`);
      if (labelPrice) {
        labelPrice.textContent = formatBRL(price);
      }

      subtotal += price;
    });

    // Parcelamentos e Descontos
    const pixTotal = Math.round(subtotal * 0.95); // 5% de Desconto automático
    const cardInstallment = Math.round(subtotal / 12);

    // Renderizar
    totalPriceDisplay.textContent = formatBRL(subtotal);
    pixPriceDisplay.textContent = formatBRL(pixTotal);
    cardPriceDisplay.textContent = formatBRL(cardInstallment);

    // Atualizar sub-opções do pagamento antecipado
    const subPix = document.getElementById("sub-pix-value");
    const subCard = document.getElementById("sub-card-value");
    const subCash = document.getElementById("sub-cash-value");
    if (subPix) subPix.textContent = formatBRL(pixTotal);
    if (subCard) subCard.textContent = `12x de ${formatBRL(cardInstallment)}`;
    if (subCash) subCash.textContent = formatBRL(subtotal);
  }

  function formatBRL(val) {
    return val.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }

  // 7e. LÓGICA DO NOVO CALENDÁRIO WEB INTERATIVO
  const ptMonths = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  function renderWebCalendar() {
    if (!calendarDaysContainer) return;
    calendarDaysContainer.innerHTML = "";

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Título Mês / Ano
    calendarTitle.textContent = `${ptMonths[month]} de ${year}`;

    // Primeiro dia do mês e total de dias
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    // Dias do mês anterior para preenchimento de grid
    const prevMonthTotalDays = new Date(year, month, 0).getDate();

    // 1. Renderizar preenchimento vazio do mês anterior
    for (let i = firstDayIndex; i > 0; i--) {
      const dayDiv = document.createElement("div");
      dayDiv.className = "calendar-day-circle disabled";
      dayDiv.textContent = prevMonthTotalDays - i + 1;
      calendarDaysContainer.appendChild(dayDiv);
    }

    // Data de hoje para travar datas passadas
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 2. Renderizar os dias reais do mês
    for (let day = 1; day <= totalDays; day++) {
      const dayDiv = document.createElement("button");
      dayDiv.type = "button";
      dayDiv.className = "calendar-day-circle";
      dayDiv.textContent = day;

      const dateOfCell = new Date(year, month, day);
      dateOfCell.setHours(0, 0, 0, 0);

      // Regra 1: Desabilitar Domingos (Dia de descanso da oficina)
      const dayOfWeek = dateOfCell.getDay();
      const isSunday = dayOfWeek === 0;

      // Regra 2: Desabilitar datas passadas
      const isPast = dateOfCell < today;

      if (isSunday || isPast) {
        dayDiv.classList.add("disabled");
        dayDiv.setAttribute("aria-disabled", "true");
        dayDiv.setAttribute("tabindex", "-1");
      } else {
        // Permitir clique e navegação de teclado confortável (Touch targets >= 44px)
        dayDiv.setAttribute("aria-label", `${day} de ${ptMonths[month]}`);
        
        // Verificar se é o dia atualmente selecionado
        if (selectedDateObj && 
            selectedDateObj.getDate() === day && 
            selectedDateObj.getMonth() === month && 
            selectedDateObj.getFullYear() === year) {
          dayDiv.classList.add("selected");
          dayDiv.setAttribute("aria-selected", "true");
        }

        dayDiv.addEventListener("click", () => {
          // Remover seleção antiga do DOM
          const oldSelected = calendarDaysContainer.querySelector(".calendar-day-circle.selected");
          if (oldSelected) {
            oldSelected.classList.remove("selected");
            oldSelected.removeAttribute("aria-selected");
          }

          // Ativar nova seleção
          dayDiv.classList.add("selected");
          dayDiv.setAttribute("aria-selected", "true");
          selectedDateObj = new Date(year, month, day);
          
          showToast(`Data Selecionada: ${day}/${month + 1}/${year}`);
        });
      }

      calendarDaysContainer.appendChild(dayDiv);
    }
  }

  // Eventos de clique nas setas do calendário (Limitado a 3 meses para evitar abusos)
  if (btnPrevMonth && btnNextMonth) {
    const minMonthDate = new Date();
    minMonthDate.setDate(1);
    
    const maxMonthDate = new Date();
    maxMonthDate.setMonth(maxMonthDate.getMonth() + 2); // Bloquear agendamento após 3 meses

    btnPrevMonth.addEventListener("click", () => {
      const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
      if (prevMonth >= minMonthDate) {
        currentDate = prevMonth;
        renderWebCalendar();
      } else {
        showToast("Não é possível agendar em meses passados.");
      }
    });

    btnNextMonth.addEventListener("click", () => {
      const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
      if (nextMonth <= maxMonthDate) {
        currentDate = nextMonth;
        renderWebCalendar();
      } else {
        showToast("Agendamentos limitados a até 2 meses futuros.");
      }
    });
  }

  // Gerenciar Seleção do Turno (Manhã / Tarde)
  turnButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      turnButtons.forEach(b => {
        b.classList.remove("active");
        b.setAttribute("aria-checked", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-checked", "true");
      activeTurn = btn.getAttribute("data-turn");
    });
  });

  // --- MULTI-STEP WIZARD ENGINE CONTROLS ---
  const steps = document.querySelectorAll(".wizard-step");
  const nextButtons = document.querySelectorAll(".next-step-btn");
  const prevButtons = document.querySelectorAll(".prev-step-btn");
  let activeStep = 1;

  function showStep(stepNum) {
    steps.forEach((step, idx) => {
      if (idx + 1 === stepNum) {
        step.classList.add("active");
      } else {
        step.classList.remove("active");
      }
    });

    // Atualizar os indicadores visuais do stepper de 4 etapas
    for (let i = 1; i <= 4; i++) {
      const indicator = document.getElementById(`step-indicator-${i}`);
      if (indicator) {
        if (i < stepNum) {
          indicator.classList.remove("active");
          indicator.classList.add("completed");
        } else if (i === stepNum) {
          indicator.classList.remove("completed");
          indicator.classList.add("active");
        } else {
          indicator.classList.remove("active", "completed");
        }
      }
      
      const stepLine = document.querySelectorAll(".checkout-stepper .step-line")[i - 1];
      if (stepLine) {
        if (i < stepNum) {
          stepLine.classList.add("completed");
        } else {
          stepLine.classList.remove("completed");
        }
      }
    }
    
    activeStep = stepNum;
    
    // Rolar suavemente para o início do agendador
    if (container) {
      container.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  // --- VALIDAÇÕES DE ETAPA ---
  function validateStep1() {
    if (selectedServices.size === 0) {
      showToast("Por favor, selecione pelo menos um serviço!");
      return false;
    }
    return true;
  }

  function validateStep2() {
    const clientName = document.getElementById("client-name");
    const clientPhone = document.getElementById("client-phone");
    const clientVehicle = document.getElementById("client-vehicle");
    
    let isValid = true;
    let firstError = null;

    if (!clientName.value.trim() || clientName.value.trim().split(" ").length < 2) {
      showError(clientName, "Por favor, digite seu nome e sobrenome.");
      isValid = false;
      if (!firstError) firstError = clientName;
    } else {
      hideError(clientName);
    }

    const cleanPhone = clientPhone.value.replace(/\D/g, "");
    if (cleanPhone.length < 10 || cleanPhone.length > 11) {
      showError(clientPhone, "Informe um WhatsApp válido com DDD.");
      isValid = false;
      if (!firstError) firstError = clientPhone;
    } else {
      hideError(clientPhone);
    }

    if (!clientVehicle.value.trim()) {
      showError(clientVehicle, "Informe a marca e modelo do seu carro.");
      isValid = false;
      if (!firstError) firstError = clientVehicle;
    } else {
      hideError(clientVehicle);
    }

    if (!isValid && firstError) {
      firstError.focus();
    }

    return isValid;
  }

  function validateStep3() {
    if (!selectedDateObj) {
      showToast("Por favor, selecione uma data no calendário!");
      return false;
    }
    return true;
  }

  // Adicionar listeners nos botões de navegação Next / Prev
  nextButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const nextStep = parseInt(btn.getAttribute("data-next"), 10);
      if (nextStep === 2) {
        if (validateStep1()) {
          showStep(2);
        }
      } else if (nextStep === 3) {
        if (validateStep2()) {
          showStep(3);
        }
      } else if (nextStep === 4) {
        if (validateStep3()) {
          showStep(4);
        }
      }
    });
  });

  prevButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const prevStep = parseInt(btn.getAttribute("data-prev"), 10);
      showStep(prevStep);
    });
  });

  // --- LÓGICA DE SELEÇÃO DE FORMA DE PAGAMENTO ---
  const paymentChoiceInput = document.getElementById("payment-choice");
  const paymentSubchoiceInput = document.getElementById("payment-subchoice");
  const methodCards = document.querySelectorAll(".payment-method-card");
  const submethodCards = document.querySelectorAll(".payment-submethod-card");

  methodCards.forEach(card => {
    card.addEventListener("click", (e) => {
      const isSubCard = e.target.closest(".payment-submethod-card");
      if (isSubCard) return; // Evita selecionar a forma principal se clicou numa sub-opção

      methodCards.forEach(c => c.classList.remove("active"));
      card.classList.add("active");
      
      const method = card.getAttribute("data-method");
      paymentChoiceInput.value = method;

      if (method === "antecipado") {
        const activeSub = card.querySelector(".payment-submethod-card.active");
        if (activeSub) {
          paymentSubchoiceInput.value = activeSub.getAttribute("data-submethod");
        } else {
          // Ativa o Pix como padrão se nada estiver ativo
          const pixSub = card.querySelector('[data-submethod="pix"]');
          if (pixSub) {
            pixSub.classList.add("active");
          }
          paymentSubchoiceInput.value = "pix";
        }
      } else {
        paymentSubchoiceInput.value = "";
      }
    });
  });

  submethodCards.forEach(subcard => {
    subcard.addEventListener("click", (e) => {
      e.stopPropagation(); // Evita borbulhar para o card principal
      
      submethodCards.forEach(s => s.classList.remove("active"));
      subcard.classList.add("active");
      
      const submethod = subcard.getAttribute("data-submethod");
      paymentSubchoiceInput.value = submethod;
    });
  });

  // --- REAL-TIME MERCOSUL LICENSE PLATE DYNAMIC VISUALIZER ---
  const clientPlateInput = document.getElementById("client-plate");
  const mercosulPlateText = document.getElementById("mercosul-plate-text");
  if (clientPlateInput && mercosulPlateText) {
    clientPlateInput.addEventListener("input", () => {
      let rawVal = clientPlateInput.value.toUpperCase();
      // Remover caracteres especiais exceto hífen para manter consistência
      let cleanVal = rawVal.replace(/[^A-Z0-9-]/g, "");
      
      // Aplicar valor limpo de volta ao input para guiar o usuário
      clientPlateInput.value = cleanVal;
      
      if (!cleanVal.trim()) {
        mercosulPlateText.textContent = "SUA PLACA";
      } else {
        mercosulPlateText.textContent = cleanVal;
      }
    });
  }

  // --- SUBMISSÃO E INTEGRAÇÃO ---
  if (bookingForm) {
    bookingForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Dupla checagem de validações por segurança
      if (!validateStep1()) {
        showStep(1);
        return;
      }
      if (!validateStep2()) {
        showStep(2);
        return;
      }
      if (!validateStep3()) {
        showStep(3);
        return;
      }

      const clientName = document.getElementById("client-name");
      const clientPhone = document.getElementById("client-phone");
      const clientCpf = document.getElementById("client-cpf");
      const clientPlate = document.getElementById("client-plate");
      const clientVehicle = document.getElementById("client-vehicle");
      const clientObs = document.getElementById("client-obs");

      // Iniciar fluxo de envio e loader
      submitBtn.textContent = "Gravando Agendamento...";
      submitBtn.disabled = true;

      // Formatar valores para envio e integração no CRM
      const selectedServiceNames = [];
      selectedServices.forEach(key => {
        if (servicesDatabase[key]) {
          selectedServiceNames.push(servicesDatabase[key].nome);
        }
      });

      const rawSubtotal = parseInt(totalPriceDisplay.textContent.replace(/\D/g, "")) / 100;
      const rawPix = parseInt(pixPriceDisplay.textContent.replace(/\D/g, "")) / 100;

      const formattedDiaSemana = selectedDateObj.toLocaleDateString("pt-BR", { weekday: 'long' });
      const ptDaysMap = {
        "segunda-feira": "Segunda-feira",
        "terça-feira": "Terça-feira",
        "quarta-feira": "Quarta-feira",
        "quinta-feira": "Quinta-feira",
        "sexta-feira": "Sexta-feira",
        "sábado": "Sábado"
      };
      
      const diaNomeFormatado = ptDaysMap[formattedDiaSemana.toLowerCase()] || formattedDiaSemana;
      const dataFormatada = selectedDateObj.toLocaleDateString("pt-BR", { day: '2-digit', month: '2-digit' });
      const diaTextoWeb = `${diaNomeFormatado} (${dataFormatada})`; // ex: "Segunda-feira (25/05)"
      const dataIsoFormat = selectedDateObj.toISOString().split("T")[0]; // "YYYY-MM-DD"

      // Determinar a forma de pagamento selecionada e o valor final correspondente
      const choice = paymentChoiceInput.value;
      const subchoice = paymentSubchoiceInput.value;
      let finalPrice = rawSubtotal;
      let paymentText = "Na Entrega (Oficina)";

      if (choice === "entrega") {
        paymentText = "Na Entrega (Oficina)";
        finalPrice = rawSubtotal;
      } else if (choice === "retirada") {
        paymentText = "Na Retirada (Oficina)";
        finalPrice = rawSubtotal;
      } else if (choice === "antecipado") {
        if (subchoice === "pix") {
          paymentText = "Pagar Antecipado (PIX 5% OFF)";
          finalPrice = rawPix;
        } else if (subchoice === "cartao") {
          paymentText = "Pagar Antecipado (Cartão de Crédito)";
          finalPrice = rawSubtotal;
        } else if (subchoice === "dinheiro") {
          paymentText = "Pagar Antecipado (Dinheiro Físico)";
          finalPrice = rawSubtotal;
        }
      }

      const obsText = clientObs.value.trim() || "Nenhuma";

      const dataParaApi = {
        from: clientPhone.value.replace(/\D/g, ""),
        pushname: clientName.value.trim(),
        cpf: clientCpf.value.trim() || "N/A",
        servico: selectedServiceNames.join(", "),
        veiculo: clientVehicle.value.trim(),
        placa: clientPlate.value.trim() || "N/A",
        porte: activeCarType,
        sujeira: "Leve",
        agendamentoDia: diaTextoWeb,
        agendamentoDataValor: dataIsoFormat,
        agendamentoTurno: activeTurn,
        pagamento: paymentText,
        valorFinal: finalPrice,
        observacoes: obsText
      };

      try {
        // Envio HTTP POST integrado para registrar no CRM/Painel em tempo real
        const postRes = await fetch("/api/appointments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataParaApi)
        });

        const postResult = await postRes.json();
        
        if (postResult.success) {
          // Renderizar Tela de Sucesso Real com confetes e detalhes!
          renderSuccessScreen(dataParaApi, finalPrice, paymentText, obsText);
        } else {
          throw new Error("Erro da API");
        }
      } catch (err) {
        console.error("Erro ao registrar agendamento via API:", err);
        showToast("Erro ao agendar no painel, enviando pelo WhatsApp direto.");
        
        // Se a API falhar, redirecionamos para o WhatsApp da mesma forma (resiliência total)
        openWhatsAppRedirect(dataParaApi, finalPrice, paymentText, obsText);
      }
    });
  }

  function showError(inputEl, msg) {
    inputEl.setAttribute("aria-invalid", "true");
    const errSpan = document.getElementById(`${inputEl.id}-error`);
    if (errSpan) {
      errSpan.textContent = msg;
      errSpan.style.display = "block";
    }
  }

  function hideError(inputEl) {
    inputEl.removeAttribute("aria-invalid");
    const errSpan = document.getElementById(`${inputEl.id}-error`);
    if (errSpan) {
      errSpan.style.display = "none";
    }
  }

  // --- TELA DE SUCESSO PREMIUM COM DETALHES ---
  function renderSuccessScreen(data, finalPrice, paymentText, obsText) {
    // Substituir a interface de agendamento por uma mensagem linda de sucesso
    container.innerHTML = `
      <div class="success-screen-container reveal-on-scroll revealed">
        <div class="success-icon-wrapper">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        </div>
        <h3>Agendamento Pré-Confirmado!</h3>
        <p>Olá, <strong>${data.pushname}</strong>! Ficha de cliente criada com sucesso em nosso CRM. Registramos o seu serviço e ele já está reservado em nosso sistema.</p>
        
        <div class="success-details-box">
          <div class="success-detail-row">
            <span class="success-detail-label">💎 Cliente:</span>
            <span class="success-detail-value">${data.pushname}</span>
          </div>
          <div class="success-detail-row">
            <span class="success-detail-label">🚗 Veículo:</span>
            <span class="success-detail-value">${data.veiculo} [${data.placa.toUpperCase()}] (${data.porte})</span>
          </div>
          <div class="success-detail-row">
            <span class="success-detail-label">🛠️ Serviços:</span>
            <span class="success-detail-value" style="color: var(--color-blue); text-align: right; max-width: 250px;">${data.servico}</span>
          </div>
          <div class="success-detail-row">
            <span class="success-detail-label">🗓️ Período:</span>
            <span class="success-detail-value" style="color: var(--color-red);">${data.agendamentoDia} (${data.agendamentoTurno.split(" ")[0]})</span>
          </div>
          <div class="success-detail-row">
            <span class="success-detail-label">📝 Obs:</span>
            <span class="success-detail-value" style="font-style: italic; max-width: 250px;">${obsText}</span>
          </div>
          <div class="success-detail-row" style="border-top: 1px solid var(--border-color); padding-top: 10px; margin-top: 5px;">
            <span class="success-detail-label">💳 Pagamento:</span>
            <span class="success-detail-value" style="color: var(--color-blue);">${paymentText}</span>
          </div>
          <div class="success-detail-row">
            <span class="success-detail-label">💰 Valor Estimado:</span>
            <span class="success-detail-value" style="font-size: 1.1rem; color: #10b981; font-weight: 800;">R$ ${finalPrice},00</span>
          </div>
        </div>

        <p style="font-size: 0.82rem; color: var(--text-muted);">Agora, clique no botão abaixo para abrir o WhatsApp do suporte da Auto Sport e enviar a mensagem de validação final!</p>
        
        <button type="button" id="btn-success-whatsapp" class="btn btn-primary" style="padding: 16px 36px; box-shadow: 0 4px 18px rgba(37, 211, 102, 0.4); background: #25d366; border: none;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
          Finalizar no WhatsApp
        </button>
      </div>
    `;

    // Clique do botão de sucesso para abrir o WhatsApp
    document.getElementById("btn-success-whatsapp").addEventListener("click", () => {
      openWhatsAppRedirect(data, finalPrice, paymentText, obsText);
    });

    // Redireciona automaticamente após 4 segundos para comodidade
    setTimeout(() => {
      openWhatsAppRedirect(data, finalPrice, paymentText, obsText);
    }, 4000);
  }

  function openWhatsAppRedirect(data, finalPrice, paymentText, obsText) {
    const waText = `Olá Auto Sport! Acabei de realizar meu agendamento no site:\n\n` +
                   `👤 *Nome:* ${data.pushname}\n` +
                   `📞 *Telefone:* ${data.from}\n` +
                   `💳 *CPF:* ${data.cpf}\n` +
                   `🚗 *Veículo:* ${data.veiculo} [${data.placa.toUpperCase()}] (${data.porte})\n` +
                   `🛠️ *Serviço(s):* ${data.servico}\n` +
                   `🗓️ *Data Escolhida:* ${data.agendamentoDia} na parte da *${data.agendamentoTurno}*\n` +
                   `📝 *Observações:* ${obsText}\n\n` +
                   `💳 *Forma de Pagamento:* ${paymentText}\n` +
                   `💰 *Valor Estimado:* *R$ ${finalPrice},00*`;

    const waUrl = `https://wa.me/5527998803770?text=${encodeURIComponent(waText)}`;
    window.open(waUrl, "_blank");
  }

  // Executar inicializações
  fetchConfig();
  renderWebCalendar();

  // Clique rápido dos botões do novo Catálogo de Serviços
  document.querySelectorAll(".btn-catalog-select").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const targetServiceId = btn.getAttribute("data-catalog-target");
      
      // Rolar suavemente até o agendador
      const schedulerTarget = document.getElementById("scheduling-container");
      if (schedulerTarget) {
        schedulerTarget.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      
      setTimeout(() => {
        const optionCard = optionsContainer.querySelector(`[data-service="${targetServiceId}"]`);
        if (optionCard) {
          if (!optionCard.classList.contains("selected")) {
            optionCard.click();
          }
          showToast(`Adicionado: ${servicesDatabase[targetServiceId]?.nome || "Serviço"}`);
          showStep(1); // Mostra a etapa de serviços
        }
      }, 500);
    });
  });

  // Linkar cliques rápidos de "Simular este serviço" vindos do Bento Grid
  document.querySelectorAll("[data-select-service]").forEach(link => {
    link.addEventListener("click", (e) => {
      const targetServiceId = link.getAttribute("data-select-service");
      
      // Rolar suavemente até o agendador
      const schedulerTarget = document.getElementById("scheduling-container");
      if (schedulerTarget) {
        schedulerTarget.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      setTimeout(() => {
        const optionCard = optionsContainer.querySelector(`[data-service="${targetServiceId}"]`);
        if (optionCard && !optionCard.classList.contains("selected")) {
          optionCard.click();
        }
        showStep(1); // Mostra a etapa de serviços
      }, 350);
    });
  });
}


/* ==========================================================================
   8. SUCESSO TOAST CONTROLLER (PADRÃO UI/UX PRO MAX)
   ========================================================================== */
function showToast(message) {
  const toast = document.getElementById("toast");
  const msgEl = document.getElementById("toast-message");
  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 4000);
}

/* ==========================================================================
   9. HERO CINEMATIC VIDEO BACKGROUND CAROUSEL (PADRÃO UI/UX PRO MAX)
   ========================================================================== */
function initHeroCarousel() {
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".hero-carousel-dots .dot");
  if (!slides.length) return;

  let currentIndex = 0;
  let intervalId = null;
  const slideDuration = 8000; // 8 segundos por slide

  // Garante que o vídeo está carregado antes de tentar reproduzir
  function loadAndPlayVideo(slide) {
    const video = slide.querySelector(".hero-bg-video");
    if (!video) return;

    video.muted = true;
    video.loop = true;
    video.setAttribute("playsinline", "");

    // Promover carregamento sob demanda se ainda não foi carregado
    if (video.preload === "metadata" || video.preload === "none") {
      video.preload = "auto";
      video.load();
    }

    const tryPlay = () => {
      video.play().catch(err => {
        // Silencioso — o poster já serve de fallback visual
        console.log("[AutoSport Hero] Vídeo aguardando carregamento:", err.message || err);
      });
    };

    if (video.readyState >= 3) {
      tryPlay();
    } else {
      video.addEventListener("canplay", tryPlay, { once: true });
    }

    // Fallback: se o vídeo falhar completamente (CORS, 404), mantém o poster
    video.addEventListener("error", () => {
      console.warn("[AutoSport Hero] Falha ao carregar vídeo. Poster aplicado como fallback.");
      video.style.display = "none";
    }, { once: true });
  }

  function pauseVideo(slide) {
    const video = slide.querySelector(".hero-bg-video");
    if (video && !video.paused) {
      video.pause();
    }
  }

  function showSlide(index) {
    if (index === currentIndex) return;

    // Resetar slide ativo atual
    const currentSlide = slides[currentIndex];
    const currentDot = dots[currentIndex];

    if (currentSlide) {
      currentSlide.classList.remove("active");
      pauseVideo(currentSlide);
    }
    if (currentDot) {
      currentDot.classList.remove("active");
    }

    // Definir novo slide ativo
    currentIndex = index;
    const nextSlide = slides[currentIndex];
    const nextDot = dots[currentIndex];

    if (nextSlide) {
      nextSlide.classList.add("active");
      loadAndPlayVideo(nextSlide);
    }
    if (nextDot) {
      nextDot.classList.add("active");
    }
  }

  function nextSlide() {
    let nextIndex = currentIndex + 1;
    if (nextIndex >= slides.length) nextIndex = 0;
    showSlide(nextIndex);
  }

  function startAutoplay() {
    stopAutoplay();
    intervalId = setInterval(nextSlide, slideDuration);
  }

  function stopAutoplay() {
    if (intervalId) clearInterval(intervalId);
  }

  // Event listener para paginação (dots)
  dots.forEach(dot => {
    dot.addEventListener("click", () => {
      const index = parseInt(dot.getAttribute("data-dot-index"), 10);
      showSlide(index);
      startAutoplay();
    });
  });

  // Suporte a swipe no mobile para o hero carousel
  let touchStartX = 0;
  const heroSection = document.querySelector(".hero-section");
  if (heroSection) {
    heroSection.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    heroSection.addEventListener("touchend", (e) => {
      const deltaX = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(deltaX) > 50) {
        if (deltaX < 0) nextSlide();
        else showSlide(currentIndex > 0 ? currentIndex - 1 : slides.length - 1);
        startAutoplay();
      }
    }, { passive: true });
  }

  // Inicializar: primeiro slide ativo, demais em standby
  slides.forEach((slide, idx) => {
    if (idx === 0) {
      slide.classList.add("active");
      loadAndPlayVideo(slide);
    } else {
      slide.classList.remove("active");
    }
  });

  startAutoplay();
}

/* ==========================================================================
   9.5. FORMULÁRIO DE PRÉ-AGENDAMENTO RÁPIDO DA HOMEPAGE
   ========================================================================== */
function initHomeQuickBooking() {
  const form = document.getElementById("home-quick-booking-form");
  if (!form) return;

  const nameInput = document.getElementById("form-field-nome");
  const phoneInput = document.getElementById("form-field-whatsapp");
  const serviceInput = document.getElementById("form-field-servico");
  const dateInput = document.getElementById("form-field-data");

  // Inicializar Flatpickr no campo de data (Traduzido em pt-BR)
  let fpInstance = null;
  if (dateInput) {
    fpInstance = flatpickr(dateInput, {
      dateFormat: "d/m/Y",
      minDate: "today",
      locale: "pt",
      disableMobile: "true" // Forçar uso do calendário visual flatpickr mesmo no mobile
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = nameInput ? nameInput.value.trim() : "";
    const rawPhone = phoneInput ? phoneInput.value.trim() : "";
    const phone = rawPhone.replace(/\D/g, "");
    const service = serviceInput ? serviceInput.value : "";
    const dateValue = dateInput ? dateInput.value : ""; // formato DD/MM/YYYY

    if (!name || name.split(" ").length < 2) {
      showToast("Por favor, digite seu nome e sobrenome.");
      if (nameInput) nameInput.focus();
      return;
    }

    if (phone.length < 10 || phone.length > 11) {
      showToast("Informe um WhatsApp válido com DDD.");
      if (phoneInput) phoneInput.focus();
      return;
    }

    if (!dateValue) {
      showToast("Por favor, selecione uma data preferencial.");
      if (dateInput) dateInput.focus();
      return;
    }

    const submitBtn = document.getElementById("home-submit-btn");
    const originalText = submitBtn ? submitBtn.innerHTML : "Enviar";
    if (submitBtn) {
      submitBtn.innerHTML = '<span class="elementor-button-content-wrapper"><span class="elementor-button-text">Enviando...</span></span>';
      submitBtn.disabled = true;
    }

    // Processar campos para sincronização idêntica com Express CRM
    let apiDateValue = "";
    let diaTextoWeb = "";
    try {
      const parts = dateValue.split("/");
      if (parts.length === 3) {
        const day = parts[0];
        const month = parts[1];
        const year = parts[2];
        apiDateValue = `${year}-${month}-${day}`; // Formato YYYY-MM-DD para API
        
        const selectedDate = new Date(year, month - 1, day);
        const dayOfWeek = selectedDate.toLocaleDateString("pt-BR", { weekday: 'long' });
        const ptDaysMap = {
          "segunda-feira": "Segunda-feira",
          "terça-feira": "Terça-feira",
          "quarta-feira": "Quarta-feira",
          "quinta-feira": "Quinta-feira",
          "sexta-feira": "Sexta-feira",
          "sábado": "Sábado",
          "domingo": "Domingo"
        };
        const dayName = ptDaysMap[dayOfWeek.toLowerCase()] || dayOfWeek;
        diaTextoWeb = `${dayName} (${day}/${month})`;
      }
    } catch (err) {
      console.error("Erro ao formatar data:", err);
      apiDateValue = dateValue;
      diaTextoWeb = dateValue;
    }

    const dataParaApi = {
      from: phone,
      pushname: name,
      cpf: "N/A",
      servico: service,
      veiculo: "Não especificado (Homepage)",
      placa: "N/A",
      porte: "Pequeno",
      sujeira: "Leve",
      agendamentoDia: diaTextoWeb || dateValue,
      agendamentoDataValor: apiDateValue,
      agendamentoTurno: "Manhã",
      pagamento: "A combinar no local",
      valorFinal: 0,
      observacoes: "Agendamento rápido realizado via formulário da Homepage."
    };

    // Redirecionamento 100% idêntico ao template de WhatsApp da Neo Studio Car
    function redirectToWhatsApp() {
      const destino = '5527998803770'; // WhatsApp Auto Sport Centro Automotivo
      const mensagem = `Olá, meu nome é ${name}.
Quero agendar o serviço de ${service} para ${dateValue}.
Meu WhatsApp é ${rawPhone}.`;
      
      const url = `https://wa.me/${destino}?text=${encodeURIComponent(mensagem)}`;
      window.location.href = url; // Redireciona na mesma aba como no site referência
    }

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataParaApi)
      });

      const result = await res.json();
      if (result.success) {
        showToast("Pré-agendamento registrado! Redirecionando...");
        setTimeout(() => {
          redirectToWhatsApp();
          if (submitBtn) {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
          }
          form.reset();
          if (fpInstance) fpInstance.clear();
        }, 1500);
      } else {
        throw new Error("Erro no retorno da API (success=false)");
      }
    } catch (err) {
      console.warn("API offline ou instável, redirecionando direto para o WhatsApp.");
      showToast("Redirecionando para o WhatsApp do suporte...");
      redirectToWhatsApp();
      if (submitBtn) {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
      form.reset();
      if (fpInstance) fpInstance.clear();
    }
  });
}

/* ==========================================================================
   10. INTERAÇÃO E NAVEGAÇÃO DO SLIDER DE DEPOIMENTOS
   ========================================================================== */
function initTestimonialSlider() {
  const slides = document.querySelectorAll(".dep-slide");
  if (!slides.length) return;

  let currentIdx = 0;

  function rotateSlide() {
    const currentSlide = slides[currentIdx];
    
    // 1. Adiciona a classe 'leaving' para ativar a animação de saída (fade out + descida)
    currentSlide.classList.add("leaving");

    // 2. Aguarda a duração exata da animação de saída (600ms) para trocar os slides
    setTimeout(() => {
      currentSlide.classList.remove("active", "leaving");
      
      // Passa para o próximo índice de slide
      currentIdx = (currentIdx + 1) % slides.length;
      
      // Adiciona 'active' no novo slide, iniciando a animação de entrada (slide up + fade in)
      slides[currentIdx].classList.add("active");
    }, 600);
  }

  // Agenda a rotação automática dos depoimentos a cada 6 segundos (6000ms)
  setInterval(rotateSlide, 6000);
}

/* ==========================================================================
   11. INTERAÇÃO DO ACORDEÃO DE PERGUNTAS (FAQ)
   ========================================================================== */
function initFAQAccordion() {
  const triggers = document.querySelectorAll(".accordion-trigger");
  if (!triggers.length) return;

  const bubbleText = document.querySelector(".mascote-chat-bubble-faq p");
  const defaultText = "Ficou com alguma dúvida sobre estética? Clique nas perguntas ao lado que eu te respondo!";

  // Respostas curtas, marcantes e dinâmicas para o mascote "falar" no balão!
  const mascotAnswers = {
    "faq-ans-1": "Com certeza! O PPF é um escudo real auto-regenerativo contra pedradas nas estradas e riscos físicos!",
    "faq-ans-2": "Dura até 3 anos! A vitrificação 9H cria uma barreira nano-cerâmica blindada que facilita muito a lavagem.",
    "faq-ans-3": "Super facilitado! Temos 5% de desconto no PIX ou parcelamos em até 12x sem juros no cartão de crédito!"
  };

  triggers.forEach(trigger => {
    trigger.addEventListener("click", () => {
      const isExpanded = trigger.getAttribute("aria-expanded") === "true";
      const targetId = trigger.getAttribute("aria-controls");
      const content = document.getElementById(targetId);
      const item = trigger.closest(".accordion-item");

      // Comportamento clássico: fecha outros itens antes de abrir o novo
      triggers.forEach(otherTrigger => {
        if (otherTrigger !== trigger) {
          otherTrigger.setAttribute("aria-expanded", "false");
          const otherTargetId = otherTrigger.getAttribute("aria-controls");
          const otherContent = document.getElementById(otherTargetId);
          if (otherContent) otherContent.classList.remove("open");
          const otherItem = otherTrigger.closest(".accordion-item");
          if (otherItem) otherItem.classList.remove("active");
        }
      });

      // Alterna o estado do item clicado
      if (isExpanded) {
        trigger.setAttribute("aria-expanded", "false");
        if (content) content.classList.remove("open");
        if (item) item.classList.remove("active");

        // Retorna ao texto padrão do mascote com uma transição suave de opacidade
        if (bubbleText) {
          bubbleText.style.opacity = "0";
          setTimeout(() => {
            bubbleText.textContent = defaultText;
            bubbleText.style.opacity = "1";
          }, 200);
        }
      } else {
        trigger.setAttribute("aria-expanded", "true");
        if (content) content.classList.add("open");
        if (item) item.classList.add("active");

        // Atualiza a fala do mascote com uma transição suave de opacidade
        if (bubbleText && mascotAnswers[targetId]) {
          bubbleText.style.opacity = "0";
          setTimeout(() => {
            bubbleText.textContent = mascotAnswers[targetId];
            bubbleText.style.opacity = "1";
          }, 200);
        }
      }
    });
  });
}
