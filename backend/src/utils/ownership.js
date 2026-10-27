const supabase = require("../config/supabase");

// Verifica si un medicamento pertenece a un usuario específico
const medicationBelongsToUser = async (db, medicationId, userId) => {
    const { data, error } = await db
        .from("medications")
        .select("id")
        .eq("id", medicationId)
        .eq("user_id", userId)
        .maybeSingle();

    return !error && !!data;
};

// Obtiene los IDs de los medicamentos de un usuario específico
const getUserMedicationIds = async (db, userId) => {
    const { data, error } = await db
        .from("medications")
        .select("id")
        .eq("user_id", userId);

    if (error) return { error };
    return { ids: data.map((m) => m.id) };
};

module.exports = {
  medicationBelongsToUser,
  getUserMedicationIds,
};