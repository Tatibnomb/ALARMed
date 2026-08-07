import Input from "../components/Input";
import Button from "../components/Button";
import Logo from "../components/Logo";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  return (
    <div className="phone">

      <Logo />

      <h1>Iniciar sesión</h1>

      <Input
        label="Correo electrónico"
        placeholder="Correo electrónico"
      />

      <Input
        label="Contraseña"
        type="password"
        placeholder="Contraseña"
      />

      <Button text="Iniciar sesión" />

      <button
        className="secondary-link"
        onClick={() => navigate("/register")}
      >
        ¿No tenés una cuenta? Registrate
      </button>

    </div>
  );
}

export default Login;