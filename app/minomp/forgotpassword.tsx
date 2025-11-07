import { useRouter } from "expo-router";
import React, { useState } from "react";
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
import DropDownPicker from "react-native-dropdown-picker";

export default function ForgotPasswordScreen() {
  const [forgotType, setForgotType] = useState<"mobile" | "email">("mobile");
  const [open, setOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState<number | null>(null);
  const router = useRouter();
  // Dummy country codes (replace with API data)
  const countryCodes = [
    { label: "+91", value: 1 },
    { label: "+1", value: 2 },
    { label: "+44", value: 3 },
  ];

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
            source={require("../../assets/forgot password.png")} // export text like signup image
            style={styles.titleImage}
            resizeMode="contain"
          />

          {/* Toggle */}
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

          {/* Input Section */}
          {forgotType === "mobile" ? (
            <View style={styles.row}>
              <View style={{ width: 80 }}>
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
                  style={styles.codePicker}
                  dropDownContainerStyle={styles.codeDropdown}
                  listItemLabelStyle={{ color: "#fff" }}
                  zIndex={2000}
                />
              </View>
              <TextInput
                style={[styles.input, { flex: 1, marginLeft: 8 }]}
                placeholder="Mobile"
                placeholderTextColor="#fff"
                keyboardType="numeric"
              />
            </View>
          ) : (
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#fff"
              keyboardType="email-address"
            />
          )}

          {/* Send Button */}
          <TouchableOpacity
            style={styles.sendButton}
            onPress={() => router.push("./OtpVerificationScreen")}
          >
            <Text style={styles.sendText}>SEND</Text>
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
    width: 210,
    height: 44,
    alignSelf: "center",
    marginBottom: 18,
  },

  // --- Toggle ---
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

  // --- Input Field ---
  row: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: 5,
  },

  input: {
    width: 257,
    height: 41,
    backgroundColor: "#FFFFFF66",
    borderBottomWidth: 1,
    borderBottomColor: "#4D4264",
    borderRadius: 7,
    color: "#fff",
    paddingHorizontal: 12,
    fontFamily: "Fredoka_400Regular",
    fontSize: 14,
  },

  codePicker: {
    width: 80,
    height: 41,
    backgroundColor: "#C08FFF",
    borderColor: "#C08FFF",
    borderRadius: 10,
    justifyContent: "center",
    paddingLeft: 8,
  },

  codeDropdown: {
    backgroundColor: "#C08FFF",
    borderColor: "#C08FFF",
    borderRadius: 10,
    zIndex: 2000,
  },

  // --- Send Button ---
  sendButton: {
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

  sendText: {
    color: "#6C5B8F",
    fontFamily: "Fredoka_700Bold",
    fontSize: 16,
    letterSpacing: 1,
  },
});
