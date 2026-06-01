const express = require('express');
const crypto = require('crypto');
const app = express();

// Meta envía el cuerpo como un buffer crudo para validar la firma
app.use(express.json({
    verify: (req, res, buf) => {
        req.rawBody = buf;
    }
}));

// 1. GET (Verificación) - Ya lo tienes bien
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }
});

// 2. POST (Recepción con validación de firma)
app.post('/webhook', (req, res) => {
    const signature = req.headers['x-hub-signature-256'];
    const hmac = crypto.createHmac('sha256', process.env.APP_SECRET);
    const digest = 'sha256=' + hmac.update(req.rawBody).digest('hex');

    if (signature !== digest) {
        return res.sendStatus(403); // Firma inválida
    }

    console.log('Evento validado:', JSON.stringify(req.body, null, 2));
    res.status(200).send('EVENT_RECEIVED');
});
