const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const ZAPI_URL = 'https://api.z-api.io/instances/3E0D12E4E2EC7081131CAAEF140028B5/token/BF9FD36E43D60DB574E59E6F/send-message';

app.post('/webhook', async (req, res) => {
  const body = req.body;

  // Verificação de segurança
  if (!body || !body.message || !body.message.chatId || !body.message.body) {
    return res.sendStatus(400); // Bad Request
  }

  const chatId = body.message.chatId;
  const text = body.message.body.trim().toLowerCase();

  let response = '';

  switch (text) {
    case 'oi':
    case 'olá':
      response = 'Olá! Escolha uma opção:\n1 - Consultas\n2 - Exames\n3 - Encaminhamentos\n4 - Falar com atendente';
      break;
    case '1':
      response = 'Para consultas, envie:\n- Nome completo\n- Cartão do SUS\n- Especialidade desejada';
      break;
    case '2':
      response = 'Para exames, envie:\n- Nome completo\n- Documento\n- Tipo de exame';
      break;
    case '3':
      response = 'Encaminhamentos devem ser solicitados via UBS de origem.';
      break;
    case '4':
      response = 'Aguarde um momento. Um atendente falará com você em breve.';
      break;
    default:
      response = 'Desculpe, não entendi. Por favor, digite "oi" para ver o menu novamente.';
  }

  try {
    await axios.post(ZAPI_URL, {
      chatId: chatId,
      message: response,
    });
    console.log(`Mensagem enviada para ${chatId}: "${response}"`);
    res.sendStatus(200);
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error.response?.data || error.message);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
