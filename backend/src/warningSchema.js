const { Type } = require("@google/genai");

// Para Gemini (fuerza el formato de salida)
const geminiResponseSchema = {
  type: Type.OBJECT,
  properties: {
    medications_analyzed: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    warnings: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: {
            type: Type.STRING,
            enum: ["interaction", "individual", "administration", "duplication"],
          },
          severity: {
            type: Type.STRING,
            enum: ["info", "precaucion", "importante", "urgente"],
          },
          title: { type: Type.STRING },
          medications: { type: Type.ARRAY, items: { type: Type.STRING } },
          message: { type: Type.STRING },
          recommendation: { type: Type.STRING },
          evidence_level: {
            type: Type.STRING,
            enum: ["alto", "medio", "bajo", "insuficiente"],
          },
          source: { type: Type.STRING },
        },
        required: [
          "type", "severity", "title", "medications",
          "message", "recommendation", "evidence_level", "source",
        ],
      },
    },
  },
  required: ["medications_analyzed", "warnings"],
};

// Para validar en el backend con Ajv (JSON Schema estándar)
const ajvWarningSchema = {
  type: "object",
  properties: {
    medications_analyzed: { type: "array", items: { type: "string" } },
    warnings: {
      type: "array",
      items: {
        type: "object",
        properties: {
          type: { enum: ["interaction", "individual", "administration", "duplication"] },
          severity: { enum: ["info", "precaucion", "importante", "urgente"] },
          title: { type: "string" },
          medications: { type: "array", items: { type: "string" } },
          message: { type: "string" },
          recommendation: { type: "string" },
          evidence_level: { enum: ["alto", "medio", "bajo", "insuficiente"] },
          source: { type: "string" },
        },
        required: ["type", "severity", "title", "medications", "message", "recommendation", "evidence_level", "source"],
        additionalProperties: false,
      },
    },
  },
  required: ["medications_analyzed", "warnings"],
  additionalProperties: false,
};

module.exports = { geminiResponseSchema, ajvWarningSchema };