const supabase = require("../config/supabase");
const { todayRange, doseDateTime } = require("../utils/schedule");

// Minutos de tolerancia: pasado este tiempo sin tomarla, la toma se considera "missed" (olvidada).
const GRACE_MINUTES = 60;

const getTodayReminders = async (req, res) => {
  const { ymd, start, end } = todayRange(); // fecha de hoy y límites del día

  // 1) Medicamentos activos del usuario con sus horarios
  const { data: meds, error } = await req.supabase
    .from("medications")
    .select("id, name, dosage, schedules(id, hour)")
    .eq("user_id", req.user.id)
    .eq("is_active", true);

  if (error) return res.status(500).json({ message: error.message });
  if (meds.length === 0) return res.json([]);

  // 2) Tomas registradas HOY para esos medicamentos
  const { data: intakes, error: intakesError } = await req.supabase
    .from("intakes")
    .select("*")
    .in("medication_id", meds.map((m) => m.id))
    .gte("taken_at", start.toISOString())
    .lt("taken_at", end.toISOString());

  if (intakesError) return res.status(500).json({ message: intakesError.message });

  const now = new Date();
  const doses = [];

  // 3) Para cada horario de cada medicamento calculamos su estado
  for (const med of meds) {
    for (const s of med.schedules || []) {
      const when = doseDateTime(ymd, s.hour); // fecha/hora exacta de esa toma hoy
      const taken = intakes.some((i) => i.schedule_id === s.id && i.taken); // ¿ya se registró?
      const minutesLate = (now - when) / 60000; // minutos transcurridos desde la hora programada

      // Estados posibles:
      // taken → ya la tomó
      // missed → pasó más de GRACE_MINUTES y no la tomó
      // due → ya es la hora (dentro de la tolerancia)
      // pending → todavía no llegó la hora
      let status = "pending";
      if (taken) status = "taken";
      else if (minutesLate > GRACE_MINUTES) status = "missed";
      else if (minutesLate >= 0) status = "due";

      doses.push({
        medication_id: med.id,
        name: med.name,
        dosage: med.dosage,
        schedule_id: s.id,
        hour: s.hour.slice(0, 5), // "10:00:00" → "10:00"
        scheduled_for: when.toISOString(),
        status,
      });
    }
  }

  // 4) Ordenamos cronológicamente y devolvemos
  doses.sort((a, b) => a.scheduled_for.localeCompare(b.scheduled_for));
  res.json(doses);
};

module.exports = { getTodayReminders };