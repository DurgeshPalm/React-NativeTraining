import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-root-toast";
import api from "../fetchapi";

export default function ResetPasswordScreen() {
  const { userid } = useLocalSearchParams(); // ✅ userid passed from OTP screen
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleReset = async () => {
    if (!password || !confirmPassword) {
      Toast.show("Please fill in both fields", {
        duration: Toast.durations.SHORT,
        backgroundColor: "#FF6B6B",
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show("Passwords do not match", {
        duration: Toast.durations.SHORT,
        backgroundColor: "#FF6B6B",
      });
      return;
    }

    try {
      setIsUpdating(true);
      const payload = {
        userid: Number(userid),
        new_password: password,
      };
      const res = await api.post("/authantication/reset_password", payload);
      const data = res.data;

      if (data?.resp_code === "000") {
        Toast.show("Password updated successfully!", {
          duration: Toast.durations.SHORT,
          backgroundColor: "#00EAD3",
          textColor: "#6C5B8F",
        });

        setTimeout(() => router.push("./loginminomp"), 1000);
      } else {
        Toast.show(data?.resp_message || "Failed to update password", {
          duration: Toast.durations.SHORT,
          backgroundColor: "#FF6B6B",
        });
      }
    } catch (error) {
      console.error("Reset Password Error:", error);
      Toast.show("Something went wrong. Please try again.", {
        duration: Toast.durations.SHORT,
        backgroundColor: "#FF6B6B",
      });
    } finally {
      setIsUpdating(false);
    }
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
            source={require("../../assets/Reset password.png")}
            style={styles.titleImage}
            resizeMode="contain"
          />

          {/* Password Field */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#6C5B8F"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#fff"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#6C5B8F"
              />
            </TouchableOpacity>
          </View>

          {/* Confirm Password Field */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#6C5B8F"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#fff"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#6C5B8F"
              />
            </TouchableOpacity>
          </View>

          {/* Update Button */}
          <TouchableOpacity
            style={[styles.updateButton, isUpdating && { opacity: 0.7 }]}
            onPress={handleReset}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <ActivityIndicator color="#6C5B8F" />
            ) : (
              <Text style={styles.updateText}>UPDATE</Text>
            )}
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
    borderRadius: 24,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  titleImage: {
    width: 250,
    height: 44,
    alignSelf: "center",
    marginBottom: 25,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF66",
    borderBottomWidth: 1,
    borderColor: "#4D4264",
    borderRadius: 7,
    height: 41,
    marginVertical: 10,
    width: "100%",
    paddingHorizontal: 10,
  },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    color: "#fff",
    fontFamily: "Fredoka_400Regular",
    fontSize: 14,
  },
  eyeIcon: { padding: 5 },
  updateButton: {
    width: 146,
    height: 43,
    backgroundColor: "#00EAD3",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  updateText: {
    color: "#6C5B8F",
    fontFamily: "Fredoka_700Bold",
    fontSize: 16,
    letterSpacing: 1,
  },
});
