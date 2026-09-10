import { useNavigate } from "react-router-dom";
import "../styles/medications.css";

function Medications() {
  const navigate = useNavigate();

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

      </main>
    </div>
  );
}

export default Medications;