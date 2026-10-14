
const supabase = require("../config/supabase");
const { analyzeMedicationsWithGemini } = require("./geminiAnalyzer");

async function syncWarningsForUser(userId) {
  // 1. Obtenemos los medicamentos activos y sus horarios.
  const { data: medications, error: medicationError } = await supabase
    .from("medications")
    .select("*, schedules(hour)")
    .eq("user_id", userId)
    .eq("is_active", true);

  if (medicationError) {
    throw medicationError;
  }

  // 2. Analizamos los medicamentos ANTES de borrar advertencias anteriores.
  // Si Gemini falla, la función se detiene y no borra las advertencias guardadas.
  const analysis = await analyzeMedicationsWithGemini(medications || []);

  // 3. Guardamos los IDs reales para descartar identificadores inventados.
  const validIds = new Set((medications || []).map((m) => m.id));

  // 4. Reemplazamos las advertencias anteriores del usuario.
  const { error: deleteError } = await supabase
    .from("warnings")
    .delete()
    .eq("user_id", userId);

  if (deleteError) {
    throw deleteError;
  }

  // 5. Insertamos las nuevas advertencias.
  for (const warning of analysis.warnings) {
    const { data: row, error: insertError } = await supabase
      .from("warnings")
      .insert({
        user_id: userId,
        type: warning.type,
        severity: warning.severity,
        title: warning.title,
        message: warning.message,
        recommendation: warning.recommendation,
        evidence_level: warning.evidence_level,
        source: warning.source,
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    // Vinculamos la advertencia únicamente con medicamentos existentes.
    const links = (warning.medication_ids || [])
      .filter((id) => validIds.has(id))
      .map((id) => ({
        warning_id: row.id,
        medication_id: id,
      }));

    if (links.length > 0) {
      const { error: relationError } = await supabase
        .from("warning_medications")
        .insert(links);

      if (relationError) {
        // Informamos del error para no ocultar una vinculación fallida.
        console.error(
          "Error al vincular una advertencia con medicamentos:",
          relationError
        );

        throw relationError;
      }
    }
  }

  // 6. Devolvemos el análisis para que lo reciba el controlador.
  return analysis;
}

module.exports = { syncWarningsForUser };