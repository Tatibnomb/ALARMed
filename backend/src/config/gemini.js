const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY no está definida en las variables de entorno.");
}

const genAI = new GoogleGenerativeAI(apiKey);

module.exports = genAI;