const API_URL = "http://localhost:3000";

// =========================
// LOGIN
// =========================
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al intentar iniciar sesión.");
    }

    if (data.session?.access_token) {
      localStorage.setItem("token", data.session.access_token);
    }

    return data;
  } catch (error) {
    console.error("Error en loginUser:", error);
    throw error;
  }
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
    throw new Error("No hay una sesión iniciada. Por favor, iniciá sesión de nuevo.");
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
      description: description || "",
      frequency,
      hour,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Respuesta de error del servidor:", errorText);
    try {
      const errorJson = JSON.parse(errorText);
      throw new Error(errorJson.message || "Error al guardar el medicamento.");
    } catch (e) {
      throw new Error(`Error en el servidor (${response.status}). Revisa la consola del backend.`);
    }
  }

  return await response.json();
};

export const getWarnings = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No hay una sesión iniciada");

  const response = await fetch(`${API_URL}/warnings`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message || `Error al obtener advertencias (${response.status})`);
  }

  // Una misma advertencia viene dentro de cada medicamento involucrado: la unificamos.
  const byId = new Map();
  for (const med of data.medications || []) {
    for (const link of med.warning_medications || []) {
      const w = link.warnings;
      if (!w) continue;
      if (!byId.has(w.id)) byId.set(w.id, { ...w, medications: [] });
      byId.get(w.id).medications.push(med.name);
    }
  }

  const order = { urgente: 0, importante: 1, precaucion: 2, info: 3 };
  return [...byId.values()].sort(
    (a, b) => (order[a.severity] ?? 9) - (order[b.severity] ?? 9)
  );
};

export const syncWarnings = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No hay una sesión iniciada");

  const response = await fetch(`${API_URL}/warnings/sync`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message || data?.error || "No se pudo analizar");
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
    throw new Error(data.message || "Error al obtener los medicamentos");
  }

  return data;
};

// =========================
// EDITAR MEDICAMENTO
// =========================
export const updateMedication = async (
  id,
  { name, dosage, description, frequency }
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
    throw new Error(data.message || "Error al editar el medicamento");
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
    throw new Error(data.message || "Error al eliminar el medicamento");
  }

  return data;
};

// =========================
// MARCAR TOMA COMO HECHA
// =========================
export const markDoseTaken = async (medicationId) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No hay una sesión iniciada");
  }

  const response = await fetch(`${API_URL}/intakes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      medication_id: medicationId,
      taken: true,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al registrar la toma");
  }

  return data;
};

// =========================
// TOMAS DE HOY
// =========================
export const getTodayIntakes = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No hay una sesión iniciada");
  }

  const response = await fetch(`${API_URL}/intakes`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json().catch(() => null);
  
  if (!response.ok) {
    throw new Error(data?.message || `Error al obtener las tomas (${response.status})`);
  }

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  return data.filter(
    (intake) =>
      intake.taken === true &&
      intake.taken_at &&
      new Date(intake.taken_at) >= startOfDay
  );
};

// =========================
// EDITAR HORARIO
// =========================
export const updateSchedule = async (id, hour) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No hay una sesión iniciada");
  }

  const response = await fetch(`${API_URL}/schedules/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ hour }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || `Error al editar el horario (${response.status})`);
  }

  return data;
};