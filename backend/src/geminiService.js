const ai = require("../config/gemini");
const { SYSTEM_PROMPT } = require("./systemPrompt");
const { geminiResponseSchema } = require("./warningSchema");

// medications: array de { name, dosage, frequency, hour }
const analyzeMedications = async (medications) => {
  // Armamos los datos como JSON, no como texto libre redactado por nosotros.
  // Esto es lo que hace que el sistema sea genérico: nunca escribimos un
  // prompt distinto por medicamento, solo cambian los datos.
  const userContent = JSON.stringify(
    medications.map((m) => ({
      name: m.name,
      dosage: m.dosage,
      frequency: m.frequency,
      hour: m.hour || null,
    }))
  );

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [{ text: `Medicamentos registrados por el usuario:\n${userContent}` }],
      },
    ],
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseSchema: geminiResponseSchema,
      temperature: 0.2, // baja temperatura: queremos consistencia, no creatividad
    },
  });

  // Con responseSchema, response.text ya debería ser JSON válido,
  // pero igual lo parseamos con try/catch por seguridad.
  return JSON.parse(response.text);
};

module.exports = { analyzeMedications };