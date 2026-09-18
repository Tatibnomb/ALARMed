import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/medications.css";

// Importás directamente desde tu api.js
import { getMedications, deleteMedication } from "../services/api";

function Medications() {
  const navigate = useNavigate();
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ejecutás la función exportada en api.js
    getMedications()
      .then((data) => {
        setMedications(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este medicamento?")) return;
    try {
      await deleteMedication(id); // Llamada a api.js
      setMedications(medications.filter((med) => med.id !== id));
    } catch (err) {
      alert("Error al eliminar");
    }
  };

  return (
    <div className="medications">
      <header className="medications-header">
        <button className="back-button" onClick={() => navigate("/dashboard")}>←</button>
        <h1>Mis medicamentos</h1>
      </header>

      <main className="medications-content">
        {loading ? (
          <p>Cargando...</p>
        ) : medications.length === 0 ? (
          <div className="empty-medications">
            <div className="medication-icon">💊</div>
            <h3>No tenés medicamentos registrados</h3>
            <button className="primary-button" onClick={() => navigate("/add-medication")}>
              + Agregar medicamento
            </button>
          </div>
        ) : (
          <div className="medications-list">
            {medications.map((med) => (
              <div key={med.id} className="medication-card">
                <div>
                  <h3>{med.name}</h3>
                  <p><strong>Dosis:</strong> {med.dosage}</p>
                  <p><strong>Frecuencia:</strong> {med.frequency}</p>
                  {med.schedules?.length > 0 && (
                    <p><strong>Horario:</strong> {med.schedules.map((s) => s.hour).join(", ")}</p>
                  )}
                </div>
                <button onClick={() => handleDelete(med.id)}>Eliminar</button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Medications;