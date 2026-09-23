const supabase = require("../config/supabase");
const Ajv = require("ajv");
const { analyzeMedications } = require("./geminiService");
const { ajvWarningSchema } = require("./warningSchema");

const ajv = new Ajv();
const validate = ajv.compile(ajvWarningSchema);

const generateWarningsForUser = async (userId) => {
  // 1. Traer medicamentos activos del usuario
  const { data: medications, error: medError } = await supabase
    .from("medications")
    .select("id, name, dosage, frequency, schedules(hour)")
    .eq("user_id", userId);

  if (medError) {
    console.error("Error trayendo medicamentos:", medError);
    return;
  }

  // Si no tiene medicamentos, borramos advertencias viejas y listo
  if (!medications.length) {
    await supabase.from("medication_warnings").delete().eq("user_id", userId);
    return;
  }

  // 2. Llamar a Gemini
  let result;
  try {
    result = await analyzeMedications(
      medications.map((m) => ({
        name: m.name,
        dosage: m.dosage,
        frequency: m.frequency,
        hour: m.schedules?.[0]?.hour,
      }))
    );
  } catch (err) {
    console.error("Error llamando a Gemini:", err.message);
    return; // no tocamos las advertencias existentes si Gemini falla
  }

  // 3. Validar el JSON contra el schema (defensa extra)
  if (!validate(result)) {
    console.error("Respuesta de Gemini no cumple el schema:", validate.errors);
    return;
  }

  // Mapa nombre → id de medicamento, para relacionar advertencias
  const nameToId = Object.fromEntries(medications.map((m) => [m.name.toLowerCase(), m.id]));

  // 4. Borrar advertencias viejas del usuario (recalculamos todo)
  await supabase.from("medication_warnings").delete().eq("user_id", userId);

  // 5. Insertar las nuevas
  for (const warning of result.warnings) {
    const { data: inserted, error: insertError } = await supabase
      .from("medication_warnings")
      .insert([{
        user_id: userId,
        type: warning.type,
        severity: warning.severity,
        title: warning.title,
        message: warning.message,
        recommendation: warning.recommendation,
        evidence_level: warning.evidence_level,
        source: warning.source,
      }])
      .select()
      .single();

    if (insertError) {
      console.error("Error guardando advertencia:", insertError);
      continue;
    }

    // Relacionar con los medicamentos que menciona
    const links = warning.medications
      .map((name) => nameToId[name.toLowerCase()])
      .filter(Boolean)
      .map((medication_id) => ({ warning_id: inserted.id, medication_id }));

    if (links.length) {
      await supabase.from("warning_medications").insert(links);
    }
  }
};

module.exports = { generateWarningsForUser };