const API_URL = "http://192.168.56.1:3000";

// =========================
// LOGIN
// =========================

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

  if (data.session?.access_token) {
    localStorage.setItem("token", data.session.access_token);
  }

  return data;
};


// =========================
// CREAR MEDICAMENTO
// =========================

export const createMedication = async ({
  name,
  dosage,
  description,
  frequency,
  hour,
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
      hour,
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


// =========================
// OBTENER MEDICAMENTOS
// =========================

export const getMedications = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No hay una sesión iniciada");
  }

  const response = await fetch(`${API_URL}/medications`, {
    method: "GET",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Error al obtener los medicamentos"
    );
  }

  return data;
};


// =========================
// EDITAR MEDICAMENTO
// =========================

export const updateMedication = async (
  id,
  {
    name,
    dosage,
    description,
    frequency,
  }
) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No hay una sesión iniciada");
  }

  const response = await fetch(`${API_URL}/medications/${id}`, {
    method: "PUT",

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
      data.message || "Error al editar el medicamento"
    );
  }

  return data;
};


// =========================
// ELIMINAR MEDICAMENTO
// =========================

export const deleteMedication = async (id) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No hay una sesión iniciada");
  }

  const response = await fetch(`${API_URL}/medications/${id}`, {
    method: "DELETE",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Error al eliminar el medicamento"
    );
  }

  return data;
};