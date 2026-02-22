const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Rota para registrar novo usuário
router.post('/register', async (req, res) => {
  try {
    const { nome, email, senha, cargo } = req.body;

    // Criptografando a senha antes de salvar
    const salt = await bcrypt.genSalt(10);
    const senhaCripto = await bcrypt.hash(senha, salt);

    const novoUsuario = new User({
      nome,
      email,
      senha: senhaCripto,
      cargo
    });

    await novoUsuario.save();
    res.status(201).json({ mensagem: "Usuário criado com sucesso!" });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao cadastrar: " + err.message });
  }
});

module.exports = router;