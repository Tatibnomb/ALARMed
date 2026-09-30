import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/medications.css";
import { getMedications, deleteMedication } from "../services/api";

function Medications() {
  const navigate = useNavigate();

  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Cargar medicamentos
  const loadMedications = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMedications();
      setMedications(data);
    } catch (err) {
      console.error("Error al obtener medicamentos:", err);
      setError("No se pudieron cargar los medicamentos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedications();
  }, []);

  // Eliminar medicamento
  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este medicamento?")) {
      return;
    }

    try {
      await deleteMedication(id);

      setMedications((prev) =>
        prev.filter((med) => med.id !== id)
      );
    } catch (err) {
      console.error("Error al eliminar:", err);
      alert("No se pudo eliminar el medicamento.");
    }
  };

  return (
    <div className="medications">

      {/* HEADER */}
      <header className="medications-header">
        <button
          className="back-button"
          onClick={() => navigate("/dashboard")}
        >
          ←
        </button>

        <h1>Mis medicamentos</h1>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="medications-content">

        {/* TÍTULO */}
        <div className="medications-title">
          <div>
            <p>Organizá tus medicamentos</p>
            <h2>Medicamentos</h2>
          </div>

          {medications.length > 0 && (
            <button
              className="primary-button"
              onClick={() => navigate("/add-medication")}
            >
              + Agregar
            </button>
          )}
        </div>

        {/* CARGANDO */}
        {loading && (
          <p className="loading-text">
            Cargando medicamentos...
          </p>
        )}

        {/* ERROR */}
        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        {/* SIN MEDICAMENTOS */}
        {!loading &&
          !error &&
          medications.length === 0 && (
            <div className="empty-medications">

              <div className="medication-icon">
                💊
              </div>

              <h3>
                No tenés medicamentos registrados
              </h3>

              <p>
                Agregá tus medicamentos para poder recibir
                recordatorios y alertas.
              </p>

              <button
                className="primary-button"
                onClick={() => navigate("/add-medication")}
              >
                + Agregar medicamento
              </button>

            </div>
          )}

        {/* LISTA DE MEDICAMENTOS */}
        {!loading &&
          !error &&
          medications.length > 0 && (

            <div className="medications-list">

              {medications.map((med) => (

                <div
                  key={med.id}
                  className="medication-card"
                >

                  {/* INFORMACIÓN */}
                  <div className="medication-info">

                    <h3>{med.name}</h3>

                    <p>
                      <strong>Dosis:</strong>{" "}
                      {med.dosage}
                    </p>

                    <p>
                      <strong>Frecuencia:</strong>{" "}
                      {med.frequency}
                    </p>

                    {med.schedules &&
                      med.schedules.length > 0 && (

                        <p>
                          <strong>Horario:</strong>{" "}

                          {med.schedules
                            .map((s) => s.hour)
                            .join(", ")}
                        </p>

                    )}

                  </div>

                  {/* ACCIONES */}
                  <div className="medication-actions">

                    <button
                      className="delete-button"
                      onClick={() =>
                        handleDelete(med.id)
                      }
                    >
                      Eliminar
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

      </main>

    </div>
  );
}

export default Medications;