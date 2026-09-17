const API_BASE_URL = 'http://192.168.56.1:3000/api/warnings';

export async function addMedicationAndSync(userId, medicationData) {
  // 1. Guardar medicamento en Supabase desde el cliente (o tu endpoint habitual)
  const { data, error } = await supabaseClient
    .from('medications')
    .insert([{ ...medicationData, user_id: userId }]);

  if (error) throw error;

  // 2. Disparar recálculo automático de advertencias en Backend Node.js
  await fetch(`${API_BASE_URL}/sync/${userId}`, { method: 'POST' });

  return data;
}

export async function fetchMedicationsWithWarnings(userId) {
  const response = await fetch(`${API_BASE_URL}/user/${userId}`);
  const result = await response.json();
  return result.medications;
}