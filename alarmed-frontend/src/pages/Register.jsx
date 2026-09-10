import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/global.css";
import "../styles/components.css";
import "../styles/register.css";

import Input from "../components/Input";
import Button from "../components/Button";
import Logo from "../components/Logo";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    console.log("BOTÓN FUNCIONANDO");

    setMessage("");
    setError("");

    if (!name || !email || !password) {
      setError("Completá todos los campos.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3000/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      console.log("Respuesta del backend:", data);

      if (!response.ok) {
        setError(
          data.message || "No se pudo crear la cuenta."
        );
        return;
      }

      setMessage("¡Cuenta creada correctamente!");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      console.error("Error:", error);
      setError("No se pudo conectar con el servidor.");
    }
  };

  return (
    <div className="phone">

      <Logo />

      <h1>Registrate</h1>

      <Input
        label="Nombre de usuario"
        placeholder="Nombre de usuario"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

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

      <Button
        text="Crear cuenta"
        onClick={handleRegister}
      />

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      {message && (
        <p className="success-message">
          {message}
        </p>
      )}

    </div>
  );
}

export default Register;