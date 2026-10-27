const TZ = "America/Argentina/Buenos_Aires"; // UTC-3 fijo, sin horario de verano

// Calcula cada cuántas HORAS se toma el medicamento.
// Si el frontend manda interval_hours (ej. 8), se usa directamente.
// Si no, se intenta deducirlo de la frecuencia (ej. "cada 8h", "una vez al día", etc.)
function parseIntervalHours(frequency, intervalHours) {
  const n = Number(intervalHours);
  if (n > 0) return n;
  const f = (frequency || "").toLowerCase();
  if (f.includes("una vez")) return 24;
  if (f.includes("dos veces")) return 12;
  if (f.includes("tres veces")) return 8;
  // Busca un patrón como "cada 8h" y extrae el número de horas
  const m = f.match(/cada\s+(\d+)\s*h/);
  return m ? Number(m[1]) : 24; // Por defecto, una vez al día
}

// Genera todas las horas del día a partir de la primera.
// "08:00" + cada 8h => ["08:00", "16:00", "00:00"]
function computeDoseHours(startHour, intervalHours) {
  const [h, m] = startHour.split(":").map(Number);
  const count = Math.max(1, Math.floor(24 / intervalHours));
  return Array.from({ length: count }, (_, i) => {
    // % 24 hace que después de las 23 vuelva a 0 (pasa de medianoche).
    const hh = (h + i * intervalHours) % 24;
    // padStart agrega el cero adelante: 8 → "08".
    return `${String(hh).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  });
}

// Devuelve el inicio y el fin del día de HOY en horario argentino.
// Sirve para buscar "las tomas registradas hoy" en la base.
function todayRange() {
  // "en-CA" devuelve la fecha como AAAA-MM-DD, ideal para armar un Date.
  const ymd = new Date().toLocaleDateString("en-CA", { timeZone: TZ });
  const start = new Date(`${ymd}T00:00:00-03:00`); // hoy 00:00
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000); // mañana 00:00
  return { ymd, start, end };
}

// Combina una fecha (AAAA-MM-DD) y una hora ("10:00:00") en un Date concreto.
function doseDateTime(ymd, hour) {
  return new Date(`${ymd}T${hour.slice(0, 5)}:00-03:00`);
}

module.exports = { parseIntervalHours, computeDoseHours, todayRange, doseDateTime };