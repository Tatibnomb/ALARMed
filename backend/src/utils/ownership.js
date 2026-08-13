const supabase = require("../config/supabase");

// Verifica que un medicamento pertenezca al usuario autenticado
const medicationBelongsToUser = async (medicationId, userId) => {

    const { data, error } = await supabase
        .from("medications")
        .select("id")
        .eq("id", medicationId)
        .eq("user_id", userId)
        .single();

    return !error && !!data;
};

// Devuelve los ids de todos los medicamentos de un usuario
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
    getUserMedicationIds
};