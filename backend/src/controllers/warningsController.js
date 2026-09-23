const supabase = require("../config/supabase");
const { generateWarningsForUser } = require("../services/warningsService");

const getWarnings = async (req, res) => {
  const { data, error } = await supabase
    .from("medication_warnings")
    .select("*, warning_medications(medication_id)")
    .eq("user_id", req.user.id)
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json(error);

  res.json(data);
};

// Endpoint manual, útil para probar sin tener que crear/editar un medicamento
const regenerateWarnings = async (req, res) => {
  await generateWarningsForUser(req.user.id);
  res.json({ message: "Advertencias regeneradas" });
};

module.exports = { getWarnings, regenerateWarnings };