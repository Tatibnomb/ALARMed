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

  const { dueDoses, permission, requestPermission } = useReminders(doses, takenToday);

  const pendingCount = medications.filter((m) => !takenToday.has(m.id)).length;

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
        {dueDoses.length > 0 && (
          <section className="reminder-banner">
            <strong>⏰ Tenés {dueDoses.length === 1 ? "una toma pendiente" : `${dueDoses.length} tomas pendientes`}</strong>
            <ul>
              {dueDoses.map((d) => (
                <li key={d.key}>
                  {d.medication.name} · {d.hour}
                  <button onClick={() => handleMarkTaken(d.medication.id)}>Ya la tomé</button>
                </li>
              ))}
            </ul>
          </section>
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
              <span className="summary-number">{pendingCount}</span>
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
          ) : (
            <div className="upcoming-list">
              {doses.map(({ key, medication, hour }) => {
                const isTaken = takenToday.has(medication.id);
                return (
                  <div className="upcoming-item" key={key}>
                    <div>
                      <p className="upcoming-name">{medication.name}</p>
                      <p className="upcoming-dosage">{medication.dosage}</p>
                    </div>
                    <div className="upcoming-time">
                      <strong>{hour}</strong>
                    </div>
                    <button
                      className={isTaken ? "taken-button taken" : "taken-button"}
                      disabled={isTaken || markingId === medication.id}
                      onClick={() => handleMarkTaken(medication.id)}
                    >
                      {isTaken ? "✓ Tomado" : "Ya la tomé"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;