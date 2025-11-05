import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
import api from "../fetchapi";
import { safeStorage } from "../store/storage";

export default function LoginScreen() {
  const [loginMode, setLoginMode] = useState("email");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [countryCodeList, setCountryCodeList] = useState<
    Array<{ id: string | number; country_code: string }>
  >([]);
  const [countryCodeId, setCountryCodeId] = useState(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCodes = async () => {
      try {
        const res = await api.get("/users/getCountryCode");
        setCountryCodeList(res.data.data);
      } catch (err) {
        console.error("Error fetching country codes", err);
      }
    };
    fetchCodes();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const payload = {
        email: loginMode === "email" ? email : "",
        password,
        mobileno: loginMode === "mobile" ? mobile : "",
        country_code_id: loginMode === "mobile" ? countryCodeId : null,
      };

      const res = await api.post("/users/login", payload);
      const token = res.data?.token;

      if (token) {
        safeStorage.set("token", token);
        alert("Login successful!");
        router.replace("/");
      } else {
        alert("Something went wrong!");
      }
    } catch (error) {
      alert("Login failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/minompback.png")}
      resizeMode="cover"
      style={styles.bg}
      imageStyle={{ opacity: 0.06 }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.title}>LogIn</Text>

            {/* Toggle */}
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  loginMode === "mobile" && styles.activeToggle,
                ]}
                onPress={() => setLoginMode("mobile")}
              >
                <Text
                  style={[
                    styles.toggleText,
                    loginMode === "mobile" && styles.activeText,
                  ]}
                >
                  Mobile
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  loginMode === "email" && styles.activeToggle,
                ]}
                onPress={() => setLoginMode("email")}
              >
                <Text
                  style={[
                    styles.toggleText,
                    loginMode === "email" && styles.activeText,
                  ]}
                >
                  Email
                </Text>
              </TouchableOpacity>
            </View>

            {/* Email / Mobile Input */}
            {loginMode === "email" ? (
              <TextInput
                placeholder="Email"
                placeholderTextColor="#ccc"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
              />
            ) : (
              <View style={styles.row}>
                <DropDownPicker
                  open={pickerOpen}
                  value={countryCodeId}
                  items={countryCodeList.map((c) => ({
                    label: `${c.country_code}`,
                    value: c.id,
                  }))}
                  setOpen={setPickerOpen}
                  setValue={setCountryCodeId}
                  setItems={setCountryCodeList}
                  placeholder="+91"
                  containerStyle={{ width: 80 }}
                  style={{ backgroundColor: "#b9a7f7" }}
                />

                <TextInput
                  placeholder="Mobile"
                  keyboardType="phone-pad"
                  placeholderTextColor="#ccc"
                  value={mobile}
                  onChangeText={setMobile}
                  style={[styles.input, { flex: 1, marginLeft: 6 }]}
                />
              </View>
            )}

            {/* Password */}
            <TextInput
              placeholder="Password"
              secureTextEntry
              placeholderTextColor="#ccc"
              value={password}
              onChangeText={setPassword}
              style={styles.input}
            />

            <TouchableOpacity>
              <Text style={styles.forgotText}>Forgot Password ?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginText}>LOGIN</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.signupText}>
              Don’t have an account?{" "}
              <Text
                style={styles.signupLink}
                onPress={() => router.push("./signup")}
              >
                SignUp
              </Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  card: {
    width: "90%",
    backgroundColor: "#8B6FF0",
    padding: 40,
    borderRadius: 28,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginBottom: 18,
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#a992f3",
    borderRadius: 25,
    marginBottom: 18,
    alignSelf: "center",
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 28,
    borderRadius: 25,
  },
  toggleText: { color: "#fff", fontWeight: "600" },
  activeToggle: { backgroundColor: "#4EE1C1" },
  activeText: { color: "#333" },
  input: {
    backgroundColor: "#b9a7f7",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: "#fff",
    marginBottom: 14,
  },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  forgotText: {
    textAlign: "right",
    color: "#eee",
    fontSize: 12,
    marginBottom: 14,
  },
  loginButton: {
    backgroundColor: "#4EE1C1",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  loginText: { color: "#333", fontWeight: "bold" },
  signupText: { textAlign: "center", color: "#fff" },
  signupLink: { color: "#4EE1C1", fontWeight: "bold" },
});
