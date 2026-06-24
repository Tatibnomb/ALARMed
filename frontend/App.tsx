import React, { useState } from "react";

import {
  View,
  Text,
  Button,
  StyleSheet
} from "react-native";

import { getUsers } from "./src/services/api";
const handleConnection = async () => {
    const result =
    await getUsers();
    
    console.log(result);
    
    postMessage(
        JSON.stringify(result)
    );
};
import { testBackend } from "./src/services/api";

export default function App() {

  const [message, setMessage] =
    useState("");

  const handleConnection = async () => {

    const result =
      await testBackend();

    setMessage(result);
  };

  return (

    <View style={styles.container}>

      <Button
        title="Probar conexión"
        onPress={handleConnection}
      />

      <Text style={styles.text}>
        {message}
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  text: {
    marginTop: 30,
    fontSize: 18
  }

});