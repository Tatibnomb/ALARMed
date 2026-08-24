const API_URL = "http://192.168.56.1:3000";

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al iniciar sesión");
  }
// Guardamos el token para usarlo en las próximas
  // peticiones que necesitan autenticación.
  if (data.access_token) {
    localStorage.setItem("token", data.access_token);
  }

  return data;
};


/* MEDICAMENTOS */

export const createMedication = async ({
  name,
  dosage,
  description,
  frequency,
  hour
}) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No hay una sesión iniciada");
  }

  const response = await fetch(`${API_URL}/medications`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify({
      name,
      dosage,
      description,
      frequency,
      hour
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Error al guardar el medicamento"
    );
  }

  return data;
};