import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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

  // Fetch country codes
  useEffect(() => {
    const fetchCountryCodes = async () => {
      try {
        const res = await api.get("/users/getCountryCode");
        setCountryCodeList(res.data.data);
      } catch (err) {
        console.error("Error fetching country codes", err);
      }
    };
    fetchCountryCodes();
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

      const response = await api.post("/users/login", payload);
      const token = response.data?.token;

      if (token) {
        safeStorage.set("token", token);
        alert("Login successful!");
        router.replace("/");
      } else {
        alert("Something went wrong!!.");
        console.log("response:", response.data);
      }
    } catch (error) {
      console.error(error);
      alert("Login failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Login</Text>

          {/* Toggle buttons */}
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

          {/* Email Input */}
          {loginMode === "email" ? (
            <TextInput
              placeholder="Email"
              style={styles.input}
              placeholderTextColor="#ccc"
              value={email}
              onChangeText={setEmail}
            />
          ) : (
            <View style={styles.row}>
              <View style={styles.countryPicker}>
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
                  placeholder="+Code"
                  containerStyle={{ width: 80 }}
                  style={{ backgroundColor: "#b9a7f7" }}
                />
              </View>
              <TextInput
                placeholder="Mobile"
                style={[styles.input, { flex: 1 }]}
                keyboardType="phone-pad"
                placeholderTextColor="#ccc"
                value={mobile}
                onChangeText={setMobile}
              />
            </View>
          )}

          {/* Password Input */}
          <TextInput
            placeholder="Password"
            secureTextEntry
            style={styles.input}
            placeholderTextColor="#ccc"
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

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
            <TouchableOpacity onPress={() => router.push("./signup")}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 100,
  },
  card: {
    width: "85%",
    backgroundColor: "#8B6FF0",
    padding: 50,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
    backgroundColor: "#a992f3",
    borderRadius: 25,
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  toggleText: {
    color: "#fff",
    fontWeight: "600",
  },
  activeToggle: {
    backgroundColor: "#4EE1C1",
  },
  activeText: {
    color: "#333",
  },
  input: {
    backgroundColor: "#b9a7f7",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: "#fff",
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  countryPicker: {
    width: 80,
    marginRight: 8,
    backgroundColor: "#b9a7f7",
    borderRadius: 10,
    justifyContent: "center",
    paddingLeft: 5,
  },
  forgotText: {
    textAlign: "right",
    color: "#eee",
    fontSize: 12,
    marginBottom: 15,
  },
  loginButton: {
    backgroundColor: "#4EE1C1",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  loginText: {
    color: "#333",
    fontWeight: "bold",
  },
  signupText: {
    textAlign: "center",
    color: "#fff",
  },
  signupLink: {
    color: "#4EE1C1",
    fontWeight: "bold",
  },
});
