import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
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
import Toast from "react-native-root-toast";
import api from "../fetchapi";

export default function OtpVerificationScreen() {
  const { userid, payloadResend } = useLocalSearchParams(); // ✅ get userid & resend payload
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(59);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputs = useRef<TextInput[]>([]);
  const router = useRouter();

  // ✅ Countdown Timer
  useEffect(() => {
    if (timer <= 0) return;
    const countdown = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(countdown);
  }, [timer]);

  // ✅ Handle OTP Input Change
  const handleChange = (text: string, index: number) => {
    const updatedOtp = [...otp];
    updatedOtp[index] = text.slice(-1);
    setOtp(updatedOtp);
    if (text && index < otp.length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  // ✅ Handle Backspace
  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && otp[index] === "") {
      if (index > 0) {
        inputs.current[index - 1]?.focus();
        const updatedOtp = [...otp];
        updatedOtp[index - 1] = "";
        setOtp(updatedOtp);
      }
    }
  };

  // ✅ Verify OTP
  const handleVerify = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 4) {
      Toast.show("Please enter the 4-digit OTP", {
        duration: Toast.durations.SHORT,
        backgroundColor: "#FF6B6B",
      });
      return;
    }

    if (!userid) {
      Toast.show("Missing user ID. Please try again.", {
        duration: Toast.durations.SHORT,
        backgroundColor: "#FF6B6B",
      });
      return;
    }

    try {
      setIsVerifying(true);
      const payload = { userid: Number(userid), otp: otpCode };
      const res = await api.post("/authantication/verify_otp", payload);
      const data = res.data;

      if (data?.resp_code === "000") {
        Toast.show("OTP verified successfully!", {
          duration: Toast.durations.SHORT,
          backgroundColor: "#00EAD3",
          textColor: "#6C5B8F",
        });

        router.push({
          pathname: "./ResetPasswordScreen",
          params: { userid },
        });
      } else {
        Toast.show(data?.resp_message || "Invalid OTP", {
          duration: Toast.durations.SHORT,
          backgroundColor: "#FF6B6B",
        });
      }
    } catch (error) {
      console.error("Verify OTP Error:", error);
      Toast.show("Something went wrong. Try again.", {
        duration: Toast.durations.SHORT,
        backgroundColor: "#FF6B6B",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // ✅ Handle Resend OTP
  const handleResend = async () => {
    if (isResending) return;
    try {
      setIsResending(true);
      const parsedPayload =
        typeof payloadResend === "string"
          ? JSON.parse(payloadResend)
          : payloadResend;
      let resentdpayload: any = {};
      if (parsedPayload?.email) {
        resentdpayload.email = parsedPayload.email;
      } else if (parsedPayload?.mobileno) {
        resentdpayload.mobileno = parsedPayload.mobileno;
        resentdpayload.country_code_id =
          Number(parsedPayload.country_code_id) || null;
      }
      const res = await api.post("/authantication/send_otp", resentdpayload);
      const data = res.data;

      if (data?.resp_code === "000") {
        Toast.show("OTP resent successfully!", {
          duration: Toast.durations.SHORT,
          backgroundColor: "#00EAD3",
          textColor: "#6C5B8F",
        });
        setOtp(["", "", "", ""]);
        setTimer(59);
        inputs.current[0]?.focus();
      } else if (data?.resp_code === "429") {
        Toast.show("Resend limit exceeded. Please try again later.", {
          duration: Toast.durations.LONG,
          backgroundColor: "#FF6B6B",
        });
      } else {
        Toast.show(data?.resp_message || "Failed to resend OTP", {
          duration: Toast.durations.SHORT,
          backgroundColor: "#FF6B6B",
        });
      }
    } catch (error: any) {
      console.error("Resend OTP Error:", error);
      if (error?.response?.status === 429) {
        Toast.show("Resend OTP limit exceeded.", {
          duration: Toast.durations.SHORT,
          backgroundColor: "#FF6B6B",
        });
      } else {
        Toast.show("Something went wrong. Try again.", {
          duration: Toast.durations.SHORT,
          backgroundColor: "#FF6B6B",
        });
      }
    } finally {
      setIsResending(false);
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
            source={require("../../assets/OTP Verification.png")}
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
                }}
                style={styles.otpBox}
                keyboardType="numeric"
                maxLength={1}
                value={value}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                returnKeyType="next"
              />
            ))}
          </View>

          {/* Resend Timer / Button */}
          <View style={styles.resendContainer}>
            {timer > 0 ? (
              <Text style={styles.resendText}>
                Didn’t receive OTP?{" "}
                <Text style={styles.timerText}>
                  0:{timer.toString().padStart(2, "0")}
                </Text>
              </Text>
            ) : (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleResend}
                disabled={isResending}
              >
                {isResending ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.resendLink}>Resend OTP</Text>
                )}
              </TouchableOpacity>
            )}
          </View>

          {/* Verify Button */}
          <TouchableOpacity
            style={[styles.verifyButton, isVerifying && { opacity: 0.7 }]}
            onPress={handleVerify}
            disabled={isVerifying}
          >
            {isVerifying ? (
              <ActivityIndicator color="#6C5B8F" />
            ) : (
              <Text style={styles.verifyText}>VERIFY</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
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
  titleImage: { width: 230, height: 44, marginBottom: 25 },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "80%",
    marginBottom: 20,
    gap: 20,
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

  resendButton: {
    marginTop: 10,
    marginBottom: 18,
  },

  resendContainer: {
    marginTop: 10,
    marginBottom: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  resendText: {
    color: "#fff",
    fontFamily: "Fredoka_400Regular",
    fontSize: 13,
  },
  timerText: {
    color: "#00EAD3",
    fontFamily: "Fredoka_500Medium",
  },
  resendLink: {
    color: "#00EAD3",
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 15,
    textDecorationLine: "underline",
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
