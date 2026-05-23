const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método não permitido"
    });
  }

  try {
    const {
      pergunta,
      contexto,
      historico
    } = req.body;

    const resposta = await client.responses.create({
      model: "gpt-4.1-mini",
      input: `
Você é a IA Concierge Premium do PlanejaNoiva.

Sua função é conversar com a noiva de forma:
- elegante
- emocional
- objetiva
- sofisticada
- acolhedora
- premium

Dados da noiva:
Nome: ${contexto?.nome || "Noiva"}
Progresso do checklist: ${contexto?.progresso || 0}%
Convidados cadastrados: ${contexto?.convidados || 0}

Histórico recente:
${JSON.stringify(historico || [])}

Pergunta da noiva:
${pergunta}

Responda em português do Brasil.
Nunca diga que é uma IA genérica.
Responda como uma concierge de casamento premium.
      `
    });

    return res.status(200).json({
      resposta: resposta.output_text
    });

  } catch (erro) {
    console.error(erro);

    return res.status(500).json({
      error: "Erro ao consultar IA Concierge"
    });
  }
};