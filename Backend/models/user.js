// backend/models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  tipo: { type: String, enum: ['paciente', 'secretario'], required: true }
});

// Hash a senha antes de salvar
userSchema.pre('save', async function(next) {
  if (this.isModified('senha')) {
    this.senha = await bcrypt.hash(this.senha, 10);
  }
  next();
});

// Método para comparar senhas
userSchema.methods.compararSenha = function(senha) {
  return bcrypt.compare(senha, this.senha);
};

const User = mongoose.model('User', userSchema);
module.exports = User;