import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function OtpVerificationScreen() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(59);
  const inputs = useRef<TextInput[]>([]);

  // ✅ Fixed countdown timer typing
  useEffect(() => {
    let countdown: ReturnType<typeof setInterval> | undefined;

    if (timer > 0) {
      countdown = setInterval(() => setTimer((t) => t - 1), 1000);
    }

    return () => {
      if (countdown) clearInterval(countdown);
    };
  }, [timer]);

  // Handle OTP input focus movement
  const handleChange = (text: string, index: number) => {
    if (text.length > 1) text = text.charAt(text.length - 1);
    const updatedOtp = [...otp];
    updatedOtp[index] = text;
    setOtp(updatedOtp);

    if (text && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/minompback.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
      imageStyle={{ opacity: 0.06 }}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.card}>
          <Image
            source={require("../../assets/OTP Verification.png")} // your title image
            style={styles.titleImage}
            resizeMode="contain"
          />

          {/* OTP Boxes */}
          <View style={styles.otpContainer}>
            {otp.map((value, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  if (ref) inputs.current[index] = ref;
                }} // ✅ fixed callback type
                style={styles.otpBox}
                keyboardType="numeric"
                maxLength={1}
                value={value}
                onChangeText={(text) => handleChange(text, index)}
                returnKeyType="next"
              />
            ))}
          </View>

          {/* Resend Timer */}
          <Text style={styles.resendText}>
            Resend Code{" "}
            {timer > 0 ? `0:${timer.toString().padStart(2, "0")}` : ""}
          </Text>

          {/* Verify Button */}
          <TouchableOpacity style={styles.verifyButton}>
            <Text style={styles.verifyText}>VERIFY</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    width: 230,
    height: 44,
    alignSelf: "center",
    marginBottom: 25,
  },

  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 20,
  },

  otpBox: {
    width: 55,
    height: 55,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    textAlign: "center",
    fontSize: 22,
    color: "#6C5B8F",
    fontFamily: "Fredoka_700Bold",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },

  resendText: {
    color: "#fff",
    fontFamily: "Fredoka_400Regular",
    fontSize: 13,
    marginTop: 10,
    marginBottom: 18,
  },

  verifyButton: {
    width: 146,
    height: 43,
    backgroundColor: "#00EAD3",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },

  verifyText: {
    color: "#6C5B8F",
    fontFamily: "Fredoka_700Bold",
    fontSize: 16,
    letterSpacing: 1,
  },
});
