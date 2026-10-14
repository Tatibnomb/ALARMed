
const { Type } = require("@google/genai");
const ai = require("../config/gemini");

// Esquema que define la estructura de las advertencias que debe devolver Gemini.
const warningAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    medications_analyzed: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Lista de IDs de los medicamentos analizados.",
    },
    warnings: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: {
            type: Type.STRING,
            enum: [
              "interaction",
              "administration",
              "contraindication",
              "duplicate",
              "precaution",
            ],
          },
          severity: {
            type: Type.STRING,
            enum: ["info", "precaucion", "importante", "urgente"],
          },
          title: { type: Type.STRING },
          medication_ids: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "IDs exactos de los medicamentos involucrados.",
          },
          message: { type: Type.STRING },
          recommendation: { type: Type.STRING },
          evidence_level: {
            type: Type.STRING,
            enum: ["alto", "moderado", "limitado"],
          },
          source: { type: Type.STRING },
        },
        required: [
          "type",
          "severity",
          "title",
          "medication_ids",
          "message",
          "recommendation",
          "evidence_level",
          "source",
        ],
      },
    },
  },
  required: ["medications_analyzed", "warnings"],
};

// Instrucciones que orientan el análisis de Gemini.
const SYSTEM_INSTRUCTION = `
Eres un asistente computacional especializado en farmacovigilancia
para la aplicación ALARMed.

Analiza la lista de medicamentos en formato JSON y genera advertencias
sobre posibles interacciones, duplicidades y precauciones de administración.

REGLAS:
1. Analiza las posibles interacciones entre los medicamentos.
2. Asigna la severidad según la evidencia y el riesgo.
3. No inventes interacciones ni afirmes riesgos sin evidencia suficiente.
4. Usa únicamente los UUIDs exactos recibidos en la propiedad "id".
5. Si no identificas advertencias justificadas, devuelve una lista vacía.
6. No inventes fuentes ni referencias.
7. Distingue las precauciones generales de las interacciones confirmadas.
8. No sustituyas la evaluación de un profesional de salud.
`;

// Determina si el error parece temporal y vale la pena reintentar.
function isTemporaryGeminiError(error) {
  const status = Number(error?.status || error?.code);

  return (
    [429, 500, 502, 503, 504].includes(status) ||
    ["UNAVAILABLE", "RESOURCE_EXHAUSTED", "INTERNAL"].includes(
      String(error?.status || error?.code || "").toUpperCase()
    )
  );
}

// Espera una cantidad determinada de milisegundos.
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function analyzeMedicationsWithGemini(medications) {
  if (!medications || medications.length === 0) {
    return {
      medications_analyzed: [],
      warnings: [],
    };
  }

  // Preparamos los datos necesarios para el análisis.
  const payloadToAnalyze = medications.map((m) => ({
    id: m.id,
    nombre: m.name,
    dosis: m.dosage,
    frecuencia: m.frequency,
    horarios: (m.schedules || [])
      .map((s) => s.hour)
      .filter(Boolean)
      .map((hour) => hour.slice(0, 5)),
    descripcion: m.description,
  }));

  const maxAttempts = 3;
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                text:
                  "Analiza los medicamentos activos y genera las advertencias correspondientes. " +
                  "Usa los IDs exactos recibidos.\n\n" +
                  JSON.stringify(payloadToAnalyze, null, 2),
              },
            ],
          },
        ],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0,
          responseMimeType: "application/json",
          responseSchema: warningAnalysisSchema,
        },
      });

      // Si Gemini responde, convertimos su JSON en un objeto JavaScript.
      const analysis = JSON.parse(response.text);

      // Verificamos que la respuesta tenga la estructura esperada.
      if (
        !analysis ||
        !Array.isArray(analysis.medications_analyzed) ||
        !Array.isArray(analysis.warnings)
      ) {
        throw new Error("Gemini devolvió una estructura de respuesta inválida.");
      }

      return analysis;
    } catch (error) {
      lastError = error;

      // Los errores permanentes no se solucionan repitiendo la petición.
      if (!isTemporaryGeminiError(error) || attempt === maxAttempts) {
        break;
      }

      // Esperamos 1 segundo y después 2 segundos antes de reintentar.
      const delayMs = 1000 * 2 ** (attempt - 1);

      console.warn(
        `Gemini no está disponible. Reintento ${attempt + 1}/${maxAttempts} ` +
          `en ${delayMs / 1000} segundos.`
      );

      await wait(delayMs);
    }
  }

  // Si todos los intentos fallan, conservamos el error original.
  console.error("No se pudo completar el análisis con Gemini:", lastError);
  throw lastError;
}

module.exports = { analyzeMedicationsWithGemini };