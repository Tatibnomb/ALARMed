// backend/src/utils/ownership.js
const supabase = require("../config/supabase");

const medicationBelongsToUser = async (medicationId, userId) => {
  const { data, error } = await supabase
    .from("medications")
    .select("id")
    .eq("id", medicationId)
    .eq("user_id", userId)
    .single();

  return !error && !!data;
};

const getUserMedicationIds = async (userId) => {
  const { data, error } = await supabase
    .from("medications")
    .select("id")
    .eq("user_id", userId);

  if (error) {
    return { error };
  }

  return { ids: data.map((m) => m.id) };
};

module.exports = {
  medicationBelongsToUser,
  getUserMedicationIds,
};