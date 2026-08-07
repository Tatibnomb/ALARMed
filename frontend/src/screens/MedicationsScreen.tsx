import {
  useEffect,
  useState
} from "react";

import {
  View,
  Text
} from "react-native";

import {
  getMedications
} from "../services/api";

interface Medication {
  id: string;
  name: string;
}

export default function MedicationsScreen() {

  const [medications,
    setMedications] =
    useState<Medication[]>([]);

  useEffect(() => {

    loadData();

  }, []);

  const loadData =
    async () => {

      const data =
        await getMedications();

      setMedications(data);
    };

  return (

    <View style={{ padding: 40 }}>

      {medications.map((med) => (

        <Text key={med.id}>
          {med.name}
        </Text>

      ))}

    </View>
  );
}