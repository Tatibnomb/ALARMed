import {
  View,
  Text,
  Button
} from "react-native";

export default function DashboardScreen() {

  return (

    <View style={{ padding: 40 }}>

      <Text>
        Bienvenido a ALARMed
      </Text>

      <Button
        title="Agregar medicamento"
        onPress={() => {}}
      />

      <Button
        title="Mis medicamentos"
        onPress={() => {}}
      />

      <Button
        title="Historial"
        onPress={() => {}}
      />

    </View>
  );
}