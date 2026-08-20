import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/add-medication.css";

import {
  createMedication,
  createSchedule,
} from "../services/api";

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

    // Validar campos
    if (!name || !dosage || !frequency || !hour) {
      setError("Completá todos los campos.");
      return;
    }

    try {
      setLoading(true);

      // Guardamos el medicamento en el backend
      const medication = await createMedication({
        name,
        dosage,
        description: "",
        frequency,
      });
      console.log("Medicamento guardado:", medication);
      const medicationId = medication[0].id;
      await createSchedule({
        medication_id: medication.id,
        hour,
      });

      console.log("Horario guardado:", hour);

      setMessage("¡Medicamento guardado correctamente!");

      // Limpiamos el formulario
      setName("");
      setDosage("");
      setFrequency("");
      setHour("");

      // Esperamos un momento y volvemos a medicamentos
      setTimeout(() => {
        navigate("/medications");
      }, 1000);

    } catch (error) {
      console.error("Error al guardar medicamento:", error);

      setError(
        error.message || "No se pudo guardar el medicamento."
      );

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

          <p>
            Completá los datos para agregar un medicamento
            a tu lista.
          </p>

        </div>


        <form
          className="medication-form"
          onSubmit={handleCreate}
        >

          {/* NOMBRE */}

          <div className="form-group">

            <label>
              Nombre del medicamento
            </label>

            <input
              type="text"
              placeholder="Ej. Paracetamol"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

          </div>


          {/* DOSIS */}

          <div className="form-group">

            <label>
              Dosis
            </label>

            <input
              type="text"
              placeholder="Ej. 500 mg"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
            />

          </div>


          {/* FRECUENCIA */}

          <div className="form-group">

            <label>
              Frecuencia
            </label>

            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
            >

              <option value="">
                Seleccioná una frecuencia
              </option>

              <option value="Una vez al día">
                Una vez al día
              </option>

              <option value="Dos veces al día">
                Dos veces al día
              </option>

              <option value="Tres veces al día">
                Tres veces al día
              </option>

              <option value="Otra">
                Otra
              </option>

            </select>

          </div>


          {/* HORARIO */}

          <div className="form-group">

            <label>
              Horario de toma
            </label>

            <input
              type="time"
              value={hour}
              onChange={(e) => setHour(e.target.value)}
            />

          </div>


          {/* MENSAJE DE ERROR */}

          {error && (
            <p
              style={{
                color: "#d93025",
                marginTop: "10px",
                textAlign: "center",
              }}
            >
              {error}
            </p>
          )}


          {/* MENSAJE DE ÉXITO */}

          {message && (
            <p
              style={{
                color: "#188038",
                marginTop: "10px",
                textAlign: "center",
              }}
            >
              {message}
            </p>
          )}


          {/* BOTÓN */}

          <button
            type="submit"
            className="primary-button save-medication-button"
            disabled={loading}
          >
            {loading
              ? "Guardando..."
              : "Guardar medicamento"}
          </button>

        </form>

      </main>

    </div>
  );
}

export default AddMedication;