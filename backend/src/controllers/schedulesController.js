const supabase = require("../config/supabase");
const { medicationBelongsToUser, getUserMedicationIds } = require("../utils/ownership");

const getSchedules = async (req, res) => {

    const { ids, error: idsError } = await getUserMedicationIds(req.user.id);

    if (idsError) {
        return res.status(500).json(idsError);
    }

    if (ids.length === 0) {
        return res.json([]);
    }

    const { data, error } = await supabase
        .from("schedules")
        .select("*")
        .in("medication_id", ids);

    if (error) {
        return res.status(500).json(error);
    }

    res.json(data);
};

const createSchedule = async (req, res) => {

    const { medication_id, hour } = req.body;

    const owns = await medicationBelongsToUser(medication_id, req.user.id);

    if (!owns) {
        return res.status(403).json({
            message: "No podés crear un horario para un medicamento que no te pertenece"
        });
    }

    const { data, error } = await supabase
        .from("schedules")
        .insert([{ medication_id, hour }])
        .select();

    if (error) {
        return res.status(500).json(error);
    }

    res.status(201).json(data);
};

module.exports = {
    getSchedules,
    createSchedule
};