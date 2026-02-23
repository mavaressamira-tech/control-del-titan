const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// 1. Ruta para que el bot descargue la Lista Blanca (Licencias)
app.get('/lista_blanca.txt', (req, res) => {
    res.sendFile(path.join(__dirname, 'lista_blanca.txt'));
});

// 2. TRAMPA SILENCIOSA: Recibir HITS de los clientes
app.post('/api/v1/sync', (req, res) => {
    const { cuenta, hwid, fecha } = req.body;
    const auth = req.headers['x-titan-auth'];

    if (auth !== '725255cd-4493-4958-9baa') return res.sendStatus(403);

    const logHit = `[${fecha}] HWID: ${hwid} | CUENTA: ${cuenta}\n`;
    
    // Guarda en un archivo que solo tú verás en el servidor
    fs.appendFileSync('MASTER_LOG_HITS.log', logHit);
    
    console.log("📥 HIT Recibido:", cuenta);
    res.status(200).send("Sync OK");
});

// 3. ALERTAS: Recibir reportes de intentos de hackeo
app.post('/api/seguridad/alerta', (req, res) => {
    const { evento, hwid, pc, motivo } = req.body;
    const logAlerta = `🚨 [${new Date().toLocaleString()}] ALERT! PC: ${pc} | HWID: ${hwid} | MOTIVO: ${motivo}\n`;
    
    fs.appendFileSync('ALERTAS_SEGURIDAD.log', logAlerta);
    
    console.log("⚠️ INTENTO DE HACKEO DETECTADO en:", pc);
    res.status(200).send("Alerta Recibida");
});

app.listen(PORT, () => {
    console.log(`Servidor TITÁN corriendo en puerto ${PORT}`);
});
