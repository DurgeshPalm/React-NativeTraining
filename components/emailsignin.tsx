import {
  getAuth,
  signInWithEmailAndPassword,
} from "@react-native-firebase/auth";
import React, { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { useUser } from "../app/store/UserContext";
import { safeStorage } from "../app/store/storage";
import Loader from "./Loader";

const EmailSignIn = () => {
  const { setUser } = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailSignIn = async () => {
    try {
      setLoading(true);
      setError("");

      const authInstance = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        authInstance,
        email,
        password
      );

      const user = userCredential.user;

      setUser({
        name: user.displayName || "",
        email: user.email,
        prpfilePictureUrl: user.photoURL || "",
      });

      safeStorage.set("name", user.displayName || "");
      safeStorage.set("email", user.email || "");
      safeStorage.set("profilePictureUrl", user.photoURL || "");

      console.log("✅ Signed in with email:", user.email);
    } catch (e: any) {
      console.log("❌ Email Sign-In error:", e.message || e);
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <Loader />
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button title="Sign In with Email" onPress={handleEmailSignIn} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    paddingHorizontal: 20,
    width: "100%",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
});

export default EmailSignIn;
