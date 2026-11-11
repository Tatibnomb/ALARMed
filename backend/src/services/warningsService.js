const supabase = require("../config/supabase");
const { analyzeMedicationsWithGemini } = require("./geminiAnalyzer");

// Detecta medicamentos idénticos por nombre (insensible a mayúsculas/espacios)
function detectLocalDuplicates(medications) {
  const duplicates = [];
  const seen = new Map();

  for (const med of medications) {
    const cleanName = (med.name || "").trim().toLowerCase();
    if (seen.has(cleanName)) {
      const prevMed = seen.get(cleanName);
      duplicates.push({
        type: "duplicate",
        severity: "precaucion",
        title: `Duplicidad detectada: ${med.name}`,
        message: `Tenés cargado "${med.name}" más de una vez. Verificar dosis total diaria.`,
        recommendation: "Revisá tu lista para evitar duplicar la toma del mismo fármaco.",
        evidence_level: "alto",
        source: "Regla de validación local ALARMed",
        medication_ids: [prevMed.id, med.id]
      });
    } else {
      seen.set(cleanName, med);
    }
  }
  return duplicates;
}
async function syncWarningsForUser(userId) {
  // 1. Obtenemos medicamentos
  const { data: medications, error: medicationError } = await supabase
    .from("medications")
    .select("*, schedules(hour)")
    .eq("user_id", userId)
    .eq("is_active", true);

  if (medicationError) throw medicationError;

  const validMeds = medications || [];
  if (validMeds.length === 0) {
    // Si no hay medicamentos, limpiar advertencias previas y retornar vacio
    await supabase.from("warnings").delete().eq("user_id", userId);
    return { medications_analyzed: [], warnings: [] };
  }

  // 2. Pre-validación local de duplicados
  const localWarnings = detectLocalDuplicates(validMeds);

  // 3. Analizar con Gemini
  const aiAnalysis = await analyzeMedicationsWithGemini(validMeds);

  // Unificar advertencias de Gemini + locales (evitando duplicar el objeto)
  const allWarnings = [...localWarnings, ...(aiAnalysis.warnings || [])];
  const combinedAnalysis = {
    medications_analyzed: validMeds.map(m => m.id),
    warnings: allWarnings
  };

  // 4. Limpiar y guardar en Supabase (continúa con tu flujo actual de inserción)
  await supabase.from("warnings").delete().eq("user_id", userId);

  const validIds = new Set(validMeds.map((m) => m.id));

  for (const warning of combinedAnalysis.warnings) {
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

    if (insertError) throw insertError;

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

      if (relationError) throw relationError;
    }
  }

  return combinedAnalysis;
}

module.exports = { syncWarningsForUser };