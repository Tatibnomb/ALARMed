import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getIntakes, getMedications } from "../services/api";
import "../styles/history.css";

function History() {
  const navigate = useNavigate();

  const [intakes, setIntakes] = useState([]);
  const [medications, setMedications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [intakesData, medsData] = await Promise.all([
          getIntakes(),
          getMedications(),
        ]);
        setIntakes(intakesData);
        setMedications(medsData);
      } catch (e) {
        setError(e.message || "No se pudo cargar el historial.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const nameById = Object.fromEntries(medications.map((m) => [m.id, m.name]));

  const filtered = intakes
    .filter(
      (i) => i.taken_at && (filter === "all" || i.medication_id === filter)
    )
    .sort((a, b) => new Date(b.taken_at) - new Date(a.taken_at));

  // Agrupa por día
  const byDay = filtered.reduce((acc, intake) => {
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
        <button className="back-button" onClick={() => navigate(-1)}>
          ←
        </button>
        <h1>Historial de tomas</h1>
      </header>

      <main className="history-content">
        {loading && <p className="history-message">Cargando historial...</p>}

        {!loading && error && <p className="history-message">⚠️ {error}</p>}

        {!loading && !error && (
          <select
            className="history-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Todos los medicamentos</option>
            {medications.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="history-empty">
            <div>🗓️</div>
            <p>Todavía no hay tomas registradas.</p>
          </div>
        )}

        {!loading &&
          !error &&
          Object.entries(byDay).map(([day, items]) => (
            <section className="history-day" key={day}>
              <h2>{day}</h2>
              {items.map((i) => (
                <div className="history-item" key={i.id}>
                  <div className="history-item-info">
                    <span className="history-med">
                      {nameById[i.medication_id] || "Medicamento"}
                    </span>
                    <span className={i.taken ? "history-ok" : "history-missed"}>
                      {i.taken ? "✓ Tomado" : "✗ Omitido"}
                    </span>
                  </div>
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