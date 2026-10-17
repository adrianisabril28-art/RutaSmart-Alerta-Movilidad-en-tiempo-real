
import express from "express";
import OpenAI from "openai";

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/ia/preguntar", async (req, res) => {
  try {
    const { pregunta } = req.body;

    if (!pregunta || typeof pregunta !== "string" || !pregunta.trim()) {
      res.status(400).json({
        error: "Escribe una pregunta para la inteligencia artificial.",
      });
      return;
    }

    const respuesta = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: pregunta.trim(),
    });

    res.json({
      respuesta: respuesta.output_text,
    });
  } catch (error) {
    console.error("Error al consultar GPT:", error);
    res.status(500).json({
      error: "No fue posible generar una respuesta. Inténtalo nuevamente.",
    });
  }
});

export default router;
