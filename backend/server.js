const WebSocket = require('ws');
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authroutes');
const cors = require('cors');
const isConnected = require('./middlewares/auth');

// Charger les variables d'environnement
dotenv.config();

const app = express();
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Un utilisateur est connecté.');

  // Envoyer des messages en continu toutes les 5 secondes
  const sendMessage = () => {
    const message = JSON.stringify({ type: 'message', data: 'Message en temps réel' });
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    }
  };
  const interval = setInterval(sendMessage, 5000);

  // Réception de messages
  ws.on('message', (message) => {
    console.log(`Message reçu du client : ${message}`);
  });

  // Gestion des erreurs
  ws.on('error', (error) => {
    console.log(`Erreur WebSocket : ${error.message}`);
  });

  ws.on('close', () => {
    console.log('Utilisateur déconnecté.');
    clearInterval(interval);
  });
});

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/' + process.env.DB)
  .then(() => {
    console.log('Connexion à MongoDB réussie');
  })
  .catch((error) => {
    console.log('Erreur de connexion à MongoDB :', error.message);
  });

// Configurer CORS pour des origines spécifiques
const allowedOrigins = ['http://localhost:3000'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(express.json());

app.use('/auth', authRoutes);

// Gestion globale des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Une erreur est survenue !' });
});

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
