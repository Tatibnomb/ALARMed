import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/medications.css";

import {
  getMedications,
  updateMedication,
  deleteMedication,
  markDoseTaken,
  getTodayIntakes,
  updateSchedule,
} from "../services/api";

function Medications() {
  const navigate = useNavigate();

  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // IDs de medicamentos ya tomados hoy
  const [takenToday, setTakenToday] = useState(new Set());
  const [markingId, setMarkingId] = useState(null);

  const [editingMedication, setEditingMedication] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDosage, setEditDosage] = useState("");
  const [editFrequency, setEditFrequency] = useState("");
  const [saving, setSaving] = useState(false);
  const [editHour, setEditHour] = useState("");

  // =========================
  // CARGAR MEDICAMENTOS + TOMAS DE HOY
  // =========================

  const loadMedications = async () => {
    try {
      setLoading(true);
      setError("");

      const [medsData, intakesData] = await Promise.all([
        getMedications(),
        getTodayIntakes(),
      ]);

      setMedications(medsData);
      setTakenToday(
        new Set(intakesData.map((intake) => intake.medication_id))
      );
    } catch (error) {
      console.error("Error al obtener medicamentos:", error);
      setError(
        error.message || "No se pudieron cargar los medicamentos."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedications();
  }, []);

  // =========================
  // MARCAR COMO TOMADO
  // =========================

  const handleMarkTaken = async (medicationId) => {
    try {
      setMarkingId(medicationId);

      await markDoseTaken(medicationId);

      setTakenToday((current) => new Set(current).add(medicationId));
    } catch (error) {
      console.error("Error al marcar la toma:", error);
      alert(error.message || "No se pudo registrar la toma.");
    } finally {
      setMarkingId(null);
    }
  };

  // ... (handleEdit, handleSaveEdit, handleDelete se quedan exactamente igual)

  const handleEdit = (medication) => {
    setEditingMedication(medication);
    setEditName(medication.name || "");
    setEditDosage(medication.dosage || "");
    setEditFrequency(medication.frequency || "");
    setEditHour(
      medication.schedules && medication.schedules.length > 0
        ? medication.schedules[0].hour.slice(0, 5) // "10:00:00" -> "10:00"
        : ""
    );
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editName || !editDosage || !editFrequency) {
      alert("Completá todos los campos.");
      return;
    }
    try {
      setSaving(true);

      await updateMedication(editingMedication.id, {
        name: editName,
        dosage: editDosage,
        description: editingMedication.description || "",
        frequency: editFrequency,
      });

      if (
        editHour &&
        editingMedication.schedules &&
        editingMedication.schedules.length > 0
      ) {
        await updateSchedule(editingMedication.schedules[0].id, editHour);
      }

      setEditingMedication(null);
      await loadMedications();
    } catch (error) {
      alert(error.message || "No se pudo editar el medicamento.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmar = window.confirm(
      "¿Estás seguro/a de que querés eliminar este medicamento?"
    );
    if (!confirmar) return;

    try {
      await deleteMedication(id);
      setMedications((current) =>
        current.filter((medication) => medication.id !== id)
      );
    } catch (error) {
      alert(error.message || "No se pudo eliminar el medicamento.");
    }
  };

  return (
    <div className="medications">
      <header className="medications-header">
        <button className="back-button" onClick={() => navigate("/dashboard")}>
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

        {loading && (
          <div className="empty-medications">
            <div className="medication-icon">💊</div>
            <p>Cargando medicamentos...</p>
          </div>
        )}

        {!loading && error && (
          <div className="empty-medications">
            <div className="medication-icon">⚠️</div>
            <h3>No se pudieron cargar los medicamentos</h3>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && medications.length === 0 && (
          <div className="empty-medications">
            <div className="medication-icon">💊</div>
            <h3>No tenés medicamentos registrados</h3>
            <p>Agregá tus medicamentos para poder recibir recordatorios y alertas.</p>
            <button className="primary-button" onClick={() => navigate("/add-medication")}>
              + Agregar medicamento
            </button>
          </div>
        )}

        {!loading && !error && medications.length > 0 && (
          <div className="medications-list">
            {medications.map((medication) => {
              const isTaken = takenToday.has(medication.id);

              return (
                <div className="medication-card" key={medication.id}>
                  <div className="medication-card-info">
                    <div className="medication-card-icon">💊</div>

                    <div>
                      <h3>{medication.name}</h3>
                      <p>Dosis: {medication.dosage}</p>
                      <p>Frecuencia: {medication.frequency}</p>

                      {medication.schedules && medication.schedules.length > 0 && (
                        <p>Horario: {medication.schedules[0].hour}</p>
                      )}
                    </div>
                  </div>

                  <div className="medication-card-actions">
                    <button
                      className={isTaken ? "taken-button taken" : "taken-button"}
                      disabled={isTaken || markingId === medication.id}
                      onClick={() => handleMarkTaken(medication.id)}
                    >
                      {isTaken
                        ? "✓ Tomado"
                        : markingId === medication.id
                        ? "Guardando..."
                        : "Ya la tomé"}
                    </button>

                    <button onClick={() => handleEdit(medication)}>Editar</button>
                    <button onClick={() => handleDelete(medication.id)}>Eliminar</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && !error && medications.length > 0 && (
          <button
            className="primary-button add-medication-button"
            onClick={() => navigate("/add-medication")}
          >
            + Agregar medicamento
          </button>
        )}

        {editingMedication && (
          <div className="edit-medication">
            <h2>Editar medicamento</h2>
            <form onSubmit={handleSaveEdit}>
              <div className="form-group">
                <label>Nombre del medicamento</label>
                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} />
              </div>

              <div className="form-group">
                <label>Dosis</label>
                <input type="text" value={editDosage} onChange={(e) => setEditDosage(e.target.value)} />
              </div>

              <div className="form-group">
                <label>Frecuencia</label>
                <select value={editFrequency} onChange={(e) => setEditFrequency(e.target.value)}>
                  <option value="">Seleccioná una frecuencia</option>
                  <option value="Una vez al día">Una vez al día</option>
                  <option value="Dos veces al día">Dos veces al día</option>
                  <option value="Tres veces al día">Tres veces al día</option>
                  <option value="Otra">Otra</option>
                </select>
              </div>

              <div className="form-group">
                <label>Horario de toma</label>
                <input
                  type="time"
                  value={editHour}
                  onChange={(e) => setEditHour(e.target.value)}
                />
              </div>

              <div className="edit-buttons">
                <button type="button" onClick={() => setEditingMedication(null)}>
                  Cancelar
                </button>
                <button type="submit" className="primary-button" disabled={saving}>
                  {saving ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default Medications;