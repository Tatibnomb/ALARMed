import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/add-medication.css";
import { createMedication } from "../services/api";

function AddMedication() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [hour, setHour] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    // Validar campos obligatorios
    if (!name || !dosage || !frequency || !hour) {
      setError("Completá todos los campos.");
      return;
    }

    try {
      setLoading(true);

      const medication = await createMedication({
        name,
        dosage,
        description: "",
        frequency,
        hour,
      });

      console.log("Medicamento guardado:", medication);
      setMessage("¡Medicamento guardado correctamente!");

      // Limpieza de campos
      setName("");
      setDosage("");
      setFrequency("");
      setHour("");

      // Redirección con retraso para permitir leer el mensaje de éxito
      setTimeout(() => {
        navigate("/medications");
      }, 1200);

    } catch (err) {
      console.error("Error al guardar medicamento:", err);
      setError(err.message || "No se pudo guardar el medicamento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-medication">
      <header className="add-medication-header">
        <button
          className="back-button"
          onClick={() => navigate("/medications")}
        >
          ←
        </button>
        <h1>Agregar medicamento</h1>
      </header>

      <main className="add-medication-content">
        <div className="form-intro">
          <h2>Nuevo medicamento</h2>
          <p>Completá los datos para agregar un medicamento a tu lista.</p>
        </div>

        <form className="medication-form" onSubmit={handleCreate}>
          {/* NOMBRE */}
          <div className="form-group">
            <label htmlFor="name">Nombre del medicamento</label>
            <input
              id="name"
              type="text"
              placeholder="Ej. Paracetamol"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* DOSIS */}
          <div className="form-group">
            <label htmlFor="dosage">Dosis</label>
            <input
              id="dosage"
              type="text"
              placeholder="Ej. 500 mg"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
            />
          </div>

          {/* FRECUENCIA */}
          <div className="form-group">
            <label htmlFor="frequency">Frecuencia</label>
            <select
              id="frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
            >
              <option value="">Seleccioná una frecuencia</option>
              <option value="Una vez al día">Una vez al día</option>
              <option value="Dos veces al día">Dos veces al día</option>
              <option value="Tres veces al día">Tres veces al día</option>
              <option value="Otra">Otra</option>
            </select>
          </div>

          {/* HORARIO */}
          <div className="form-group">
            <label htmlFor="hour">Horario de toma</label>
            <input
              id="hour"
              type="time"
              value={hour}
              onChange={(e) => setHour(e.target.value)}
            />
          </div>

          {/* MENSAJES DE ESTADO */}
          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}

          {/* BOTÓN SUBMIT */}
          <button
            type="submit"
            className="primary-button save-medication-button"
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar medicamento"}
          </button>
        </form>
      </main>
    </div>
  );
}

export default AddMedication;