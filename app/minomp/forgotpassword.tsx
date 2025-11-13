import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useState } from "react";
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
import DropDownPicker from "react-native-dropdown-picker";
import Toast from "react-native-root-toast";
import api from "../fetchapi"; // ✅ Your configured Axios instance

export default function ForgotPasswordScreen() {
  const [forgotType, setForgotType] = useState<"mobile" | "email">("mobile");
  const [open, setOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [mobileno, setMobileno] = useState("");
  const router = useRouter();

  // ✅ Fetch country codes from backend
  const { data: countryCodes = [], isLoading: isLoadingCodes } = useQuery({
    queryKey: ["countryCodes"],
    queryFn: async () => {
      const res = await api.get("/users/getCountryCode");
      return res.data?.data || [];
    },
    select: (response) =>
      response.map((item: any) => ({
        label: `${item.country_code}`,
        value: item.id,
      })),
  });

  // ✅ Forgot Password API
  const payload = {
    email: forgotType === "email" ? email : "",
    mobileno: forgotType === "mobile" ? mobileno : "",
    country_code_id: forgotType === "mobile" ? Number(selectedCode) || "" : "",
  };
  const forgotMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post("/authantication/forgot_passcode", payload);
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.resp_code === "000") {
        Toast.show("OTP sent successfully!", {
          duration: Toast.durations.SHORT,
          backgroundColor: "#00EAD3",
          textColor: "#6C5B8F",
        });

        // ✅ Redirect to OTP Verification screen with userid + otp
        router.push({
          pathname: "./OtpVerificationScreen",
          params: {
            userid: data.userid,
            otp: data.otp,
            payloadResend: JSON.stringify(payload),
          },
        });
      } else {
        Toast.show(data?.resp_message || "Something went wrong", {
          duration: Toast.durations.SHORT,
          backgroundColor: "#FF6B6B",
        });
      }
    },
    onError: (err: any) => {
      console.error("Forgot Password Error:", err);
      Toast.show("Something went wrong. Try again.", {
        duration: Toast.durations.SHORT,
        backgroundColor: "#FF6B6B",
      });
    },
  });

  const handleSend = () => {
    if (forgotType === "email" && !email.trim()) {
      Toast.show("Please enter your email address", {
        duration: Toast.durations.SHORT,
        backgroundColor: "#FF6B6B",
      });
      return;
    }

    if (forgotType === "mobile" && !mobileno.trim()) {
      Toast.show("Please enter your mobile number", {
        duration: Toast.durations.SHORT,
        backgroundColor: "#FF6B6B",
      });
      return;
    }

    forgotMutation.mutate();
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
            source={require("../../assets/forgot password.png")}
            style={styles.titleImage}
            resizeMode="contain"
          />

          {/* Toggle (Email / Mobile) */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                forgotType === "mobile" && styles.toggleButtonActive,
              ]}
              onPress={() => setForgotType("mobile")}
            >
              <Text style={styles.toggleText}>Mobile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toggleButton,
                forgotType === "email" && styles.toggleButtonActive,
              ]}
              onPress={() => setForgotType("email")}
            >
              <Text style={styles.toggleText}>Email</Text>
            </TouchableOpacity>
          </View>

          {/* Input Fields */}
          {forgotType === "mobile" ? (
            <View style={styles.row}>
              <View style={{ width: 90, height: 41 }}>
                <DropDownPicker
                  open={open}
                  value={selectedCode}
                  items={countryCodes}
                  setOpen={setOpen}
                  setValue={setSelectedCode}
                  placeholder="+91"
                  placeholderStyle={{
                    color: "#fff",
                    fontWeight: "500",
                  }}
                  labelStyle={{ color: "#fff" }}
                  selectedItemLabelStyle={{ color: "#fff" }}
                  arrowIconStyle={{ width: 14, height: 8 }}
                  ArrowDownIconComponent={() => (
                    <Image
                      source={require("../../assets/dropdownarrow.png")}
                      style={{
                        width: 14,
                        height: 8,
                        tintColor: "#fff",
                      }}
                      resizeMode="contain"
                    />
                  )}
                  style={[styles.codePicker]}
                  dropDownContainerStyle={styles.codeDropdown}
                  listItemLabelStyle={{ color: "#fff" }}
                  zIndex={2000}
                />
              </View>

              <TextInput
                style={[styles.mobileInput, { flex: 1, marginLeft: -15 }]}
                placeholder="Mobile"
                placeholderTextColor="#fff"
                keyboardType="numeric"
                value={mobileno}
                onChangeText={setMobileno}
              />
            </View>
          ) : (
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#fff"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          )}

          {/* Send Button */}
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSend}
            disabled={forgotMutation.isPending}
          >
            {forgotMutation.isPending ? (
              <ActivityIndicator color="#6C5B8F" />
            ) : (
              <Text style={styles.sendText}>SEND</Text>
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
  titleImage: { width: 210, height: 44, marginBottom: 18 },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 45,
    borderWidth: 1,
    borderColor: "#4D4264",
    width: 165,
    height: 36,
    marginBottom: 22,
  },
  toggleButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 45,
  },
  toggleButtonActive: {
    backgroundColor: "#40E0D0",
    borderRadius: 45,
    borderWidth: 1,
    borderColor: "#4D4264",
  },
  toggleText: {
    fontFamily: "Fredoka_500Medium",
    fontSize: 16,
    color: "#6C5B8F",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    // width: "100%",
    marginVertical: 6,
    width: 257,
    height: 41,
  },
  input: {
    width: 257,
    height: 41,
    backgroundColor: "#FFFFFF66", // 40% opacity white (#FFFFFF66)
    borderBottomWidth: 1,
    borderBottomColor: "#4D4264",
    borderRadius: 7,
    color: "#fff",
    paddingHorizontal: 12,
    marginVertical: 6,
    fontFamily: "Fredoka_400Regular", // optional, for design consistency
    fontSize: 14,
  },
  codePicker: {
    backgroundColor: "#C08FFF",
    borderColor: "#C08FFF",
    borderRadius: 10,
    minHeight: 41,
    width: "80%",
    justifyContent: "center",
    paddingLeft: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#4D4264",
  },

  codeDropdown: {
    backgroundColor: "#C08FFF",
    borderColor: "#C08FFF",
    borderRadius: 10,
    width: "80%",
    // zIndex: 2000,
  },

  sendButton: {
    width: 146,
    height: 43,
    backgroundColor: "#00EAD3",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
  },
  sendText: {
    color: "#6C5B8F",
    fontFamily: "Fredoka_700Bold",
    fontSize: 16,
    letterSpacing: 1,
  },

  mobileInput: {
    flex: 1,
    height: 41,
    // width: 400,
    backgroundColor: "#C08FFF",
    borderColor: "#C08FFF",
    borderRadius: 10,
    paddingHorizontal: 12,
    color: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#4D4264",
  },
});
