const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();

router.post('/cadastro', async (req, res) => {
  const nome = (req.body.nome || '').trim();
  const email = (req.body.email || '').trim().toLowerCase();
  const senha = req.body.senha || '';
  const tipo = req.body.tipo;

  if (!nome || !email || !senha || !tipo) {
    return res.status(400).json({ message: 'Preencha todos os campos.' });
  }

  if (!['paciente', 'secretario'].includes(tipo)) {
    return res.status(400).json({ message: 'Tipo de usuário inválido.' });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: 'E-mail já cadastrado.' });
    }

    const user = new User({ nome, email, senha, tipo });
    await user.save();

    return res.status(201).json({ message: 'Usuário criado com sucesso.' });
  } catch (error) {
    if (error && error.code === 11000) {
      return res.status(409).json({ message: 'E-mail já cadastrado.' });
    }

    if (error && error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Dados inválidos para cadastro.' });
    }

    console.error('Erro detalhado no cadastro:', error);
    return res.status(500).json({ message: 'Erro ao cadastrar usuário.' });
  }
});

router.post('/login', async (req, res) => {
  const email = (req.body.email || '').trim().toLowerCase();
  const senha = req.body.senha || '';

  if (!email || !senha) {
    return res.status(400).json({ message: 'Informe e-mail e senha.' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Usuário não encontrado.' });
    }

    const senhaValida = await user.compararSenha(senha);
    if (!senhaValida) {
      return res.status(400).json({ message: 'Senha inválida.' });
    }

    const token = jwt.sign(
      { userId: user._id, tipo: user.tipo, nome: user.nome },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    return res.json({ token, usuario: { nome: user.nome, email: user.email, tipo: user.tipo } });
  } catch (error) {
    console.error('Erro detalhado no login:', error);
    return res.status(500).json({ message: 'Erro no login.' });
  }
});

module.exports = router;
