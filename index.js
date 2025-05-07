const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

// Substitua com seus dados reais da Z-API
const ZAPI_URL = 'https://api.z-api.io/instances/SEU_ID/token/SEU_TOKEN/send-message';

app.post('/webhook', async (req, res) => {
  const message = req.body.message;
  const chatId = message.chatId;
  const text = message.body.trim().toLowerCase();

  let response = '';

  if (text === 'oi' || text === 'olá') {
    response = 'Olá! Escolha uma opção:\n1 - Consultas\n2 - Exames\n3 - Encaminhamentos\n4 - Falar com atendente';
  } else if (text === '1') {
    response = 'Para consultas, envie:\n- Nome completo\n- Cartão do SUS\n- Especialidade desejada';
  } else if (text === '2') {
    response = 'Para exames, envie:\n- Nome completo\n- Documento\n- Tipo de exame';
  } else if (text === '3') {
    response = 'Encaminhamentos devem ser solicitados via UBS de origem.';
  } else if (text === '4') {
    response = 'Aguarde um momento. Um atendente falará com você em breve.';
  } else {
    response = 'Desculpe, não entendi. Por favor, digite "oi" para ver o menu novamente.';
  }

  try {
    await axios.post(ZAPI_URL, {
      chatId: chatId,
      message: response,
    });
    res.sendStatus(200);
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
