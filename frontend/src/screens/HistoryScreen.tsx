import {
  useEffect,
  useState
} from "react";

import {
  View,
  Text
} from "react-native";

import {
  getIntakes
} from "../services/api";

interface Intake {
  id: string;
  taken: boolean;
}

export default function HistoryScreen() {

  const [history,
    setHistory] =
    useState<Intake[]>([]);

  useEffect(() => {

    loadHistory();

  }, []);

  const loadHistory =
    async () => {

      const data =
        await getIntakes();

      setHistory(data);
    };

  return (

    <View style={{ padding: 40 }}>

      {history.map((item) => (

        <Text key={item.id}>

          Taken:
          {item.taken
            ? " Sí"
            : " No"}

        </Text>

      ))}

    </View>
  );
}