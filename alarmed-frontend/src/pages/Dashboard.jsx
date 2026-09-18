import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMedications, getTodayIntakes, markDoseTaken } from "../services/api";
import "../styles/dashboard.css";

function getNextDoseDate(hourString) {
  const [h, m] = hourString.split(":").map(Number);
  const now = new Date();
  const next = new Date();
  next.setHours(h, m, 0, 0);
  if (next <= now) {
    next.setDate(next.getDate() + 1);
  }
  return next;
}

function formatTime(date) {
  return date.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
}

function formatDayLabel(date) {
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  return isToday ? "Hoy " : "Mañana ";
}

function Dashboard() {
  const navigate = useNavigate();
  const [medications, setMedications] = useState([]);
  const [takenToday, setTakenToday] = useState(new Set());
  const [markingId, setMarkingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      const [medsData, intakesData] = await Promise.all([
        getMedications(),
        getTodayIntakes(),
      ]);
      setMedications(medsData);
      setTakenToday(new Set(intakesData.map((i) => i.medication_id)));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMarkTaken = async (medicationId) => {
    try {
      setMarkingId(medicationId);
      await markDoseTaken(medicationId);
      setTakenToday((current) => new Set(current).add(medicationId));
    } catch (err) {
      alert(err.message || "No se pudo registrar la toma.");
    } finally {
      setMarkingId(null);
    }
  };

  const upcomingDoses = medications
  .flatMap((med) =>
    (med.schedules || []).map((schedule) => ({
      medicationId: med.id,
      medicationName: med.name,
      dosage: med.dosage,
      nextDose: getNextDoseDate(schedule.hour),
    }))
  )
  .filter((dose) => !takenToday.has(dose.medicationId))
  .sort((a, b) => a.nextDose - b.nextDose);

  const nextThreeDoses = upcomingDoses.slice(0, 3);

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
        <section className="dashboard-summary">
          <h2>Resumen de hoy</h2>
          <div className="summary-cards">
            <div className="summary-card">
              <span className="summary-number">{medications.length}</span>
              <span>Medicamentos</span>
            </div>
            <div className="summary-card">
              <span className="summary-number">{upcomingDoses.length}</span>
              <span>Próximas tomas</span>
            </div>
            <div className="summary-card">
              <span className="summary-number">0</span>
              <span>Alertas</span>
            </div>
          </div>
        </section>

        <section className="dashboard-section">
          <div className="section-title">
            <h2>Próximas tomas</h2>
            <button onClick={() => navigate("/medications")}>Ver todas</button>
          </div>

          {loading ? (
            <p>Cargando...</p>
          ) : error ? (
            <p>Ocurrió un error al cargar los medicamentos.</p>
          ) : nextThreeDoses.length === 0 ? (
            <div className="empty-state">
              <p>No hay medicamentos programados.</p>
              <button className="primary-button" onClick={() => navigate("/add-medication")}>
                + Agregar medicamento
              </button>
            </div>
          ) : (
            <div className="upcoming-list">
              {nextThreeDoses.map((dose, index) => {
                const isTaken = takenToday.has(dose.medicationId);
                return (
                  <div className="upcoming-item" key={index}>
                    <div>
                      <p className="upcoming-name">{dose.medicationName}</p>
                      <p className="upcoming-dosage">{dose.dosage}</p>
                    </div>

                    <div className="upcoming-time">
                      <span>{formatDayLabel(dose.nextDose)}</span>
                      <strong>{formatTime(dose.nextDose)}</strong>
                    </div>

                    <button
                      className={isTaken ? "taken-button taken" : "taken-button"}
                      disabled={isTaken || markingId === dose.medicationId}
                      onClick={() => handleMarkTaken(dose.medicationId)}
                    >
                      {isTaken
                        ? "✓ Tomado"
                        : markingId === dose.medicationId
                        ? "..."
                        : "Ya la tomé"}
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