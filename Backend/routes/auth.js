const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

// Rota de LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    // 1. Verificar se o utilizador existe
    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ erro: "Utilizador não encontrado." });
    }

    // 2. Verificar se a palavra-passe está correta
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(400).json({ erro: "Palavra-passe incorreta." });
    }

    // 3. Gerar o Token JWT (o "crachá")
    const token = jwt.sign(
      { id: usuario._id, cargo: usuario.cargo },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // O crachá expira em 1 hora
    );

    res.status(200).json({ 
      mensagem: "Login efetuado com sucesso!", 
      token,
      usuario: { id: usuario._id, nome: usuario.nome, cargo: usuario.cargo }
    });

  } catch (err) {
    res.status(500).json({ erro: "Erro ao fazer login: " + err.message });
  }
});

module.exports = router;