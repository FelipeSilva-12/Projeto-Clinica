const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  cargo: { type: String, enum: ['paciente', 'secretario'], default: 'paciente' }
});

module.exports = mongoose.model('User', UserSchema);