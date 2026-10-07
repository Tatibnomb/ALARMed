const { Type } = require("@google/genai");
const ai = require("../config/gemini");

const warningAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    medications_analyzed: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Lista de IDs de los medicamentos analizados."
    },
    warnings: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: {
            type: Type.STRING,
            enum: ["interaction", "administration", "contraindication", "duplicate", "precaution"]
          },
          severity: {
            type: Type.STRING,
            enum: ["info", "precaucion", "importante", "urgente"]
          },
          title: { type: Type.STRING },
          medication_ids: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "IDs exactos de los medicamentos involucrados."
          },
          message: { type: Type.STRING },
          recommendation: { type: Type.STRING },
          evidence_level: {
            type: Type.STRING,
            enum: ["alto", "moderado", "limitado"]
          },
          source: { type: Type.STRING }
        },
        required: ["type", "severity", "title", "medication_ids", "message", "recommendation", "evidence_level", "source"]
      }
    }
  },
  required: ["medications_analyzed", "warnings"]
};

const SYSTEM_INSTRUCTION = `
Eres un asistente computacional especializado en farmacovigilancia para la aplicación ALARMed.
Analiza la lista de medicamentos en formato JSON y genera advertencias médicas sobre interacciones farmacológicas, duplicidades o precauciones de administración.

REGLAS:
1. Analiza interacciones cruzadas entre fármacos (ej. AINEs combinados como Ibuprofeno + Aspirina aumentan el riesgo gastrointestinal).
2. Asigna la severidad 'urgente' o 'importante' según el riesgo, y 'precaucion' para interacciones moderadas.
3. NO inventes interacciones ni asumas riesgos sin evidencia.
4. Retorna en 'medication_ids' los UUIDs exactos de los medicamentos involucrados que vienen en la propiedad 'id' de la entrada.
5. Si realmente no existe ninguna interacción o precaución, retorna 'warnings' como lista vacía.
`;

async function analyzeMedicationsWithGemini(medications) {
  if (!medications || medications.length === 0) {
    return { medications_analyzed: [], warnings: [] };
  }

const payloadToAnalyze = medications.map((m) => ({
  id: m.id,
  nombre: m.name,
  dosis: m.dosage,
  frecuencia: m.frequency,
  horarios: (m.schedules || []).map((s) => s.hour.slice(0, 5)),
  descripcion: m.description,
}));

  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [
          { text: "Analiza la siguiente lista de medicamentos activos y genera las advertencias correspondientes:" },
          { text: JSON.stringify(payloadToAnalyze, null, 2) }
        ]
      }
    ],
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.0,
      responseMimeType: "application/json",
      responseSchema: warningAnalysisSchema
    }
  });

  return JSON.parse(response.text);
}

module.exports = { analyzeMedicationsWithGemini };