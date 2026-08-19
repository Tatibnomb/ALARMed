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

/* GET MEDICATIONS */

export const getMedications =
  async () => {
    const token = await AsyncStorage.getItem("token");
    const response = await fetch(
      `${API_URL}/medications`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const data = await response.json();

  console.log("Medicamentos:", data);

  return data;
};

/* GET HISTORY */

export const getIntakes =
  async () => {
    const response = await fetch(
      `${API_URL}/intakes`
    );

    return response.json();
};