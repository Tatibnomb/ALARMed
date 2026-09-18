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

    // 1. Convertimos la respuesta en JSON
    const data = await response.json();

    // 2. Validamos si el servidor respondió con un error HTTP
    if (!response.ok) {
      throw new Error(data.message || "Error al intentar iniciar sesión.");
    }

<<<<<<< HEAD
    // 3. Guardamos el token en localStorage si viene en la respuesta
=======
    const data = await response.json();

    // Guardamos el token de Supabase dentro de la función antes de retornar
>>>>>>> parent of c2509e3 (Merge branch 'front')
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
// MEDICAMENTOS
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

  const response = await fetch("http://localhost:3000/medications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Debe coincidir con lo que espera authMiddleware
    },
    body: JSON.stringify({
      name,
      dosage,
      description: description || "",
      frequency,
      hour,
    }),
  });

  // Si el backend da error (ej. 401, 403, 500)
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Respuesta de error del servidor:", errorText);
    
    // Intentamos ver si la respuesta traía un mensaje
    try {
      const errorJson = JSON.parse(errorText);
      throw new Error(errorJson.message || "Error al guardar el medicamento.");
    } catch (e) {
      throw new Error(`Error en el servidor (${response.status}). Revisa la consola del backend.`);
    }
  }

  return await response.json();
};

export const fetchMedicationsWithWarnings = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/api/medications/${userId}`);
    if (!response.ok) {
      throw new Error("Error al obtener los medicamentos");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en fetchMedicationsWithWarnings:", error);
    return [];
  }
};