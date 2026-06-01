const express = require('express');
const app = express();

// IMPORTANTE: Usa process.env.PORT, si no existe usa 3000 por defecto
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => res.send('Servidor Webhook Activo'));

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

app.post('/webhook', (req, res) => {
    console.log('Evento recibido');
    res.status(200).send('EVENT_RECEIVED');
});

// ESCUCHA EN EL PUERTO QUE RENDER TE ASIGNE
app.listen(port, '0.0.0.0', () => {
    console.log('Servidor escuchando en el puerto ' + port);
});
