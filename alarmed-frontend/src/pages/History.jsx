import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMedicationHistory, getMedications } from "../services/api";
import "../styles/history.css";

function History() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [medication, setMedication] = useState(null);
  const [intakes, setIntakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [history, meds] = await Promise.all([
          getMedicationHistory(id),
          getMedications(),
        ]);
        setMedication(meds.find((m) => m.id === id) || null);
        setIntakes(
          history
            .filter((i) => i.taken_at)
            .sort((a, b) => new Date(b.taken_at) - new Date(a.taken_at))
        );
      } catch (e) {
        setError(e.message || "No se pudo cargar el historial.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // Agrupa las tomas por día
  const byDay = intakes.reduce((acc, intake) => {
    const day = new Date(intake.taken_at).toLocaleDateString("es-AR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    (acc[day] = acc[day] || []).push(intake);
    return acc;
  }, {});

  return (
    <div className="history">
      <header className="history-header">
        <button className="back-button" onClick={() => navigate("/medications")}>
          ←
        </button>
        <h1>Historial{medication ? ` · ${medication.name}` : ""}</h1>
      </header>

      <main className="history-content">
        {loading && <p className="history-message">Cargando historial...</p>}

        {!loading && error && <p className="history-message">⚠️ {error}</p>}

        {!loading && !error && intakes.length === 0 && (
          <div className="history-empty">
            <div>🗓️</div>
            <p>Todavía no registraste ninguna toma de este medicamento.</p>
          </div>
        )}

        {!loading &&
          !error &&
          Object.entries(byDay).map(([day, items]) => (
            <section className="history-day" key={day}>
              <h2>{day}</h2>
              {items.map((i) => (
                <div className="history-item" key={i.id}>
                  <span className={i.taken ? "history-ok" : "history-missed"}>
                    {i.taken ? "✓ Tomado" : "✗ Omitido"}
                  </span>
                  <span>
                    {new Date(i.taken_at).toLocaleTimeString("es-AR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))}
            </section>
          ))}
      </main>
    </div>
  );
}

export default History;