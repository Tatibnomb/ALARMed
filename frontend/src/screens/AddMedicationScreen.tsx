import { useState } from "react";

import {
  View,
  TextInput,
  Button
} from "react-native";

import {
  createMedication
} from "../services/api";

export default function AddMedicationScreen() {

  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState("");

  const handleCreate = async () => {

    const data = await createMedication({
      name,
      dosage,
      description,
      frequency
    });

    console.log(data);

    setName("");
    setDosage("");
    setDescription("");
    setFrequency("");
  };

  return (
    <View style={{ padding: 40 }}>

      <TextInput
        placeholder="Medicamento"
        value={name}
        onChangeText={setName}
        style={{
          borderWidth: 1,
          marginBottom: 20
        }}
      />

      <TextInput
        placeholder="Dosis"
        value={dosage}
        onChangeText={setDosage}
        style={{
          borderWidth: 1,
          marginBottom: 20
        }}
      />

      <TextInput
        placeholder="Descripción"
        value={description}
        onChangeText={setDescription}
        style={{
          borderWidth: 1,
          marginBottom: 20
        }}
      />

      <TextInput
        placeholder="Frecuencia"
        value={frequency}
        onChangeText={setFrequency}
        style={{
          borderWidth: 1,
          marginBottom: 20
        }}
      />

      <Button
        title="Guardar"
        onPress={handleCreate}
      />

    </View>
  );
}