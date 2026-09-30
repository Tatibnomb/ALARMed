const supabase = require("../config/supabase");
const { medicationBelongsToUser, getUserMedicationIds } = require("../utils/ownership");

const getIntakes = async (req, res) => {

    const { ids, error: idsError } = await getUserMedicationIds(req.user.id);

    if (idsError) {
        return res.status(500).json(idsError);
    }

    if (ids.length === 0) {
        return res.json([]);
    }

    const { data, error } = await supabase
        .from("intakes")
        .select("*")
        .in("medication_id", ids);

    if (error) {
        return res.status(500).json(error);
    }

    res.json(data);
};

const createIntake = async (req, res) => {

    const { medication_id, taken } = req.body;

    const owns = await medicationBelongsToUser(medication_id, req.user.id);

    if (!owns) {
        return res.status(403).json({
            message: "No podés registrar una toma de un medicamento que no te pertenece"
        });
    }

    const { data, error } = await supabase
        .from("intakes")
        .insert([{ medication_id, taken }])
        .select();

    if (error) {
        return res.status(500).json(error);
    }

    res.status(201).json(data);
};

const getMedicationHistory = async (req, res) => {

    const { id } = req.params;

    const owns = await medicationBelongsToUser(id, req.user.id);

    if (!owns) {
        return res.status(403).json({
            message: "No podés ver el historial de un medicamento que no te pertenece"
        });
    }

    const { data, error } = await supabase
        .from("intakes")
        .select("*")
        .eq("medication_id", id);

    if (error) {
        return res.status(500).json(error);
    }

    res.json(data);
};

module.exports = {
    getIntakes,
    createIntake,
    getMedicationHistory
};