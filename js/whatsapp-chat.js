/**
 * WHATSAPP PREMIUM MINI CHAT COMPONENT
 * Vanilla JavaScript - Alta Performance - Conversão Otimizada
 * Padrão UI/UX Pro Max (Sem Emojis em Elementos Estruturais, Transições Suaves)
 */

document.addEventListener("DOMContentLoaded", () => {
  initWhatsAppWidget();
});

function initWhatsAppWidget() {
  const floatBtn = document.getElementById("wa-float-btn");
  const chatWindow = document.getElementById("wa-chat-window");
  const closeBtn = document.getElementById("wa-chat-close");
  const notifyDot = document.getElementById("wa-notify-dot");
  const typingMsg = document.getElementById("wa-msg-typing");
  const welcomeMsg = document.getElementById("wa-msg-welcome");
  const replyGroup = document.getElementById("wa-replies-group");
  const chatInput = document.getElementById("wa-chat-input");
  const sendBtn = document.getElementById("wa-send-btn");

  if (!floatBtn || !chatWindow) return;

  let isChatOpenedBefore = false;

  // 1. Alternar Abertura / Fechamento do Chat
  floatBtn.addEventListener("click", () => {
    const isOpened = chatWindow.classList.contains("open");
    if (!isOpened) {
      openChat();
    } else {
      closeChat();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", closeChat);
  }

  function openChat() {
    chatWindow.classList.add("open");
    chatWindow.setAttribute("aria-hidden", "false");
    floatBtn.setAttribute("aria-expanded", "true");

    // Esconde o pontinho vermelho de notificação quando abre
    if (notifyDot) {
      notifyDot.style.opacity = "0";
      notifyDot.style.pointerEvents = "none";
    }

    // Simula a digitação na primeira vez que abre o chat
    if (!isChatOpenedBefore) {
      isChatOpenedBefore = true;
      simulateAgentTyping();
    }

    // Acessibilidade: Dar foco no campo de texto após transição suave
    setTimeout(() => {
      if (chatInput) chatInput.focus();
    }, 350);
  }

  function closeChat() {
    chatWindow.classList.remove("open");
    chatWindow.setAttribute("aria-hidden", "true");
    floatBtn.setAttribute("aria-expanded", "false");
  }

  // 2. Simulador de Digitação Humana (Autenticidade de 1.2s delay)
  function simulateAgentTyping() {
    if (!typingMsg || !welcomeMsg) return;

    typingMsg.style.display = "block";
    welcomeMsg.style.display = "none";
    if (replyGroup) replyGroup.style.display = "none";

    setTimeout(() => {
      typingMsg.style.display = "none";
      welcomeMsg.style.display = "block";
      if (replyGroup) {
        replyGroup.style.display = "flex";
        
        // Efeito suave de entrada (fade-in) nos botões
        replyGroup.style.opacity = "0";
        replyGroup.style.transition = "opacity 200ms ease-out";
        setTimeout(() => {
          replyGroup.style.opacity = "1";
        }, 50);
      }
    }, 1200);
  }

  // 3. Clique nas Respostas Rápidas (Encaminhamento Direto)
  const repliesButtons = document.querySelectorAll(".wa-reply-btn");
  
  const templates = {
    budget: [
      "Olá Auto Sport! Gostaria de agendar uma avaliação premium para proteger meu veículo com PPF e Vitrificação Nano-Cerâmica.",
      "Olá! Gostaria de consultar datas disponíveis esta semana para aplicar proteção de pintura na Auto Sport.",
      "Olá! Gostaria de orçar uma higienização e detalhamento de interior premium com a equipe da Auto Sport."
    ],
    general: "Olá Auto Sport! Acessei o site de vocês e gostaria de tirar algumas dúvidas sobre estética automotiva e polimento técnico.",
    location: "Olá Auto Sport! Gostaria de fazer uma visita ao centro de vocês em Linhares para avaliar meu veículo. Podem me passar o endereço?"
  };

  repliesButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const type = btn.getAttribute("data-reply-type");
      let message = "";

      if (type === "budget") {
        // Selecionar aleatoriamente entre variações de conversão
        const idx = Math.floor(Math.random() * templates.budget.length);
        message = templates.budget[idx];
      } else if (type === "location") {
        message = templates.location;
      } else {
        message = templates.general;
      }

      openWhatsAppLink(message);
    });
  });

  // 4. Envio de Texto Customizado pela Caixa de Entrada
  if (sendBtn && chatInput) {
    function submitMsg() {
      const text = chatInput.value.trim();
      if (!text) return;

      openWhatsAppLink(text);
      chatInput.value = "";
    }

    sendBtn.addEventListener("click", submitMsg);

    chatInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        submitMsg();
      }
    });
  }

  // 5. Redirecionamento Final e Codificação URL
  function openWhatsAppLink(message) {
    const waUrl = `https://wa.me/5527998803770?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
  }
}
