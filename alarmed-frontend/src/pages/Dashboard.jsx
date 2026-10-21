import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
import WarningCard from "../components/WarningCard";
import useReminders from "../hooks/useReminders";
import {
  getMedications,
  getTodayIntakes,
  markDoseTaken,
  getWarnings,
  syncWarnings,
} from "../services/api";

const formatTime = (hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
};

const minutesSince = (hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes() - (h * 60 + m);
};

function Dashboard() {
  const navigate = useNavigate();

  const [medications, setMedications] = useState([]);
  const [takenToday, setTakenToday] = useState(new Set());
  const [markingId, setMarkingId] = useState(null);
  const [warnings, setWarnings] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);

  const loadWarnings = async () => {
    try {
      setWarnings(await getWarnings());
    } catch (e) {
      console.error("Advertencias:", e);
    }
  };

  const loadData = async () => {
    try {
      const [meds, intakes] = await Promise.all([
        getMedications(),
        getTodayIntakes(),
      ]);
      setMedications(meds);
      setTakenToday(new Set(intakes.map((i) => i.medication_id)));
    } catch (e) {
      console.error("Dashboard:", e);
    }
    loadWarnings();
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMarkTaken = async (medicationId) => {
    try {
      setMarkingId(medicationId);
      await markDoseTaken(medicationId);
      setTakenToday((cur) => new Set(cur).add(medicationId));
    } catch (e) {
      alert(e.message || "No se pudo registrar la toma.");
    } finally {
      setMarkingId(null);
    }
  };

  const handleAnalyze = async () => {
    try {
      setAnalyzing(true);
      await syncWarnings();
      await loadWarnings();
    } catch (e) {
      alert(e.message || "No se pudo revisar las interacciones.");
    } finally {
      setAnalyzing(false);
    }
  };

  // Una fila por cada horario de cada medicamento, ordenadas por hora
  const doses = medications
    .flatMap((m) =>
      (m.schedules || []).map((s) => ({
        key: s.id,
        medication: m,
        hour: s.hour.slice(0, 5),
      }))
    )
    .sort((a, b) => a.hour.localeCompare(b.hour));

  const { now, dueDoses, permission, requestPermission } = useReminders(doses, takenToday);
  const pendingDoses = doses.filter((d) => !takenToday.has(d.medication.id));
  const upcomingDoses = pendingDoses.slice(0, 3);
  const hiddenCount = pendingDoses.length - upcomingDoses.length;

  // Tomas pospuestas: { [key de la toma]: timestamp hasta cuando se oculta }
  const [snoozed, setSnoozed] = useState({});

  const reminderDose = dueDoses.find(
    (d) => (snoozed[d.key] || 0) <= Date.now()
  );


  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-welcome">Bienvenido/a</p>
          <h1>ALARMed</h1>
        </div>
        <div className="dashboard-user">👤</div>
      </header>

      <main className="dashboard-content">
        {reminderDose && (
          <div className="reminder-overlay">
            <div
              className="reminder-card"
              role="alertdialog"
              aria-labelledby="reminder-title"
            >
              <div className="reminder-icon">⏰</div>

              <h2 id="reminder-title">
                {minutesSince(reminderDose.hour) > 5
                  ? "Tenés una toma pendiente"
                  : "¡Es hora de tu medicamento!"}
              </h2>

              <p className="reminder-med">{reminderDose.medication.name}</p>
              <p className="reminder-dosage">
                {reminderDose.medication.dosage} · {formatTime(reminderDose.hour)}
              </p>

              <button
                className="primary-button reminder-primary"
                onClick={() => handleMarkTaken(reminderDose.medication.id)}
              >
                ✓ Ya la tomé
              </button>

              <button
                className="reminder-secondary"
                onClick={() =>
                  setSnoozed((cur) => ({
                    ...cur,
                    [reminderDose.key]: Date.now() + 10 * 60 * 1000,
                  }))
                }
              >
                Recordarme en 10 min
              </button>
            </div>
          </div>
        )}

        {permission === "default" && (
          <button className="enable-notifications" onClick={requestPermission}>
            🔔 Activar avisos del navegador
          </button>
        )}

        {permission === "default" && (
          <button className="enable-notifications" onClick={requestPermission}>
            🔔 Activar avisos del navegador
          </button>
        )}
        <section className="dashboard-summary">
          <h2>Resumen de hoy</h2>
          <div className="summary-cards">
            <div className="summary-card">
              <span className="summary-number">{medications.length}</span>
              <span>Medicamentos</span>
            </div>
            <div className="summary-card">
              <span className="summary-number">{pendingDoses.length}</span>
              <span>Próximas tomas</span>
            </div>
            <div className="summary-card">
              <span className="summary-number">{warnings.length}</span>
              <span>Alertas</span>
            </div>
          </div>
        </section>

        <section className="dashboard-section">
          <div className="section-title">
            <h2>Advertencias</h2>
            <button onClick={handleAnalyze} disabled={analyzing}>
              {analyzing ? "Analizando..." : "Revisar"}
            </button>
          </div>

          {warnings.length === 0 ? (
            <div className="empty-state">
              <p>No hay advertencias por ahora.</p>
            </div>
          ) : (
            <div className="warnings-list">
              {warnings.map((w) => (
                <WarningCard key={w.id} warning={w} />
              ))}
            </div>
          )}
        </section>

        <section className="dashboard-section dashboard-section-spaced">
          <div className="section-title">
            <h2>Próximas tomas</h2>
            <button onClick={() => navigate("/medications")}>Ver todas</button>
          </div>

          {doses.length === 0 ? (
            <div className="empty-state">
              <p>No hay medicamentos programados.</p>
              <button
                className="primary-button"
                onClick={() => navigate("/add-medication")}
              >
                + Agregar medicamento
              </button>
            </div>
          ) : pendingDoses.length === 0 ? (
            <div className="empty-state">
              <p>🎉 ¡Listo por hoy! Ya tomaste todo lo que tenías pendiente.</p>
              <button
                className="primary-button"
                onClick={() => navigate("/add-medication")}
              >
                + Agregar medicamento
              </button>
            </div>
          ) : (
            <div className="upcoming-list">
              {upcomingDoses.map(({ key, medication, hour }) => (
                <div className="upcoming-item" key={key}>
                  <div>
                    <p className="upcoming-name">{medication.name}</p>
                    <p className="upcoming-dosage">{medication.dosage}</p>
                  </div>

                  <div className="upcoming-time">
                    <span>Hoy</span>
                    <strong>{formatTime(hour)}</strong>
                  </div>

                  <button
                    className="taken-button"
                    disabled={markingId === medication.id}
                    onClick={() => handleMarkTaken(medication.id)}
                  >
                    {markingId === medication.id ? "Guardando..." : "Ya la tomé"}
                  </button>
                </div>
              ))}

              {hiddenCount > 0 && (
                <p className="upcoming-more">
                  Y {hiddenCount} {hiddenCount === 1 ? "toma más" : "tomas más"} después
                </p>
              )}
            </div>
          )}
        </section>
        <button
          className="primary-button history-link"
          onClick={() => navigate("/history")}
        >
          🗓️ Ver historial de tomas
        </button>
      </main>
    </div>
  );
}

export default Dashboard;