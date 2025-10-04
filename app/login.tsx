import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as Yup from "yup";
import LoginInput from "../components/LoginInput";
import { useUser } from "./store/UserContext";
import { safeStorage } from "./store/storage";

const LoginSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[0-9]/, "Must contain at least one number")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Must contain at least one special character"
    ),
});

const App = () => {
  const [focusField, setFocusField] = useState<{
    name: boolean;
    email: boolean;
    password: boolean;
  }>({
    name: false,
    email: false,
    password: false,
  });
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useUser();

  const [initialValues, setInitialValues] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const savedName = safeStorage.getString("name") || "";
    const savedEmail = safeStorage.getString("email") || "";
    const savedPassowrd = safeStorage.getString("password") || "";
    setInitialValues({
      name: savedName,
      email: savedEmail,
      password: savedPassowrd,
    });
    console.log(savedEmail, savedName, savedPassowrd);
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="arrow-back" size={24} color="#4cd137" />
      </TouchableOpacity>
      <Text style={styles.title}>Login</Text>
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={LoginSchema}
        onSubmit={(values, { resetForm }) => {
          safeStorage.set("name", values.name);
          safeStorage.set("email", values.email);
          safeStorage.set("password", values.password);
          console.log("Login values:", values);
          setUser({ name: values.name, email: values.email });
          router.push({
            pathname: "/",
            params: { name: values.name, email: values.email },
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
            <LoginInput
              placeholder="Name"
              value={values.name}
              onChangeText={handleChange("name")}
              onBlur={() => handleBlur("name")}
              error={touched.name ? errors.name : undefined}
              isFocused={focusField.name ?? false}
              setIsFocused={(focus) =>
                setFocusField((prev) => ({ ...prev, name: focus }))
              }
            />
            <LoginInput
              placeholder="Email"
              value={values.email}
              onChangeText={handleChange("email")}
              onBlur={() => handleBlur("email")}
              error={touched.email ? errors.email : undefined}
              isFocused={focusField.email}
              setIsFocused={(focus) =>
                setFocusField((prev) => ({ ...prev, email: focus }))
              }
            />
            <LoginInput
              placeholder="Password"
              secureTextEntry={!showPassword}
              value={values.password}
              onChangeText={handleChange("password")}
              onBlur={() => handleBlur("password")}
              error={touched.password ? errors.password : undefined}
              isFocused={focusField.password}
              setIsFocused={(focus) =>
                setFocusField((prev) => ({ ...prev, password: focus }))
              }
              rightIcon={
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye" : "eye-off"}
                    size={24}
                    color="gray"
                  />
                </TouchableOpacity>
              }
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleSubmit()}
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            {/* <GoogleLoginButton /> */}
            <TouchableOpacity
              style={[styles.button]}
              onPress={() =>
                resetForm({ values: { name: "", email: "", password: "" } })
              }
            >
              <Text style={[styles.buttonText]}>Reset</Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
    // justifyContent: 'center',
    // alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2f3640",
    marginBottom: 40,
    justifyContent: "center",
    alignSelf: "center",
  },
  inputContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  inputContainerFocused: {
    borderColor: "#4cd137",
    shadowOpacity: 0.15,
    elevation: 5,
  },
  input: {
    fontSize: 16,
    color: "#2f3640",
  },
  errorText: {
    color: "#e84118",
    marginTop: 5,
    fontSize: 12,
  },
  button: {
    width: "100%",
    backgroundColor: "#4cd137",
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  error: {
    color: "#e84118",
    fontSize: 12,
    marginBottom: 8,
  },
  backButton: {
    // position: "absolute",
    marginTop: 40,
    // flex:1
    // top: 40,
    // left: 20,
    // zIndex: 10,
  },
  iconContainer: {
    position: "absolute",
    right: 15,
    top: "35%",
  },
});

export default App;
