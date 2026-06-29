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

  const [name, setName] =
    useState<string>("");

  const [description,
    setDescription] =
    useState<string>("");

  const handleCreate =
    async () => {

      const data =
        await createMedication({

          user_id:
            "PEGAR_UUID_USUARIO",

          name,

          description
        });

      console.log(data);
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
        placeholder="Descripción"
        value={description}
        onChangeText={setDescription}
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