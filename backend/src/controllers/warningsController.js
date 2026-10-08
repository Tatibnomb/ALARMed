const supabase = require("../config/supabase");
const { syncWarningsForUser } = require("../services/warningsService");

async function syncUserWarnings(req, res) {
  try {
    const analysis = await syncWarningsForUser(req.user.id);
    res.json({
      message: "Advertencias sincronizadas correctamente.",
      data: analysis,
    });
  } catch (error) {
    console.error("Error en syncUserWarnings:", error);
    res.status(500).json({ error: "Error interno al procesar las advertencias." });
  }
}

async function getUserMedicationsWithWarnings(req, res) {
  try {
    const userId = req.user.id;

    const { data, error } = await req.supabase
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
  getUserMedicationsWithWarnings,
};