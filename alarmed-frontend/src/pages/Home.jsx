import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="phone">
      <Logo />

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