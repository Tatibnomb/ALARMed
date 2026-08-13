import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Input from "../components/Input";
import Button from "../components/Button";
import Logo from "../components/Logo";

import { loginUser } from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Completá todos los campos");
      return;
    }

    try {
      setLoading(true);

      const data = await loginUser(email, password);

      console.log("Login exitoso:", data);

      navigate("/dashboard");

    } catch (error) {
      console.error(error);

      setError("Correo o contraseña incorrectos");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="phone">

      <Logo />

      <h1>Iniciar sesión</h1>

      <Input
        label="Correo electrónico"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Input
        label="Contraseña"
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      <Button
        text={loading ? "Iniciando..." : "Iniciar sesión"}
        onClick={handleLogin}
      />

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