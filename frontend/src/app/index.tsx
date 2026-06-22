import { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";

import { loginUser } from "../services/api";

export default function LoginScreen() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {

    const data = await loginUser(
      email,
      password
    );

    console.log(data);
  };

  return (
    <View style={{ marginTop: 100, padding: 20 }}>

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
        title="Login"
        onPress={handleLogin}
      />

    </View>
  );
}