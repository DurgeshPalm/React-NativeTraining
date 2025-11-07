import { Ionicons } from "@expo/vector-icons"; // 👈 For checkmark icon
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
          <Image
            source={require("../../assets/I'm a....png")}
            style={styles.signupImage}
            resizeMode="contain"
          />

          {/* Kid Role */}
          <TouchableOpacity
            style={styles.roleBox}
            onPress={() => setSelectedRole("C")}
            activeOpacity={0.8}
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
          </TouchableOpacity>

          {/* Parent Role */}
          <TouchableOpacity
            style={styles.roleBox}
            onPress={() => setSelectedRole("P")}
            activeOpacity={0.8}
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
          </TouchableOpacity>

          {/* Radio Buttons */}
          <View style={styles.radioGroup}>
            {/* Kid Option */}
            <View style={styles.radioOption}>
              <TouchableOpacity
                onPress={() => setSelectedRole("C")}
                activeOpacity={0.8}
                style={[
                  styles.radioCircle,
                  selectedRole === "C" && styles.radioCircleSelected,
                ]}
              >
                {selectedRole === "C" && (
                  <Ionicons name="checkmark" size={14} color="#6C5B8F" />
                )}
              </TouchableOpacity>
              <Text style={styles.roleText}>Kid</Text>
            </View>

            {/* Parent Option */}
            <View style={styles.radioOption}>
              <TouchableOpacity
                onPress={() => setSelectedRole("P")}
                activeOpacity={0.8}
                style={[
                  styles.radioCircle,
                  selectedRole === "P" && styles.radioCircleSelected,
                ]}
              >
                {selectedRole === "P" && (
                  <Ionicons name="checkmark" size={14} color="#6C5B8F" />
                )}
              </TouchableOpacity>
              <Text style={styles.roleText}>Parent</Text>
            </View>
          </View>

          {/* Next Button */}
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
    fontFamily: "Fredoka_700Bold",
    fontSize: 28,
    textAlign: "center",
    marginBottom: 20,
  },

  roleBox: {
    width: "85%",
    alignItems: "center",
    marginBottom: 18,
  },

  imageWrapper: {
    width: 270,
    height: 135,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },

  imageWrapperSelected: {
    borderColor: "#00EAD3",
    borderWidth: 3,
  },

  roleImage: {
    width: "90%",
    height: "90%",
  },

  // Radio group container
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
    marginTop: 10,
    marginBottom: 10,
  },

  radioOption: {
    flexDirection: "column",
    alignItems: "center",
  },

  // Base radio circle
  radioCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },

  // Selected radio circle
  radioCircleSelected: {
    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 3,
  },

  roleText: {
    color: "#FFFFFF",
    fontFamily: "Fredoka_700Bold",
    fontSize: 16,
  },

  nextButton: {
    backgroundColor: "#00EAD3",
    width: 146,
    height: 43,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },

  nextText: {
    color: "#6C5B8F",
    fontFamily: "Fredoka_700Bold",
    fontSize: 16,
    letterSpacing: 1,
  },
  signupImage: {
    width: 140, // same proportion as your uploaded design
    height: 44,
    alignSelf: "center",
    marginBottom: 18, // keep same spacing as previous text
  },
});
