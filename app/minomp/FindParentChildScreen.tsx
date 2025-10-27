import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../fetchapi";
import { useSignupStore } from "../store/minomp_signup";

export default function FindParentChildScreen() {
  const router = useRouter();
  const {
    name,
    email,
    password,
    mobileno,
    country_code_id,
    role,
    signupType,
    resetSignupData,
  } = useSignupStore();

  const [searchText, setSearchText] = useState("");
  const [foundUser, setFoundUser] = useState<any>(null);

  const showAlert = (title: string, message: string) => {
    Alert.alert(title, message);
  };

  const findUserMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: "",
        email: searchText.includes("@") ? searchText : "",
        mobileno: /^\d+$/.test(searchText) ? searchText : "",
        role: role === "C" ? "P" : "C",
      };
      const res = await api.post("/users/find_parent_child", payload);
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.resp_code === "000" && data?.data?.length) {
        setFoundUser(data.data[0]);
      } else {
        setFoundUser(null);
        showAlert("Not Found", "No user found for the given details.");
      }
    },
    onError: (error: any) => {
      console.error("Find user error:", error);
      showAlert("Error", "Something went wrong while searching.");
    },
  });

  const createUserMutation = useMutation({
    mutationFn: async (connectionid: string) => {
      const payload = {
        name,
        email: signupType === "email" ? email : "",
        password,
        mobileno: signupType === "mobile" ? mobileno : "",
        country_code_id: signupType === "mobile" ? Number(country_code_id) : 0,
        role,
        connectionid,
      };
      console.log("Final createUser payload:", payload);
      const res = await api.post("/users/createUser", payload);
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.resp_code === "000") {
        showAlert("Success", "Account created successfully!");
        resetSignupData();
        router.replace("/");
      } else {
        showAlert("Error", data?.resp_message || "Signup failed");
      }
    },
    onError: (error: any) => {
      console.error("Create user error:", error);
      showAlert("Error", "Something went wrong while creating account.");
    },
  });

  const handleSearch = () => {
    if (!searchText.trim()) {
      showAlert("Enter Details", "Please enter name, email, or mobile.");
      return;
    }
    findUserMutation.mutate();
  };

  // 🔹 Handle user creation
  const handleCreateUser = (connectionid: string) => {
    createUserMutation.mutate(connectionid);
  };

  const isLoading = findUserMutation.isPending || createUserMutation.isPending;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {role === "C" ? "FIND PARENT" : "FIND CHILD"}
      </Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter name, email, or mobile"
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearch}
          disabled={isLoading}
        >
          <Text style={styles.searchText}>
            {findUserMutation.isPending ? "Searching..." : "Search"}
          </Text>
        </TouchableOpacity>
      </View>

      {foundUser && (
        <View style={styles.resultCard}>
          <Text style={styles.resultName}>{foundUser.username}</Text>
          <Text style={styles.resultContact}>{foundUser.contact}</Text>
        </View>
      )}

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.skipButton, isLoading && { opacity: 0.6 }]}
          onPress={() => handleCreateUser("")}
          disabled={isLoading}
        >
          <Text style={styles.skipText}>SKIP</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.connectButton,
            (!foundUser || isLoading) && { opacity: 0.6 },
          ]}
          onPress={() => handleCreateUser(foundUser?.id.toString())}
          disabled={!foundUser || isLoading}
        >
          <Text style={styles.connectText}>
            CONNECT WITH {role === "C" ? "PARENT" : "CHILD"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 80,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#3C246E",
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "85%",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    color: "#333",
  },
  searchButton: {
    backgroundColor: "#00EAD3",
    marginLeft: 10,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  searchText: { color: "#fff", fontWeight: "bold" },
  resultCard: {
    width: "85%",
    backgroundColor: "#E9D6FF",
    borderRadius: 10,
    padding: 15,
    borderWidth: 2,
    borderColor: "#00EAD3",
    marginBottom: 20,
  },
  resultName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3C246E",
  },
  resultContact: {
    fontSize: 14,
    color: "#3C246E",
    marginTop: 5,
  },
  buttonRow: {
    flexDirection: "row",
    width: "85%",
    justifyContent: "space-between",
  },
  skipButton: {
    backgroundColor: "#E9D6FF",
    borderRadius: 8,
    paddingVertical: 12,
    flex: 0.45,
    alignItems: "center",
  },
  connectButton: {
    backgroundColor: "#00EAD3",
    borderRadius: 8,
    paddingVertical: 12,
    flex: 0.5,
    alignItems: "center",
  },
  skipText: { color: "#3C246E", fontWeight: "bold" },
  connectText: { color: "#fff", fontWeight: "bold" },
});
