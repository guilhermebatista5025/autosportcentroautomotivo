// =====================================
// IMPORTAÇÕES
// =====================================
const qrcode = require("qrcode-terminal");
const { Client, MessageMedia, LocalAuth } = require("whatsapp-web.js");

// =====================================
// CONFIGURAÇÃO DO CLIENTE
// =====================================
const client = new Client({
  authStrategy: new LocalAuth(),

  webVersionCache: {
    type: "remote",
    remotePath: "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/{version}.html",
  },

  qrMaxRetries: 5,

puppeteer: {
  headless: "new",

  executablePath:
    "C:/Program Files/Google/Chrome/Application/chrome.exe",

  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--disable-accelerated-2d-canvas",
    "--disable-gpu",
    "--window-size=1280,720",
  ],
},
});

// =====================================
// QR CODE
// =====================================
client.on("qr", (qr) => {
  console.log("📲 Escaneie o QR Code abaixo:");
  qrcode.generate(qr, { small: true });
});

// =====================================
// WHATSAPP CONECTADO
// =====================================
client.on("ready", () => {
  console.log("✅ Tudo certo! WhatsApp conectado.");
});

// =====================================
// DESCONEXÃO
// =====================================
client.on("disconnected", (reason) => {
  console.log("⚠️ Desconectado:", reason);
});

// =====================================
// INICIALIZA
// =====================================
client.initialize();

// =====================================
// FUNÇÃO DE DELAY
// =====================================
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// =====================================
// CONTROLE DE ETAPAS DOS USUÁRIOS
// =====================================
const userState = {};

