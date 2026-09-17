import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMedicationsWithWarnings } from "../services/api"; // O la ruta donde tengas tu servicio
import "../styles/medications.css";

function Medications({ userId }) {
  const navigate = useNavigate();
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchMedicationsWithWarnings(userId);
      setMedications(data || []);
    } catch (error) {
      console.error("Error al cargar medicamentos:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "urgente": return "#FF3B30";
      case "importante": return "#FF9500";
      case "precaucion": return "#FFCC00";
      default: return "#007AFF";
    }
  };

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

        {loading ? (
          <p>Cargando medicamentos...</p>
        ) : medications.length === 0 ? (
          /* Estado vacío (Tu diseño original) */
          <div className="empty-medications">
            <div className="medication-icon">💊</div>
            <h3>No tenés medicamentos registrados</h3>
            <p>
              Agregá tus medicamentos para poder recibir recordatorios y alertas.
            </p>
            <button
              className="primary-button"
              onClick={() => navigate("/add-medication")}
            >
              + Agregar medicamento
            </button>
          </div>
        ) : (
          /* Lista de medicamentos con advertencias (Adaptado a Web) */
          <div className="medications-list">
            {medications.map((item) => (
              <div key={item.id} className="medication-card">
                <h3>{item.name} ({item.dosage})</h3>
                <p>{item.frequency} - {item.schedule}</p>

                {/* Renderizado de Advertencias */}
                {item.warning_medications?.map(({ warnings }) => (
                  <div
                    key={warnings.id}
                    className="warning-box"
                    style={{ borderColor: getSeverityColor(warnings.severity) }}
                  >
                    <strong style={{ color: getSeverityColor(warnings.severity) }}>
                      [{warnings.severity.toUpperCase()}] {warnings.title}
                    </strong>
                    <p className="warning-message">{warnings.message}</p>
                    <p className="warning-recommendation">💡 {warnings.recommendation}</p>
                    <small className="warning-source">Fuente: {warnings.source}</small>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Medications;