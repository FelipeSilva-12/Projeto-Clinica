const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  pacienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  data: { type: String, required: true }, // Ex: 2026-05-20
  hora: { type: String, required: true }, // Ex: 14:00
  cep: { type: String, required: true },
  endereco: { type: String },
  climaPrevisao: { type: String } // Aqui vamos salvar se vai chover
});

module.exports = mongoose.model('Appointment', AppointmentSchema);