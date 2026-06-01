const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => res.send('Servidor Webhook Activo'));

// 1. Validación del Webhook para Meta (GET)
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token === process.env.VERIFY_TOKEN) {
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }
});

// 2. Recepción de Eventos de Meta (POST)
// NOTA: Esta parte va FUERA de la llave '}' del GET anterior
app.post('/webhook', (req, res) => {
    console.log('Evento recibido:', JSON.stringify(req.body, null, 2));
    // Meta exige responder 200 OK inmediatamente
    res.status(200).send('EVENT_RECEIVED');
});

app.listen(port, () => console.log('Servidor en puerto ' + port));
