const jwt = require('jsonwebtoken');

const JWT_SECRET_PADRAO = 'clinica-local-secret';

module.exports = function (req, res, next) {
  // O Frontend vai enviar o token no "Header" da requisição
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ erro: "Acesso negado. Token não fornecido." });

  try {
    // Remove a palavra "Bearer " se ela vier junto e verifica a validade
    const segredoJwt = process.env.JWT_SECRET || JWT_SECRET_PADRAO;
    const verificado = jwt.verify(token.replace('Bearer ', ''), segredoJwt);
    req.usuario = verificado; // Guarda os dados do utilizador (id, cargo) na requisição
    next(); // Deixa o utilizador passar para a rota de agendamento!
  } catch (err) {
    res.status(400).json({ erro: "Token inválido ou expirado." });
  }
};