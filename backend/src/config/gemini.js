const dotenv = require("dotenv");
dotenv.config(); // Carga las variables desde el archivo .env
const { GoogleGenAI } = require("@google/genai");

// Configuración de la API de Gemini (clave de API desde Google AI Studio)
const apiKey = process.env.GEMINI_API_KEY;
// Verifica si la clave de API está definida en el archivo .env
if (!apiKey) throw new Error("GEMINI_API_KEY no está definida en el .env");
// Exportamos el cliente ya listo para usar en geminiAnalyzer.js
module.exports = new GoogleGenAI({ apiKey });