// =====================================
// FUNIL DE MENSAGENS (SOMENTE PRIVADO)
// =====================================
client.on("message", async (msg) => {
  try {

    // ❌ IGNORA GRUPOS
    if (!msg.from || msg.from.endsWith("@g.us")) return;

    const chat = await msg.getChat();
    if (chat.isGroup) return;

    const texto = msg.body ? msg.body.trim().toLowerCase() : "";

    // =====================================
    // FUNÇÃO DE DIGITAÇÃO
    // =====================================
    const typing = async () => {
      await delay(2000);
      await chat.sendStateTyping();
      await delay(2000);
    };

    // =====================================
    // MENSAGEM INICIAL
    // =====================================
    if (/^(menu|oi|olá|ola|bom dia|boa tarde|boa noite)$/i.test(texto)) {

      await typing();

      const hora = new Date().getHours();
      let saudacao = "Olá";

      if (hora >= 5 && hora < 12) saudacao = "Bom dia";
      else if (hora >= 12 && hora < 18) saudacao = "Boa tarde";
      else saudacao = "Boa noite";

      userState[msg.from] = {
        etapa: "menu"
      };

      await client.sendMessage(
        msg.from,
        `${saudacao}! 👋\n\n` +
        `🚗 *AUTO SPORT ESTÉTICA AUTOMOTIVA*\n\n` +

        `Escolha uma opção abaixo:\n\n` +

        `1️⃣ Agendar Serviço\n` +
        `2️⃣ Ver Serviços\n` +
        `3️⃣ Formas de Pagamento\n` +
        `4️⃣ Localização`
      );

      return;
    }

    // =====================================
    // MENU PRINCIPAL
    // =====================================
    if (userState[msg.from]?.etapa === "menu") {

      // AGENDAMENTO
      if (texto === "1") {

        userState[msg.from].etapa = "servico";

        await typing();

        await client.sendMessage(
          msg.from,
          `🧼 *Escolha o serviço desejado:*\n\n` +

          `1️⃣ Lavagem Completa\n` +
          `2️⃣ Higienização Interna\n` +
          `3️⃣ Polimento Técnico\n` +
          `4️⃣ Vitrificação\n` +
          `5️⃣ Revitalização de Farol`
        );

        return;
      }

      // SERVIÇOS
      if (texto === "2") {

        await typing();

        await client.sendMessage(
          msg.from,
          `🚘 *Nossos Serviços:*\n\n` +

          `✔️ Lavagem Técnica\n` +
          `✔️ Higienização\n` +
          `✔️ Polimento\n` +
          `✔️ Cristalização\n` +
          `✔️ Vitrificação\n` +
          `✔️ Revitalização`
        );

        return;
      }

      // PAGAMENTO
      if (texto === "3") {

        await typing();

        await client.sendMessage(
          msg.from,
          `💳 *Formas de pagamento:*\n\n` +

          `✔️ PIX\n` +
          `✔️ Cartão\n` +
          `✔️ Dinheiro`
        );

        return;
      }

      // LOCALIZAÇÃO
      if (texto === "4") {

        await typing();

        await client.sendMessage(
          msg.from,
          `📍 Estamos localizados em:\n\n` +
          `Rua Exemplo, 123 - Centro\n\n` +
          `🗺️ https://maps.google.com`
        );

        return;
      }
    }

    // =====================================
    // ETAPA SERVIÇO
    // =====================================
    if (userState[msg.from]?.etapa === "servico") {

      const servicos = {
        "1": "Lavagem Completa",
        "2": "Higienização Interna",
        "3": "Polimento Técnico",
        "4": "Vitrificação",
        "5": "Revitalização de Farol"
      };

      const servico = servicos[texto];

      if (!servico) {

        await client.sendMessage(
          msg.from,
          "❌ Escolha uma opção válida."
        );

        return;
      }

      userState[msg.from].servico = servico;
      userState[msg.from].etapa = "veiculo";

      await typing();

      await client.sendMessage(
        msg.from,
        `🚘 *Qual o tipo do veículo?*\n\n` +

        `1️⃣ Hatch\n` +
        `2️⃣ Sedan\n` +
        `3️⃣ SUV\n` +
        `4️⃣ Caminhonete`
      );

      return;
    }

    // =====================================
    // ETAPA VEÍCULO
    // =====================================
    if (userState[msg.from]?.etapa === "veiculo") {

      const veiculos = {
        "1": "Hatch",
        "2": "Sedan",
        "3": "SUV",
        "4": "Caminhonete"
      };

      const veiculo = veiculos[texto];

      if (!veiculo) {

        await client.sendMessage(
          msg.from,
          "❌ Escolha uma opção válida."
        );

        return;
      }

      userState[msg.from].veiculo = veiculo;
      userState[msg.from].etapa = "pagamento";

      await typing();

      await client.sendMessage(
        msg.from,
        `💳 *Forma de pagamento:*\n\n` +

        `1️⃣ PIX\n` +
        `2️⃣ Cartão\n` +
        `3️⃣ Dinheiro`
      );

      return;
    }

    // =====================================
    // ETAPA PAGAMENTO
    // =====================================
    if (userState[msg.from]?.etapa === "pagamento") {

      const pagamentos = {
        "1": "PIX",
        "2": "Cartão",
        "3": "Dinheiro"
      };

      const pagamento = pagamentos[texto];

      if (!pagamento) {

        await client.sendMessage(
          msg.from,
          "❌ Escolha uma opção válida."
        );

        return;
      }

      userState[msg.from].pagamento = pagamento;

      const dados = userState[msg.from];

      await typing();

      await client.sendMessage(
        msg.from,
        `✅ *AGENDAMENTO REALIZADO*\n\n` +

        `🚗 Serviço: ${dados.servico}\n` +
        `🚘 Veículo: ${dados.veiculo}\n` +
        `💳 Pagamento: ${dados.pagamento}\n\n` +

        `📲 Nossa equipe entrará em contato para confirmar o horário.`
      );

      delete userState[msg.from];

      return;
    }

  } catch (error) {
    console.error("❌ Erro no processamento da mensagem:", error);
  }
});

// =====================================
// ENCERRAMENTO DO BOT
// =====================================
process.on("SIGINT", async () => {
  console.log("🛑 Encerrando bot...");
  await client.destroy();
  process.exit();
});