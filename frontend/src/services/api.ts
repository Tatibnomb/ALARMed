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

  return response.json();
};

/* REGISTER */

export const registerUser = async (
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
        email,
        password
      })
    }
  );

  return response.json();
};

/* TYPES */

export interface Medication {
  user_id: string;
  name: string;
  description: string;
}

/* CREATE MEDICATION */

export const createMedication = async (
  medication: Medication
) => {
  const response = await fetch(
    `${API_URL}/medications`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(medication)
    }
  );

  return response.json();
};

/* GET MEDICATIONS */

export const getMedications =
  async () => {
    const response = await fetch(
      `${API_URL}/medications`
    );

    return response.json();
};

/* GET HISTORY */

export const getIntakes =
  async () => {
    const response = await fetch(
      `${API_URL}/intakes`
    );

    return response.json();
};