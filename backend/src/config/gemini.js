const dotenv = require("dotenv");
dotenv.config(); // Carga las variables desde el archivo .env
const { GoogleGenAI } = require("@google/genai");

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) throw new Error("GEMINI_API_KEY no está definida en el .env");

module.exports = new GoogleGenAI({ apiKey });