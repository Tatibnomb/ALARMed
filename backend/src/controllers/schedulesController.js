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

    const { data, error } = await req.supabase
        .from("schedules")
        .select("*")
        .in("medication_id", ids);

    if (error) {
        return res.status(500).json(error);
    }

    res.json(data);
};

const createSchedule = async (req, res) => {
    
    const {
        medication_id,
        date,
        hour
    } = req.body;

    const owns = await medicationBelongsToUser(req.supabase, medication_id, req.user.id);

    if (!owns) {
        return res.status(403).json({
            message: "No podés crear un horario para un medicamento que no te pertenece"
        });
    }

    const { data, error } = await req.supabase
        .from("schedules")
        .insert([{
            medication_id,
            date,
            hour
        }])
        .select();

    if (error) {
        return res.status(500).json(error);
    }

    res.status(201).json(data);
};

const updateSchedule = async (req, res) => {
    const { id } = req.params;
    const { hour } = req.body;

    if (!hour || !/^\d{2}:\d{2}(:\d{2})?$/.test(hour)) {
        return res.status(400).json({ message: "Hora inválida. Usá el formato HH:MM" });
    }

    // Buscar el horario y verificar que su medicamento sea del usuario
    const { data: schedule, error: findError } = await req.supabase
        .from("schedules")
        .select("id, medication_id")
        .eq("id", id)
        .maybeSingle();

    if (findError) {
        return res.status(500).json({ message: findError.message });
    }

    if (!schedule) {
        return res.status(404).json({ message: "Horario no encontrado" });
    }

    const owns = await medicationBelongsToUser(req.supabase, schedule.medication_id, req.user.id);

    if (!owns) {
        return res.status(403).json({
            message: "No podés editar un horario que no te pertenece"
        });
    }

    const { data, error } = await req.supabase
        .from("schedules")
        .update({ hour })
        .eq("id", id)
        .select();

    if (error) {
        return res.status(500).json({ message: error.message });
    }

    res.json(data);
};

module.exports = {
    getSchedules,
    createSchedule,
    updateSchedule
};