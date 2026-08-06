import "../styles/global.css";
import "../styles/components.css";
import "../styles/register.css";

import Input from "../components/Input";
import Button from "../components/Button";
import Logo from "../components/Logo";

function Register() {
  return (
    <div className="phone">

      <Logo />

      <h1>Registrate</h1>

      <Input
        label="Nombre de usuario"
        placeholder="Nombre de usuario"
      />

      <Input
        label="Correo electrónico"
        placeholder="Correo electrónico"
      />

      <Input
        label="Contraseña"
        type="password"
        placeholder="Contraseña"
      />

      <Button text="Crear cuenta" />

    </div>
  );
}

export default Register;