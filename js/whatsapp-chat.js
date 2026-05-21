/**
 * WHATSAPP PREMIUM MINI CHAT COMPONENT
 * Vanilla JavaScript - High Conversions - Integrated Design System
 */

document.addEventListener('DOMContentLoaded', () => {
  initWhatsAppWidget();
});

function initWhatsAppWidget() {
  // Widget DOM Elements
  const floatBtn = document.getElementById('wa-float-btn');
  const chatWindow = document.getElementById('wa-chat-window');
  const closeBtn = document.getElementById('wa-chat-close');
  const notifyDot = document.getElementById('wa-notify-dot');
  const typingMsg = document.getElementById('wa-msg-typing');
  const welcomeMsg = document.getElementById('wa-msg-welcome');
  const replyGroup = document.getElementById('wa-replies-group');
  const chatInput = document.getElementById('wa-chat-input');
  const sendBtn = document.getElementById('wa-send-btn');
  
  if (!floatBtn || !chatWindow) return;

  let isChatOpenedBefore = false;

  // 1. Open Chat Trigger
  floatBtn.addEventListener('click', () => {
    const isOpened = chatWindow.classList.contains('open');
    if (!isOpened) {
      openChat();
    } else {
      closeChat();
    }
  });

  // 2. Close Chat Trigger
  if (closeBtn) {
    closeBtn.addEventListener('click', closeChat);
  }

  function openChat() {
    chatWindow.classList.add('open');
    chatWindow.setAttribute('aria-hidden', 'false');
    floatBtn.setAttribute('aria-expanded', 'true');
    
    // Hide notification badge when opened
    if (notifyDot) {
      notifyDot.style.opacity = '0';
      notifyDot.style.pointerEvents = 'none';
    }

    // Trigger typing simulation only on the first open
    if (!isChatOpenedBefore) {
      isChatOpenedBefore = true;
      simulateAgentTyping();
    }
    
    // Focus input field for accessibility
    setTimeout(() => {
      if (chatInput) chatInput.focus();
    }, 300);
  }

  function closeChat() {
    chatWindow.classList.remove('open');
    chatWindow.setAttribute('aria-hidden', 'true');
    floatBtn.setAttribute('aria-expanded', 'false');
  }

  // 3. Typing Simulator Animation
  function simulateAgentTyping() {
    if (!typingMsg || !welcomeMsg) return;

    // Show dots
    typingMsg.style.display = 'block';
    welcomeMsg.style.display = 'none';
    if (replyGroup) replyGroup.style.display = 'none';

    // 1.2s delay to feel completely authentic
    setTimeout(() => {
      typingMsg.style.display = 'none';
      welcomeMsg.style.display = 'block';
      if (replyGroup) {
        replyGroup.style.display = 'flex';
        // Smoothly fade-in buttons
        replyGroup.style.opacity = '0';
        replyGroup.style.transition = 'opacity 0.3s ease';
        setTimeout(() => replyGroup.style.opacity = '1', 50);
      }
    }, 1200);
  }

  // 4. Quick Replies A/B Conversions Engine
  const repliesButtons = document.querySelectorAll('.wa-reply-btn');
  
  // A/B test variations rotated dynamically or mapped to triggers
  const templates = {
    budget: [
      "Olá Auto Sport! Usei o simulador no site e gostaria de solicitar um orçamento personalizado para proteger meu veículo com PPF e Vitrificação.",
      "Olá! Gostaria de saber as datas disponíveis esta semana para aplicar proteção de pintura na Auto Sport e seguir viagem com tranquilidade.",
      "Olá! Quero proteger meu carro com a equipe da Auto Sport. Podem me passar detalhes sobre as opções de agendamento e garantias?"
    ],
    general: "Olá Auto Sport! Acessei o site de vocês e gostaria de tirar algumas dúvidas sobre a proteção e estética para o meu veículo.",
    location: "Olá Auto Sport! Gostaria de fazer uma visita à oficina de vocês em Linhares para avaliar meu carro. Podem me enviar o endereço e a rota?"
  };

  repliesButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-reply-type');
      let textMessage = "";

      if (type === 'budget') {
        // Randomize between A/B templates for budget
        const index = Math.floor(Math.random() * templates.budget.length);
        textMessage = templates.budget[index];
      } else if (type === 'location') {
        textMessage = templates.location;
      } else {
        textMessage = templates.general;
      }

      openWhatsAppLink(textMessage);
    });
  });

  // 5. Input Field Custom Message Submission
  if (sendBtn && chatInput) {
    function submitCustomMsg() {
      const text = chatInput.value.trim();
      if (!text) return;

      openWhatsAppLink(text);
      chatInput.value = '';
    }

    sendBtn.addEventListener('click', submitCustomMsg);

    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        submitCustomMsg();
      }
    });
  }

  // 6. Direct Link Encoding Formatter
  function openWhatsAppLink(message) {
    const waUrl = `https://wa.me/5527998803770?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  }
}
