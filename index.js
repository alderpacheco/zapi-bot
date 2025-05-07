const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

// Sua URL Z-API para envio de mensagens
const ZAPI_URL = 'https://api.z-api.io/instances/3E0D12E4E2EC7081131CAAEF140028B5/token/BF9FD36E43D60DB574E59E6F/send-text';

app.get('/', (req, res) => {
  res.send('Bot rodando!');
});

app.post('/webhook', async (req, res) => {
  const body = req.body;

  // Verificação mínima para evitar erros
  if (!body?.message?.chatId || !body.message.body) {
    return res.sendStatus(400);
  }

  const chatId = body.message.chatId;
  const text = body.message.body.trim().toLowerCase();

  // Resposta padrão, independente da mensagem
  const resposta = `Olá! Bem-vindo! Escolha uma opção:
1 - Consultas
2 - Exames
3 - Encaminhamentos
4 - Falar com atendente`;

  try {
    await axios.post(ZAPI_URL, {
      chatId: chatId,
      text: resposta, // Atenção: o campo correto na ZAPI é 'text', não 'message'
    });

    console.log(`Mensagem enviada para ${chatId}`);
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
