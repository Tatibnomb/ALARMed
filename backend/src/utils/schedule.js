const TZ = "America/Argentina/Buenos_Aires"; // UTC-3 fijo, sin horario de verano

function parseIntervalHours(frequency, intervalHours) {
  const n = Number(intervalHours);
  if (n > 0) return n;
  const f = (frequency || "").toLowerCase();
  if (f.includes("una vez")) return 24;
  if (f.includes("dos veces")) return 12;
  if (f.includes("tres veces")) return 8;
  const m = f.match(/cada\s+(\d+)\s*h/);
  return m ? Number(m[1]) : 24;
}

// "08:00" + cada 8h => ["08:00", "16:00", "00:00"]
function computeDoseHours(startHour, intervalHours) {
  const [h, m] = startHour.split(":").map(Number);
  const count = Math.max(1, Math.floor(24 / intervalHours));
  return Array.from({ length: count }, (_, i) => {
    const hh = (h + i * intervalHours) % 24;
    return `${String(hh).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  });
}

function todayRange() {
  const ymd = new Date().toLocaleDateString("en-CA", { timeZone: TZ });
  const start = new Date(`${ymd}T00:00:00-03:00`);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  return { ymd, start, end };
}

function doseDateTime(ymd, hour) {
  return new Date(`${ymd}T${hour.slice(0, 5)}:00-03:00`);
}

module.exports = { parseIntervalHours, computeDoseHours, todayRange, doseDateTime };