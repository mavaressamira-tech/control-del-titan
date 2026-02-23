const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());

// RUTA 1: Para validar licencias (el bot lee esto)
app.get('/lista_blanca.txt', (req, res) => {
    const ruta = path.join(__dirname, 'lista_blanca.txt');
    if (fs.existsSync(ruta)) {
        res.sendFile(ruta);
    } else {
        res.send("LISTA_VACIA");
    }
});

// RUTA 2: Recibir HITS de forma silenciosa
app.post('/api/v1/sync', (req, res) => {
    const { cuenta, hwid } = req.body;
    // Solo acepta si trae tu clave secreta
    if (req.headers['x-titan-auth'] !== '725255cd-4493-4958-9baa') return res.sendStatus(403);

    console.log(`🚀 HIT: ${cuenta} | Desde: ${hwid}`);
    res.sendStatus(200);
});

// CONFIGURACIÓN DE PUERTO PARA RENDER (IMPORTANTE)
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Servidor TITÁN operando en puerto ${PORT}`);
});
