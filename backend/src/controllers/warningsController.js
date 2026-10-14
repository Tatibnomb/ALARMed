
const { syncWarningsForUser } = require("../services/warningsService");

async function syncUserWarnings(req, res) {
  try {
    const analysis = await syncWarningsForUser(req.user.id);

    return res.status(200).json({
      message: "Advertencias sincronizadas correctamente.",
      data: analysis,
    });
  } catch (error) {
    console.error("Error en syncUserWarnings:", error);

    const errorCode = String(error?.status || error?.code || "")
      .toUpperCase();

    // Si Gemini sigue sin estar disponible, informamos un error temporal.
    if (
      Number(error?.status || error?.code) === 503 ||
      ["UNAVAILABLE", "RESOURCE_EXHAUSTED"].includes(errorCode)
    ) {
      return res.status(503).json({
        error: "El servicio de análisis está temporalmente ocupado.",
        message:
          "Las advertencias anteriores se conservaron. Intentá sincronizar nuevamente más tarde.",
      });
    }

    return res.status(500).json({
      error: "Error interno al procesar las advertencias.",
    });
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

    if (error) {
      throw error;
    }

    return res.status(200).json({
      medications: data,
    });
  } catch (error) {
    console.error("Error al obtener medicamentos con advertencias:", error);

    return res.status(500).json({
      error: "Error al consultar la información.",
    });
  }
}

module.exports = {
  syncUserWarnings,
  getUserMedicationsWithWarnings,
};