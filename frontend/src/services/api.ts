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


if(data.session){

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

  return response.json();
};

/* TYPES */

export interface Medication {
  id?: string,
  name: string;
  dosage: string,
  description: string;
  frequency: string;
}

/* CREATE MEDICATION */

export const createMedication = async (
  medication: Medication
) => {
  const response = await fetch(
    `${API_URL}/medications`,
    {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify(medication)
    }
  );

  return response.json();
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

/*DELETE MEDICATION */
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

export const getMedications =
async()=>{


const headers =
await getAuthHeaders();


const response =
await fetch(
`${API_URL}/medications`,
{
headers
}
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

const getAuthHeaders = async()=>{

const token =
await AsyncStorage.getItem("token");


return {
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
};

};