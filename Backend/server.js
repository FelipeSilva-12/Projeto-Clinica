const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const authRoutes = require('./routes/auth');
const appointmentRoutes = require('./routes/appointments');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'API da clínica funcionando' });
});

app.use('/auth', authRoutes);
app.use('/agendamentos', appointmentRoutes);

function iniciarServidor() {
  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });
}

mongoose.connect(mongoUri)
  .then(() => {
    process.env.AUTH_FALLBACK = 'false';
    console.log('Conectado ao MongoDB');
    iniciarServidor();
  })
  .catch((err) => {
    process.env.AUTH_FALLBACK = 'true';
    console.error('Aviso: não foi possível conectar ao MongoDB. Cadastro/Login funcionarão em modo local.', err.message);
    iniciarServidor();
  });
