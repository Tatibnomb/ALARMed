import logo from "../assets/logo.png";

import Input from "../components/Input";
import Button from "../components/Button";

function Register() {
  return (
    <div className="phone">

      <div className="header">
        <img src={logo} alt="Logo" className="logo-img" />

        <div className="logo-text">
            <span>ALARMed</span>
        </div>
      </div>

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