import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSignupStore } from "../store/minomp_signup";

export default function SelectRoleScreen() {
  const router = useRouter();
  const { setSignupData } = useSignupStore();
  const [selectedRole, setSelectedRole] = useState<"C" | "P" | null>(null);

  const handleNext = () => {
    if (!selectedRole) {
      Alert.alert("Select Role", "Please select your role before continuing");
      return;
    }

    setSignupData({ role: selectedRole });

    // ✅ Redirect to find parent/child screen
    router.push("./FindParentChildScreen");
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>I’m a...</Text>

        {/* Kid */}
        <TouchableOpacity
          style={[
            styles.roleBox,
            selectedRole === "C" && styles.roleBoxSelected,
          ]}
          onPress={() => setSelectedRole("C")}
        >
          <Image
            source={require("../../assets/kid.png")}
            style={styles.roleImage}
            resizeMode="contain"
          />
          <Text style={styles.roleText}>Kid</Text>
        </TouchableOpacity>

        {/* Parent */}
        <TouchableOpacity
          style={[
            styles.roleBox,
            selectedRole === "P" && styles.roleBoxSelected,
          ]}
          onPress={() => setSelectedRole("P")}
        >
          <Image
            source={require("../../assets/parent.png")}
            style={styles.roleImage}
            resizeMode="contain"
          />
          <Text style={styles.roleText}>Parent</Text>
        </TouchableOpacity>

        {/* Next */}
        <TouchableOpacity
          style={[styles.nextButton, !selectedRole && { opacity: 0.6 }]}
          disabled={!selectedRole}
          onPress={handleNext}
        >
          <Text style={styles.nextText}>NEXT</Text>
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
