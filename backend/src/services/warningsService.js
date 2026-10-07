const supabase = require("../config/supabase");
const { analyzeMedicationsWithGemini } = require("./geminiAnalyzer");

async function syncWarningsForUser(userId) {
  const { data: medications, error } = await supabase
    .from("medications")
    .select("*, schedules(hour)")
    .eq("user_id", userId)
    .eq("is_active", true);
  if (error) throw error;

  // Si Gemini falla, se lanza el error antes de borrar las advertencias viejas
  const analysis = await analyzeMedicationsWithGemini(medications);

  const validIds = new Set(medications.map((m) => m.id));

  await supabase.from("warnings").delete().eq("user_id", userId);

  for (const w of analysis.warnings || []) {
    const { data: row, error: insErr } = await supabase
      .from("warnings")
      .insert({
        user_id: userId,
        type: w.type,
        severity: w.severity,
        title: w.title,
        message: w.message,
        recommendation: w.recommendation,
        evidence_level: w.evidence_level,
        source: w.source,
      })
      .select()
      .single();
    if (insErr) throw insErr;

    // Descartar IDs que Gemini pueda haber inventado
    const links = (w.medication_ids || [])
      .filter((id) => validIds.has(id))
      .map((id) => ({ warning_id: row.id, medication_id: id }));

    if (links.length) {
      const { error: relErr } = await supabase.from("warning_medications").insert(links);
      if (relErr) console.error("Error vinculando advertencia:", relErr);
    }
  }

  return analysis;
}

module.exports = { syncWarningsForUser };