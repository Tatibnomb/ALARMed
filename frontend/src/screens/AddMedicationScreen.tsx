import { useState } from "react";

import {
  View,
  Text,
  TextInput,
  Button,
  Alert
} from "react-native";

import {
  createMedication,
  createSchedule,
} from "../services/api";

import {
  scheduleMedicationAlarm
} from "../services/notifications";

export default function AddMedicationScreen() {

  // Estados que guardan los datos que escribe el usuario
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState("");

  // Fecha y hora de la toma
  const [date, setDate] = useState("");
  const [hour, setHour] = useState("");

  // Función que se ejecuta cuando se toca "Guardar"
  const handleCreate = async () => {
    try {
      // Verificamos que todos los campos estén completos.
      if (
        !name ||
        !dosage ||
        !frequency ||
        !date ||
        !hour
      ) {
        Alert.alert(
          "Faltan datos",
          "Completá todos los campos."
        );
        return;
      }
    // Enviamos los datos del formulario al backend
    const medication = await createMedication({
      name,
      dosage,
      description,
      frequency
    });

    console.log( "Medicamento guardado:",
      medication
    );
    
    // El backend devuelve un array porque Supabase
    // devuelve los registros creados.
    const medicationData =
    Array.isArray(medication)
    ? medication[0]
    : medication;

    const medicationId = medicationData?.id;
    
    if (!medicationId) {
      throw new Error( "No se recibió el ID del medicamento."
      );
    
    }

    await createSchedule({
      medication_id: medicationId,
      date,
      hour
    });

    const notificationId = await scheduleMedicationAlarm( name, date, hour );
    
    if (!notificationId) {
      Alert.alert( "Medicamento guardado",
        "El medicamento se guardó, pero no se pudo programar la alarma." );
        return;
      }

      Alert.alert( "¡Medicamento guardado!", `Te avisaremos el ${date} a las ${hour}.`
      );

    // Limpiamos el formulario después de guardar
    setName("");
    setDosage("");
    setDescription("");
    setFrequency("");
    setDate("");
    setHour("");
  } catch (error) {
    console.error( "Error al guardar medicamento:",
      error
    );

    Alert.alert(
      "Error",
      "No se pudo guardar el medicamento."
    );
  }
};

  return (
    <View style={{ padding: 40 }}>

      <TextInput
        placeholder="Medicamento"
        value={name}
        onChangeText={setName}
        style={{
          borderWidth: 1,
          marginBottom: 20,
          padding: 10
        }}
      />

      <TextInput
        placeholder="Dosis"
        value={dosage}
        onChangeText={setDosage}
        style={{
          borderWidth: 1,
          marginBottom: 20,
          padding: 10
        }}
      />

      <TextInput
        placeholder="Descripción"
        value={description}
        onChangeText={setDescription}
        style={{
          borderWidth: 1,
          marginBottom: 20,
          padding: 10
        }}
      />

      <TextInput
        placeholder="Frecuencia"
        value={frequency}
        onChangeText={setFrequency}
        style={{
          borderWidth: 1,
          marginBottom: 20,
          padding: 10
        }}
      />

      <Text>
        Fecha de la toma
      </Text>
      
      <TextInput
      placeholder="AAAA-MM-DD"
      value={date}
      onChangeText={setDate}
      keyboardType="numbers-and-punctuation"
      style={{
        borderWidth: 1,
        marginBottom: 20,
        padding: 10
        }}
      />
        
      <Text>
        Hora de la toma
      </Text>
      
      <TextInput
      placeholder="HH:MM"
      value={hour}
      onChangeText={setHour}
      keyboardType="numbers-and-punctuation"
      style={{
        borderWidth: 1,
        marginBottom: 20,
        padding: 10
      }}
    />

      <Button
        title="Guardar medicamento"
        onPress={handleCreate}
      />

    </View>
  );
}