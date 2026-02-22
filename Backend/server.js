// backend/server.js (ou app.js)

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(cors());

// Conexão com o MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado ao MongoDB'))
  .catch((err) => console.error('Erro ao conectar com o MongoDB', err));

// Rota de teste
app.get('/', (req, res) => {
  res.send('Backend funcionando!');
});

// Importando as rotas de autenticação
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// Rodando o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});