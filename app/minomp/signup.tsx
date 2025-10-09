import axios from "axios";
import { useRouter } from "expo-router";
import { Formik } from "formik";
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
import * as Yup from "yup";

interface CountryCode {
  id: number;
  country_name: string;
  country_code: string;
}

export default function SignupScreen() {
  const [loading, setLoading] = useState(false);
  const [signupType, setSignupType] = useState<"email" | "mobile">("email");
  // Dropdown state
  const [open, setOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState<number | null>(null);
  const [countryCodes, setCountryCodes] = useState<
    { label: string; value: number }[]
  >([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCountryCodes = async () => {
      try {
        const res = await axios.get(
          "http://192.168.29.138:3367/users/getCountryCode"
        );
        if (res.data?.data) {
          const formatted = res.data.data.map((item: CountryCode) => ({
            label: item.country_code,
            value: item.id,
          }));
          setCountryCodes(formatted);
          console.log("Country codes fetched:", formatted);
        }
      } catch (error) {
        console.log("Country code fetch error:", error);
      }
    };
    fetchCountryCodes();
  }, []);

  // ✅ Validation Schema
  const SignupSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email:
      signupType === "email"
        ? Yup.string().email("Invalid email").required("Email is required")
        : Yup.string().nullable(),
    mobileno:
      signupType === "mobile"
        ? Yup.string()
            .matches(/^[0-9]{10}$/, "Enter a valid 10-digit number")
            .required("Mobile number is required")
        : Yup.string().nullable(),
    password: Yup.string()
      .min(6, "Min 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
  });

  // ✅ Submit Handler
  const handleSignup = async (values: any) => {
    try {
      setLoading(true);
      const payload = {
        name: values.name,
        email: signupType === "email" ? values.email : "",
        password: values.password,
        mobileno: signupType === "mobile" ? values.mobileno : "",
        country_code_id: signupType === "mobile" ? selectedCode || "" : "",
        role: "C",
        connectionid: "2",
      };

      const response = await axios.post(
        "http://192.168.29.138:3367/users/createUser",
        payload
      );
      alert(response.data.message || "User created successfully!");
    } catch (error) {
      console.error("Signup Error:", error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Signup</Text>

          {/* Toggle buttons */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                signupType === "mobile" && styles.toggleButtonActive,
              ]}
              onPress={() => setSignupType("mobile")}
            >
              <Text
                style={[
                  styles.toggleText,
                  signupType === "mobile" && styles.toggleTextActive,
                ]}
              >
                Mobile
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toggleButton,
                signupType === "email" && styles.toggleButtonActive,
              ]}
              onPress={() => setSignupType("email")}
            >
              <Text
                style={[
                  styles.toggleText,
                  signupType === "email" && styles.toggleTextActive,
                ]}
              >
                Email
              </Text>
            </TouchableOpacity>
          </View>

          {/* Formik */}
          <Formik
            initialValues={{
              name: "",
              email: "",
              mobileno: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={SignupSchema}
            onSubmit={async (values, { resetForm }) => {
              const payload = {
                name: values.name,
                email: signupType === "email" ? values.email : "",
                password: values.password,
                mobileno: signupType === "mobile" ? values.mobileno : "",
                country_code_id:
                  signupType === "mobile" ? selectedCode || "" : "",
                role: "C",
                connectionid: "2",
              };
              router.push({
                pathname: "./selectrole",
                params: {
                  name: values.name,
                  email: signupType === "email" ? values.email : "",
                  password: values.password,
                  mobileno: signupType === "mobile" ? values.mobileno : "",
                  selectedCode: String(selectedCode || ""), // ensure string
                  signupType: signupType, // 'email' or 'mobile'
                },
              });
              resetForm();
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              resetForm,
            }) => (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  placeholderTextColor="#fff"
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur("name")}
                  value={values.name}
                />
                {touched.name && errors.name && (
                  <Text style={styles.errorText}>{errors.name}</Text>
                )}

                {signupType === "email" ? (
                  <>
                    <TextInput
                      style={styles.input}
                      placeholder="Email"
                      placeholderTextColor="#fff"
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      value={values.email}
                      keyboardType="email-address"
                    />
                    {touched.email && errors.email && (
                      <Text style={styles.errorText}>{errors.email}</Text>
                    )}
                  </>
                ) : (
                  <>
                    {/* Country code + Mobile number in same row */}
                    <View style={styles.row}>
                      <View style={{ flex: 1 }}>
                        <DropDownPicker
                          open={open}
                          value={selectedCode}
                          items={countryCodes}
                          setOpen={setOpen}
                          setValue={setSelectedCode}
                          setItems={setCountryCodes}
                          placeholder="C"
                          style={styles.dropdown}
                          dropDownContainerStyle={styles.dropdownContainer}
                          textStyle={{ color: "#fff" }}
                          zIndex={1000} // ✅ fixes ScrollView conflict
                        />
                      </View>

                      <TextInput
                        style={[styles.input, { flex: 3, marginLeft: 8 }]}
                        placeholder="Mobile"
                        placeholderTextColor="#fff"
                        onChangeText={handleChange("mobileno")}
                        onBlur={handleBlur("mobileno")}
                        value={values.mobileno}
                        keyboardType="numeric"
                      />
                    </View>

                    {touched.mobileno && errors.mobileno && (
                      <Text style={styles.errorText}>{errors.mobileno}</Text>
                    )}
                  </>
                )}

                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#fff"
                  secureTextEntry
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                />
                {touched.password && errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}

                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  placeholderTextColor="#fff"
                  secureTextEntry
                  onChangeText={handleChange("confirmPassword")}
                  onBlur={handleBlur("confirmPassword")}
                  value={values.confirmPassword}
                />
                {touched.confirmPassword && errors.confirmPassword && (
                  <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                )}

                <TouchableOpacity
                  style={[styles.signupButton, loading && { opacity: 0.6 }]}
                  onPress={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.signupText}>SIGNUP</Text>
                  )}
                </TouchableOpacity>

                <Text style={styles.footerText}>
                  Already have an account?{" "}
                  <Text style={styles.loginText}>Login</Text>
                </Text>
              </>
            )}
          </Formik>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  card: {
    width: "85%",
    backgroundColor: "#A15CFF",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 25,
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 25,
    alignItems: "center",
  },
  toggleButtonActive: {
    backgroundColor: "#00EAD3",
  },
  toggleText: {
    color: "#000",
    fontWeight: "bold",
  },
  toggleTextActive: {
    color: "#fff",
  },
  input: {
    backgroundColor: "#C08FFF",
    width: "100%",
    borderRadius: 10,
    padding: 12,
    color: "#fff",
    marginVertical: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  dropdown: {
    backgroundColor: "#C08FFF",
    borderColor: "#C08FFF",
    borderRadius: 10,
    width: 50,
    height: 50,
    justifyContent: "center",
  },
  dropdownContainer: {
    backgroundColor: "#C08FFF",
    borderColor: "#C08FFF",
  },
  signupButton: {
    backgroundColor: "#00EAD3",
    borderRadius: 10,
    marginTop: 20,
    paddingVertical: 12,
    width: "100%",
    alignItems: "center",
  },
  signupText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  footerText: {
    color: "#fff",
    marginTop: 15,
  },
  loginText: {
    color: "#00EAD3",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    alignSelf: "flex-start",
    marginBottom: 4,
  },
});
