import Loader from "@/components/Loader";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router"; // If you're storing user token somewhere, import it from context or async storage
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import api from "./fetchapi";
import { safeStorage } from "./store/storage";

const NotificationPage = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const router = useRouter();

  const token = safeStorage.getString("fcmToken") || "";
  //   console.log("Token in Notification Page", token);

  const sendNotification = useMutation({
    mutationFn: async () => {
      const payload = {
        token,
        title,
        body,
      };
      const res = await api.post("/notifications/send", payload);
      return res.data;
    },
    onSuccess: (data) => {
      console.log("Response:", data);
      //   Alert.alert("Success", "Notification sent successfully!");
      setTitle("");
      setBody("");
    },
    onError: (error: any) => {
      console.error("Create user error:", error);
      Alert.alert("Error", "Something went wrong ");
    },
  });

  const handleSendNoti = () => {
    if (!title || !body) {
      Alert.alert("Validation", "Please enter both title and message");
      return;
    }
    sendNotification.mutate();
  };

  if (sendNotification.isPending) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Loader />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="arrow-back" size={24} color="#4cd137" />
      </TouchableOpacity>
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

      <TouchableOpacity style={styles.button} onPress={handleSendNoti}>
        <Text style={[styles.buttonText]}>Send Notification</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NotificationPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    // justifyContent: "center",
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
  button: {
    width: "100%",
    backgroundColor: "#4cd137",
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "uppercase",
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    // position: "absolute",
    marginTop: 40,
    // flex:1
    // top: 40,
    // left: 20,
    // zIndex: 10,
  },
});
