import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ImageBackground,
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
    router.push("./FindParentChildScreen");
  };

  return (
    <ImageBackground
      source={require("../../assets/minompback.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
      imageStyle={{ opacity: 0.06 }}
    >
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>I'm a...</Text>

          {/* Kid */}
          <TouchableOpacity
            style={styles.roleBox}
            onPress={() => setSelectedRole("C")}
          >
            <View
              style={[
                styles.imageWrapper,
                selectedRole === "C" && styles.imageWrapperSelected,
              ]}
            >
              <Image
                source={require("../../assets/kid.png")}
                style={styles.roleImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.roleText}>Kid</Text>
          </TouchableOpacity>

          {/* Parent */}
          <TouchableOpacity
            style={styles.roleBox}
            onPress={() => setSelectedRole("P")}
          >
            <View
              style={[
                styles.imageWrapper,
                selectedRole === "P" && styles.imageWrapperSelected,
              ]}
            >
              <Image
                source={require("../../assets/parent.png")}
                style={styles.roleImage}
                resizeMode="contain"
              />
            </View>
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
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    width: "85%",
    backgroundColor: "#A15CFF",
    borderRadius: 25,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },

  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },

  roleBox: {
    width: "85%",
    backgroundColor: "#A15CFF",
    borderRadius: 18,
    paddingVertical: 15,
    marginBottom: 18,
    alignItems: "center",
  },

  // ✅ White background for the image + border on selection
  imageWrapper: {
    width: 270,
    height: 135,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 0, // default
  },

  // ✅ Highlight when selected
  imageWrapperSelected: {
    borderWidth: 5,
    borderColor: "#00EAD3",
  },

  roleImage: {
    width: "90%",
    height: "90%",
  },

  roleText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 8,
  },

  nextButton: {
    backgroundColor: "#00EAD3",
    width: "60%",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 6,
  },

  nextText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
