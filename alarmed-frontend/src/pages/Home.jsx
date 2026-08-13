import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import Button from "../components/Button";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="phone">
      <div className="home-content">
          <Logo />

          <h2>Bienvenido a ALARMed</h2>

          <Button
            text="Registrarse"
            onClick={() => navigate("/register")}
            variant="primary"
          />

          <Button
            text="Iniciar sesión"
            onClick={() => navigate("/login")}
            variant="secondary"
          />
      </div>
    </div>
  );
}

export default Home;