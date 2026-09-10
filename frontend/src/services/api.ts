import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://192.168.56.1:3000";

/* LOGIN */

export const loginUser = async (
  email: string,
  password: string
) => {

  const response = await fetch(
    `${API_URL}/auth/login`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        email,
        password
      })
    }
  );

  const data = await response.json();

  console.log("Login:", data);

  if (!response.ok) {
    throw new Error(
      data.message || "Error al iniciar sesión"
    );
  }

  // Guardamos el token de Supabase para usarlo
  // posteriormente en las peticiones protegidas
  if (data.session?.access_token) {

    await AsyncStorage.setItem(
      "token",
      data.session.access_token
    );

  }

  return data;
};


/* REGISTER */

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {

  const response = await fetch(
    `${API_URL}/auth/register`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        name,
        email,
        password
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Error al registrarse"
    );
  }

  return data;
};


/* TYPES */

export interface Medication {
  id?: string;
  name: string;
  dosage: string;
  description: string;
  frequency: string;
}


/* CREATE MEDICATION */

export const createMedication = async (
  medication: Medication
) => {

  // Obtenemos el token del usuario que inició sesión
  const token = await AsyncStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/medications`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },

      body: JSON.stringify(medication)
    }
  );

  console.log("Status:", response.status);

  const data = await response.json();

  console.log("Respuesta:", data);

  if (!response.ok) {
    throw new Error(
      data.message || "Error al crear medicamento"
    );
  }

  return data;
};


/* UPDATE MEDICATION */

export const updateMedication = async (
  id: string,
  medication: Medication
) => {

  const response = await fetch(
    `${API_URL}/medications/${id}`,
    {
      method: "PUT",
      headers: await getAuthHeaders(),
      body: JSON.stringify(medication)
    }
  );

  return response.json();
};


/* DELETE MEDICATION */

export const deleteMedication = async (
  id: string
) => {

  const response = await fetch(
    `${API_URL}/medications/${id}`,
    {
      method: "DELETE",
      headers: await getAuthHeaders()
    }
  );

  return response.json();
};


/* GET MEDICATIONS */

export const getMedications = async () => {

  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/medications`,
    {
      headers
    }
  );

  const data = await response.json();

  console.log("Medicamentos:", data);

  return data;
};


/* GET HISTORY */

export const getIntakes = async () => {

  const response = await fetch(
    `${API_URL}/intakes`
  );

  return response.json();
};


/* AUTH HEADERS */

const getAuthHeaders = async () => {

  // Recuperamos el token guardado al iniciar sesión
  const token = await AsyncStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };
};

/* CREATE SCHEDULE */

export const createSchedule = async (
  schedule: {
    medication_id: string;
    date: string;
    hour: string;
  }
) => {

  const response = await fetch(
    `${API_URL}/schedules`,
    {
      method: "POST",

      headers: await getAuthHeaders(),

      body: JSON.stringify(schedule)
    }
  );


  const data = await response.json();


  if (!response.ok) {

    throw new Error(
      data.message ||
      "Error al guardar el horario"
    );

  }


  console.log(
    "Horario guardado:",
    data
  );


  return data;
};