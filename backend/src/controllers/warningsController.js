const supabase = require("../config/supabase"); // Ajusta la ruta a tu cliente de Supabase
const { analyzeMedicationsWithGemini } = require("../services/geminiAnalyzer");

async function syncUserWarnings(req, res) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "El ID de usuario es requerido." });
    }

    // 1. Obtener medicamentos activos
    const { data: medications, error: medError } = await supabase
      .from("medications")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true);

    if (medError) throw medError;

    // 2. Analizar con Gemini
    const analysisResult = await analyzeMedicationsWithGemini(medications);

    // 3. Eliminar advertencias previas
    const { error: deleteError } = await supabase
      .from("warnings")
      .delete()
      .eq("user_id", userId);

    if (deleteError) throw deleteError;

    // 4. Insertar nuevas advertencias y sus relaciones
    if (analysisResult.warnings && analysisResult.warnings.length > 0) {
      for (const warn of analysisResult.warnings) {
        const { data: newWarning, error: insertWarnError } = await supabase
          .from("warnings")
          .insert({
            user_id: userId,
            type: warn.type,
            severity: warn.severity,
            title: warn.title,
            message: warn.message,
            recommendation: warn.recommendation,
            evidence_level: warn.evidence_level,
            source: warn.source
          })
          .select()
          .single();

        if (insertWarnError) throw insertWarnError;

        if (warn.medication_ids && warn.medication_ids.length > 0) {
          const relationInserts = warn.medication_ids.map(medId => ({
            warning_id: newWarning.id,
            medication_id: medId
          }));

          const { error: relError } = await supabase
            .from("warning_medications")
            .insert(relationInserts);

          if (relError) console.error("Error al vincular medicamento-advertencia:", relError);
        }
      }
    }

    return res.status(200).json({
      message: "Advertencias sincronizadas correctamente.",
      data: analysisResult
    });

  } catch (error) {
    console.error("Error en syncUserWarnings:", error);
    return res.status(500).json({ error: "Error interno al procesar las advertencias." });
  }
}

async function getUserMedicationsWithWarnings(req, res) {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .from("medications")
      .select(`
        *,
        warning_medications (
          warnings (
            id,
            type,
            severity,
            title,
            message,
            recommendation,
            evidence_level,
            source
          )
        )
      `)
      .eq("user_id", userId)
      .eq("is_active", true);

    if (error) throw error;

    return res.status(200).json({ medications: data });
  } catch (error) {
    console.error("Error al obtener medicamentos con advertencias:", error);
    return res.status(500).json({ error: "Error al consultar la información." });
  }
}

module.exports = {
  syncUserWarnings,
  getUserMedicationsWithWarnings
};