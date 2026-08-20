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
  if (data.session?.access_token) {
    localStorage.setItem("token", data.session.access_token);
  }

  return data;
};


/* MEDICAMENTOS */

export const createMedication = async ({
  name,
  dosage,
  description,
  frequency,
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
export const createSchedule = async ({
  medication_id,
  hour,
}) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No hay una sesión iniciada");
  }

  const response = await fetch(`${API_URL}/schedules`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify({
      medication_id,
      hour,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Error al guardar el horario"
    );
  }

  return data;
};