import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/medications.css";

import { getMedications } from "../services/api";

function Medications() {
  const navigate = useNavigate();

  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMedications = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMedications();

        console.log("Medicamentos recibidos:", data);

        setMedications(data);
      } catch (error) {
        console.error("Error al obtener medicamentos:", error);
        setError(
          error.message || "No se pudieron cargar los medicamentos."
        );
      } finally {
        setLoading(false);
      }
    };

    loadMedications();
  }, []);

  return (
    <div className="medications">

      <header className="medications-header">
        <button
          className="back-button"
          onClick={() => navigate("/dashboard")}
        >
          ←
        </button>

        <h1>Mis medicamentos</h1>
      </header>


      <main className="medications-content">

        <div className="medications-title">
          <div>
            <p>Organizá tus medicamentos</p>
            <h2>Medicamentos</h2>
          </div>
        </div>


        {/* CARGANDO */}

        {loading && (
          <div className="empty-medications">
            <div className="medication-icon">
              💊
            </div>

            <p>Cargando medicamentos...</p>
          </div>
        )}


        {/* ERROR */}

        {!loading && error && (
          <div className="empty-medications">
            <div className="medication-icon">
              ⚠️
            </div>

            <h3>No se pudieron cargar los medicamentos</h3>

            <p>{error}</p>
          </div>
        )}


        {/* LISTA VACÍA */}

        {!loading && !error && medications.length === 0 && (
          <div className="empty-medications">
            <div className="medication-icon">
              💊
            </div>

            <h3>No tenés medicamentos registrados</h3>

            <p>
              Agregá tus medicamentos para poder
              recibir recordatorios y alertas.
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

        {!loading && !error && medications.length > 0 && (
          <div className="medications-list">

            {medications.map((medication) => (
              <div
                className="medication-card"
                key={medication.id}
              >

                <div className="medication-card-info">

                  <div className="medication-card-icon">
                    💊
                  </div>

                  <div>
                    <h3>{medication.name}</h3>

                    <p>
                      Dosis: {medication.dosage}
                    </p>

                    <p>
                      Frecuencia: {medication.frequency}
                    </p>

                    {medication.schedules &&
                      medication.schedules.length > 0 && (
                        <p>
                          Horario:{" "}
                          {medication.schedules[0].hour}
                        </p>
                    )}
                  </div>

                </div>


                <div className="medication-card-actions">

                  <button
                    onClick={() =>
                      console.log(
                        "Editar medicamento:",
                        medication
                      )
                    }
                  >
                    Editar
                  </button>

                  <button
                    onClick={() =>
                      console.log(
                        "Eliminar medicamento:",
                        medication
                      )
                    }
                  >
                    Eliminar
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}


        {/* BOTÓN AGREGAR */}

        {!loading && medications.length > 0 && (
          <button
            className="primary-button add-medication-button"
            onClick={() => navigate("/add-medication")}
          >
            + Agregar medicamento
          </button>
        )}

      </main>
    </div>
  );
}

export default Medications;