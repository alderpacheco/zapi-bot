const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const ZAPI_URL = 'https://api.z-api.io/instances/3E0D12E4E2EC7081131CAAEF140028B5/token/BF9FD36E43D60DB574E59E6F/send-text';

app.get('/', (req, res) => {
  res.send('API online!');
});

app.post('/webhook', async (req, res) => {
  const body = req.body;

  if (!body?.message?.chatId || !body.message.body) {
    return res.sendStatus(400);
  }

  const chatId = body.message.chatId;
  const text = body.message.body.trim().toLowerCase();

  const resposta = `Olá! Bem-vindo! Escolha uma opção:
1 - Consultas
2 - Exames
3 - Encaminhamentos
4 - Falar com atendente`;

  try {
    await axios.post(ZAPI_URL, {
      chatId: chatId,
      text: resposta,
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
