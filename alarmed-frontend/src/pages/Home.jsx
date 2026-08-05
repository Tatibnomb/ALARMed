import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="phone">
      <div className="logo">
        💊 ALARMed
      </div>

      <h2>Bienvenido a ALARMed</h2>

      <button onClick={() => navigate("/register")}>
        Registrarse
      </button>

      <button onClick={() => navigate("/login")}>
        Iniciar sesión
      </button>
    </div>
  );
}

export default Home;