const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  pacienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  data: { type: String, required: true },
  hora: { type: String, required: true },
  cep: { type: String, required: true },
  // Adicionámos estes dois campos para o MongoDB não os ignorar:
  enderecoFull: { type: String },
  clima: { type: String }
});

module.exports = mongoose.model('Appointment', AppointmentSchema);