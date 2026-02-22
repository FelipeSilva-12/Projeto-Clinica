const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Logo abaixo dos seus outros "app.use"
app.use('/api/auth', require('./routes/auth'));
app.use('/api/appointments', require('./routes/appointments'));

// A MÁGICA ACONTECE AQUI
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000 // Se não conectar em 5s, ele avisa na hora
})
.then(() => console.log("✅ AGORA SIM! Conectado ao MongoDB Atlas!"))
.catch(err => {
  console.error("❌ ERRO REAL DE CONEXÃO:");
  console.error(err.message);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor na porta ${PORT}`));