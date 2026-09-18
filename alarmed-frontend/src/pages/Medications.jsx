<<<<<<< HEAD
import React, { useState, useEffect } from "react";
=======
import React, { useEffect, useState } from "react";
>>>>>>> parent of c2509e3 (Merge branch 'front')
import { useNavigate } from "react-router-dom";
import "../styles/medications.css";

<<<<<<< HEAD
// Importás directamente desde tu api.js
import { getMedications, deleteMedication } from "../services/api";

function Medications() {
=======
function Medications({ userId }) {
>>>>>>> parent of c2509e3 (Merge branch 'front')
  const navigate = useNavigate();
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
<<<<<<< HEAD
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
=======
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
>>>>>>> parent of c2509e3 (Merge branch 'front')
    }
  };

  return (
    <div className="medications">
      <header className="medications-header">
<<<<<<< HEAD
        <button className="back-button" onClick={() => navigate("/dashboard")}>←</button>
=======
        <button
          className="back-button"
          onClick={() => navigate("/dashboard")}
        >
          ←
        </button>
>>>>>>> parent of c2509e3 (Merge branch 'front')
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
<<<<<<< HEAD
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
=======
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
>>>>>>> parent of c2509e3 (Merge branch 'front')
        )}
      </main>
    </div>
  );
}

export default Medications;