import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import api from "./fetchapi";
import { safeStorage } from "./store/storage";
// If you're storing user token somewhere, import it from context or async storage
// import { useUser } from "../store/UserContext";

const NotificationPage = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  // Temporary hardcoded token (replace or fetch dynamically)
  const token = safeStorage.getString("fcmToken") || "";
  //   console.log("Token in Notification Page", token);

  const sendNotification = useMutation({
    mutationFn: async () => {
      const payload = {
        token,
        title,
        body,
      };
      console.log("Final Notification payload:", payload);
      const res = await api.post("/notifications/send", payload);
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.resp_code === "000") {
        console.log("Notification Sent!!!");
      } else {
        Alert.alert("Error", data?.resp_message || "Something wend wrong");
      }
    },
    onError: (error: any) => {
      console.error("Create user error:", error);
      Alert.alert("Error", "Something went wrong ");
    },
  });

  const handleSendNoti = () => {
    sendNotification.mutate();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Send Push Notification</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, styles.messageInput]}
        placeholder="Enter message"
        value={body}
        onChangeText={setBody}
        multiline
      />

      <Button
        title={loading ? "Sending..." : "Send Notification"}
        onPress={handleSendNoti}
        disabled={loading}
      />
    </View>
  );
};

export default NotificationPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  messageInput: {
    height: 100,
    textAlignVertical: "top",
  },
});
