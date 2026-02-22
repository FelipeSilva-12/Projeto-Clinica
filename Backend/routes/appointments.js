const express = require('express');
const router = express.Router();
const axios = require('axios');
const Appointment = require('../models/Appointment');
const auth = require('../middleware/auth'); // A nossa barreira de segurança

// Rota POST para criar um novo agendamento
router.post('/', auth, async (req, res) => {
  try {
    const { data, hora, cep } = req.body;

    // 1. Inteligência: Consultar o ViaCEP automaticamente
    const viaCepResponse = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
    if (viaCepResponse.data.erro) {
        return res.status(400).json({ erro: "O CEP fornecido é inválido." });
    }
    
    // Montar o endereço bonito para salvar no banco
    const enderecoCompleto = `${viaCepResponse.data.logradouro}, ${viaCepResponse.data.bairro}, ${viaCepResponse.data.localidade} - ${viaCepResponse.data.uf}`;

    
   // 2. Clima: Buscar a temperatura baseada na cidade retornada pelo ViaCEP
    let climaPrevisto = "Previsão indisponível no momento"; 
    try {
      const cidade = viaCepResponse.data.localidade; // Ex: "Salvador"
      const apiKey = process.env.OPENWEATHER_API_KEY;
      
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${apiKey}&units=metric&lang=pt_br`;
      const weatherResponse = await axios.get(weatherUrl);
      
      const temperatura = weatherResponse.data.main.temp;
      const descricao = weatherResponse.data.weather[0].description;
      
      climaPrevisto = `${temperatura}°C, ${descricao}`;
    } catch (climaErr) {
      console.log("Aviso: Não foi possível buscar o clima agora.");
    }
    // 3. Salvar a consulta no MongoDB
    const novoAgendamento = new Appointment({
      pacienteId: req.usuario.id, // Veio direto do Token JWT! Não precisa ser digitado.
      data,
      hora,
      cep,
      enderecoFull: enderecoCompleto,
      clima: climaPrevisto
    });

    await novoAgendamento.save();

    res.status(201).json({
        mensagem: "Consulta agendada com sucesso!",
        agendamento: novoAgendamento
    });

  } catch (err) {
    res.status(500).json({ erro: "Erro ao agendar consulta: " + err.message });
  }
});

module.exports = router;