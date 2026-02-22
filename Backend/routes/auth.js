// backend/routes/auth.js

const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Rota de cadastro
router.post('/cadastro', async (req, res) => {
  const { nome, email, senha, tipo } = req.body;

  try {
    const user = new User({ nome, email, senha, tipo });
    await user.save();
    res.status(201).json({ message: 'Usuário criado com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao cadastrar o usuário' });
  }
});

// Rota de login
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Usuário não encontrado' });
    }

    const senhaValida = await user.compararSenha(senha);
    if (!senhaValida) {
      return res.status(400).json({ message: 'Senha inválida' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Erro no login' });
  }
});

module.exports = router;