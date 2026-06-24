const API_URL = "http://192.168.56.1:3000";

export const testBackend = async () => {

  const response = await fetch(API_URL);

  return response.text();
};

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

export const getUsers = async () => {
    const response = await fetch(
        `${API_URL}/users`
    );

  return response.json();
};