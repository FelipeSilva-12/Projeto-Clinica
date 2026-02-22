const express = require('express');
const axios = require('axios');
const Appointment = require('../models/Appointment');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { data, hora, cep } = req.body;

    if (!data || !hora || !cep) {
      return res.status(400).json({ erro: 'Data, hora e CEP são obrigatórios.' });
    }

    const jaExiste = await Appointment.findOne({ data, hora });
    if (jaExiste) {
      return res.status(409).json({ erro: 'Horário já ocupado. Escolha outro horário.' });
    }

    const viaCepResponse = await axios.get(`https://viacep.com.br/ws/${cep.replace(/\D/g, '')}/json/`);
    if (viaCepResponse.data.erro) {
      return res.status(400).json({ erro: 'O CEP fornecido é inválido.' });
    }

    const enderecoCompleto = `${viaCepResponse.data.logradouro || 'Sem logradouro'}, ${viaCepResponse.data.bairro || ''}, ${viaCepResponse.data.localidade} - ${viaCepResponse.data.uf}`;

    let climaPrevisto = 'Previsão indisponível no momento';

    try {
      const cidade = viaCepResponse.data.localidade;
      const apiKey = process.env.OPENWEATHER_API_KEY;

      if (apiKey) {
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${apiKey}&units=metric&lang=pt_br`;
        const weatherResponse = await axios.get(weatherUrl);

        const temperatura = weatherResponse.data.main.temp;
        const descricao = weatherResponse.data.weather[0].description;

        climaPrevisto = `${temperatura}°C, ${descricao}`;
      }
    } catch (climaErr) {
      console.log('Aviso: Não foi possível buscar o clima agora.');
    }

    const novoAgendamento = new Appointment({
      pacienteId: req.usuario.userId,
      data,
      hora,
      cep,
      enderecoFull: enderecoCompleto,
      clima: climaPrevisto
    });

    await novoAgendamento.save();

    return res.status(201).json({
      mensagem: 'Consulta agendada com sucesso!',
      agendamento: novoAgendamento
    });
  } catch (err) {
    return res.status(500).json({ erro: `Erro ao agendar consulta: ${err.message}` });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const filtro = req.usuario.tipo === 'secretario' ? {} : { pacienteId: req.usuario.userId };

    const agendamentos = await Appointment.find(filtro).sort({ data: 1, hora: 1 });

    return res.json(agendamentos);
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao listar agendamentos.' });
  }
});

module.exports = router;
