import { useState } from "react";

import {
  View,
  Text,
  TextInput,
  Button
} from "react-native";

import {
  registerUser
} from "../services/api";

export default function RegisterScreen() {

  const [email, setEmail] =
    useState<string>("");

  const [password, setPassword] =
    useState<string>("");

  const handleRegister =
    async () => {

      const data =
        await registerUser(
          email,
          password
        );

      console.log(data);
    };

  return (

    <View style={{ padding: 40 }}>

      <Text>Email</Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        style={{
          borderWidth: 1,
          marginBottom: 20
        }}
      />

      <Text>Password</Text>

      <TextInput
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{
          borderWidth: 1,
          marginBottom: 20
        }}
      />

      <Button
        title="Register"
        onPress={handleRegister}
      />

    </View>
  );
}