const API_URL = "http://TU_IP_LOCAL:3000";

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

  return response.json();
};

export const getMedications = async () => {

  const response = await fetch(
    `${API_URL}/medications`
  );

  return response.json();
};