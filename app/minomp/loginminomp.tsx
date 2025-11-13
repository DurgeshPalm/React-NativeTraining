import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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
        safeStorage.set("role", res.data?.data[0]?.role);
        safeStorage.set("userid", res.data?.data[0]?.id.toString());
        alert("Login successful!");
        // router.replace("/");
        // router.replace("./DashboardScreen");
        // console.log(res.data.data[0].id);

        router.replace("/minomp/(tabs)");
      } else {
        alert("Something went wrong!");
      }
    } catch (error) {
      alert("Login failed. Check credentials.");
      // console.log(error);
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
            <Image
              source={require("../../assets/LogInImageminomp.png")}
              style={styles.loginImage}
              resizeMode="contain"
            />

            {/* Toggle */}
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  loginMode === "mobile" && styles.activeToggle,
                ]}
                onPress={() => setLoginMode("mobile")}
              >
                <Text style={styles.toggleText}>Mobile</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  loginMode === "email" && styles.activeToggle,
                ]}
                onPress={() => setLoginMode("email")}
              >
                <Text style={styles.toggleText}>Email</Text>
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
                <View style={{ width: 90, height: 41 }}>
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
                    containerStyle={{ width: 80 }}
                    // style={{ backgroundColor: "#FFFFFF66", minHeight: 41 }}
                    style={[styles.codePicker]}
                    dropDownContainerStyle={styles.codeDropdown}
                    listItemLabelStyle={{ color: "#fff" }}
                    zIndex={2000}
                  />
                </View>
                <TextInput
                  placeholder="Mobile"
                  keyboardType="phone-pad"
                  placeholderTextColor="#ccc"
                  value={mobile}
                  onChangeText={setMobile}
                  style={[styles.mobileInput, { flex: 1, marginLeft: -15 }]}
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

            <TouchableOpacity onPress={() => router.push("./forgotpassword")}>
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
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "85%",
    backgroundColor: "#A15CFF",
    borderRadius: 24,
    padding: 30,
    paddingBottom: 35,
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
    backgroundColor: "#fff",
    borderRadius: 25,
    marginBottom: 20,
    width: 165,
    height: 36,
    alignSelf: "center",
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 25,
    alignItems: "center",
  },
  toggleText: {
    width: 49,
    height: 19,
    color: "#6C5B8F",
    fontFamily: "Fredoka_500Medium", // ensure this is loaded via expo-google-fonts
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 16, // matches 100% line height
    letterSpacing: 0,
    textAlign: "center",
    opacity: 1,
  },
  activeToggle: {
    width: 83,
    height: 36,
    backgroundColor: "#40E0D0", // turquoise fill
    borderRadius: 45,
    borderWidth: 1,
    borderColor: "#4D4264",
    alignItems: "center",
    justifyContent: "center",
    opacity: 1,
  },
  activeText: { color: "#333" },

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
  row: {
    flexDirection: "row",
    alignItems: "center",
    // width: "100%",
    marginVertical: 6,
    width: 257,
    height: 41,
  },
  forgotText: {
    width: 108,
    height: 16,
    color: "#EEEEEE",
    fontFamily: "Fredoka_400Regular", // Regular weight
    fontWeight: "400",
    fontSize: 13,
    lineHeight: 13, // 100% line height
    letterSpacing: 0,
    textAlign: "right",
    opacity: 1,
    alignSelf: "flex-end", // aligns to the right within parent container
    marginBottom: 14,
  },

  loginButton: {
    width: 146,
    height: 43, // matches 43.1538, rounded for RN
    backgroundColor: "#00EAD3",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    alignSelf: "center", // centers horizontally like in Figma
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, // roughly 40% (0x40)
    shadowRadius: 4,
    elevation: 4, // ✅ required for Android shadow
  },
  loginText: { color: "#333", fontWeight: "bold" },
  signupText: {
    width: 184,
    height: 16,
    color: "#FFFFFF",
    fontFamily: "Fredoka_400Regular", // Regular weight
    fontWeight: "400",
    fontSize: 13,
    lineHeight: 13, // 100%
    letterSpacing: 0,
    textAlign: "center",
    opacity: 1,
    alignSelf: "center", // centers text horizontally
    marginTop: 10, // optional: adds a bit of vertical spacing
  },

  signupLink: {
    color: "#4EE1C1",
    fontFamily: "Fredoka_400Regular",
    fontWeight: "400",
    fontSize: 13,
    lineHeight: 13,
    letterSpacing: 0,
  },

  loginImage: {
    width: 140, // same proportion as your uploaded design
    height: 44,
    alignSelf: "center",
    marginBottom: 18, // keep same spacing as previous text
  },
  mobileInput: {
    flex: 1,
    height: 41,
    backgroundColor: "#C08FFF",
    borderRadius: 10,
    paddingHorizontal: 12,
    color: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#4D4264",
  },

  dropdown: {
    backgroundColor: "#C08FFF",
    borderColor: "#C08FFF",
    borderRadius: 10,
    // height: 41,
  },

  dropdownContainer: {
    backgroundColor: "#C08FFF",
    borderColor: "#C08FFF",
    marginTop: 5,
    // zIndex: 1000,
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
});
