import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-welcome">Bienvenido/a</p>
          <h1>ALARMed</h1>
        </div>

        <div className="dashboard-user">
          👤
        </div>
      </header>

      <main className="dashboard-content">
        <section className="dashboard-summary">
          <h2>Resumen de hoy</h2>

          <div className="summary-cards">
            <div className="summary-card">
              <span className="summary-number">0</span>
              <span>Medicamentos</span>
            </div>

            <div className="summary-card">
              <span className="summary-number">0</span>
              <span>Próximas tomas</span>
            </div>

            <div className="summary-card">
              <span className="summary-number">0</span>
              <span>Alertas</span>
            </div>
          </div>
        </section>

        <section className="dashboard-section">
          <div className="section-title">
            <h2>Próximas tomas</h2>

            <button
              onClick={() => navigate("/medications")}
            >
              Ver todas
            </button>
          </div>

          <div className="empty-state">
            <p>No hay medicamentos programados.</p>

            <button
              className="primary-button"
              onClick={() => navigate("/add-medication")}
            >
              + Agregar medicamento
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;