import { useNavigate } from "react-router-dom";
import "../styles/add-medication.css";

function AddMedication() {
  const navigate = useNavigate();

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

        <form className="medication-form">

          <div className="form-group">
            <label>Nombre del medicamento</label>
            <input
              type="text"
              placeholder="Ej. Paracetamol"
            />
          </div>

          <div className="form-group">
            <label>Dosis</label>
            <input
              type="text"
              placeholder="Ej. 500 mg"
            />
          </div>

          <div className="form-group">
            <label>Frecuencia</label>

            <select>
              <option value="">Seleccioná una frecuencia</option>
              <option value="daily">Una vez al día</option>
              <option value="twice">Dos veces al día</option>
              <option value="three">Tres veces al día</option>
              <option value="other">Otra</option>
            </select>
          </div>

          <div className="form-group">
            <label>Horario de toma</label>

            <input
              type="time"
            />
          </div>

          <button
            type="button"
            className="primary-button save-medication-button"
          >
            Guardar medicamento
          </button>

        </form>

      </main>
    </div>
  );
}

export default AddMedication;