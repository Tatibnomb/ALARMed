const supabase = require("../config/supabase");
const { todayRange } = require("../utils/schedule");
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
  const { medication_id, schedule_id, taken = true } = req.body;

  const owns = await medicationBelongsToUser(medication_id, req.user.id);
  if (!owns) {
    return res.status(403).json({
      message: "No podés registrar una toma de un medicamento que no te pertenece",
    });
  }

  if (schedule_id) {
    // El horario tiene que ser de ese medicamento
    const { data: sched } = await supabase
      .from("schedules")
      .select("id")
      .eq("id", schedule_id)
      .eq("medication_id", medication_id)
      .maybeSingle();

    if (!sched) return res.status(400).json({ message: "Horario inválido para este medicamento" });

    // Evitar duplicar la toma del mismo horario en el día
    const { start, end } = todayRange();
    const { data: existing } = await supabase
      .from("intakes")
      .select("id")
      .eq("schedule_id", schedule_id)
      .gte("taken_at", start.toISOString())
      .lt("taken_at", end.toISOString())
      .limit(1);

    if (existing?.length) {
      return res.status(409).json({ message: "Esa toma ya fue registrada hoy" });
    }
  }

  const { data, error } = await supabase
    .from("intakes")
    .insert([{
      medication_id,
      schedule_id: schedule_id || null,
      taken,
      taken_at: new Date().toISOString(),
    }])
    .select();

  if (error) return res.status(500).json({ message: error.message });
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