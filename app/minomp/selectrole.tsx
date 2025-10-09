import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SelectRoleScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedRole, setSelectedRole] = useState<"C" | "P" | null>(null);
  const [loading, setLoading] = useState(false);

  console.log(params);
  const handleSignup = async (values: any) => {
    try {
      setLoading(true);
      console.log("values to API", values);

      const payload = {
        name: values.name,
        email: values.signupType === "email" ? values.email : "",
        password: values.password,
        mobileno: values.signupType === "mobile" ? values.mobileno : "",
        country_code_id:
          values.signupType === "mobile" ? Number(values.selectedCode) || 0 : 0,
        role: values.role,
        connectionid: "2",
      };

      const response = await axios.post(
        "http://192.168.29.138:3367/users/createUser",
        payload
      );

      const { resp_code, message, token, userId, role } = response.data;

      if (resp_code === "000") {
        Alert.alert("Success", message || "User created successfully!", [
          {
            text: "OK",
            onPress: () => {
              router.replace("/login");
            },
          },
        ]);
      } else {
        Alert.alert("Error", message || "Signup failed, please try again.");
      }
    } catch (error: any) {
      console.error("Signup Error:", error);
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Something went wrong!"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if (!selectedRole) {
      Alert.alert("Select Role", "Please select your role before continuing");
      router.push("/");
    }

    const valuess = {
      name: params.name,
      email: params.email,
      password: params.password,
      mobileno: params.mobileno,
      country_code_id: params.country_code_id,
      selectedCode: params.selectedCode,
      signupType: params.signupType,
      role: selectedRole,
    };

    await handleSignup(valuess);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>I’m a...</Text>

        {/* Kid Section */}
        <TouchableOpacity
          style={[
            styles.roleBox,
            selectedRole === "C" && styles.roleBoxSelected,
          ]}
          onPress={() => setSelectedRole("C")}
          activeOpacity={0.8}
        >
          <Image
            source={require("../../assets/kid.png")}
            style={styles.roleImage}
            resizeMode="contain"
          />
          <Text style={styles.roleText}>Kid</Text>
        </TouchableOpacity>

        {/* Parent Section */}
        <TouchableOpacity
          style={[
            styles.roleBox,
            selectedRole === "P" && styles.roleBoxSelected,
          ]}
          onPress={() => setSelectedRole("P")}
          activeOpacity={0.8}
        >
          <Image
            source={require("../../assets/parent.png")}
            style={styles.roleImage}
            resizeMode="contain"
          />
          <Text style={styles.roleText}>Parent</Text>
        </TouchableOpacity>

        {/* Next Button */}
        <TouchableOpacity
          style={[styles.nextButton, !selectedRole && { opacity: 0.6 }]}
          disabled={!selectedRole || loading}
          onPress={handleNext}
        >
          <Text style={styles.nextText}>
            {loading ? "Creating Account..." : "NEXT"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ✅ Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "85%",
    backgroundColor: "#A15CFF",
    borderRadius: 25,
    paddingVertical: 30,
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
  },
  roleBox: {
    width: "80%",
    backgroundColor: "#C08FFF",
    borderRadius: 15,
    marginBottom: 20,
    padding: 15,
    alignItems: "center",
    borderWidth: 3,
    borderColor: "transparent",
  },
  roleBoxSelected: {
    borderColor: "#00EAD3",
    backgroundColor: "#B07EFF",
  },
  roleImage: { width: 120, height: 70, marginBottom: 10 },
  roleText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  nextButton: {
    backgroundColor: "#00EAD3",
    width: "60%",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  nextText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
