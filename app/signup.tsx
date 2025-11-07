// app/screens/Signup.tsx
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import Checkbox from "expo-checkbox";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as Yup from "yup";
import LoginInput from "../components/LoginInput";

const SignupSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  age: Yup.string().required("Please select an age range"),
  gender: Yup.string().required("Please select gender"),
  terms: Yup.boolean().oneOf([true], "You must accept terms and conditions"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Must be at least 6 characters")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[0-9]/, "Must contain at least one number")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Must contain at least one special character"
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

const initialValues = {
  name: "",
  age: "",
  gender: "",
  terms: false,
  email: "",
  password: "",
  confirmPassword: "",
};

const Signup = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [nameFocus, setNameFocus] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [confirmPasswordFocus, setConfirmPasswordFocus] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#4cd137" />
      </TouchableOpacity>

      <Text style={styles.title}>Signup</Text>

      <Formik
        initialValues={initialValues}
        validationSchema={SignupSchema}
        onSubmit={(values, { resetForm }) => {
          console.log("Form submitted:", values);
          Alert.alert("Success", "Signup completed!");
          resetForm();
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          values,
          errors,
          touched,
          resetForm,
        }) => (
          <>
            {/* Name */}
            <LoginInput
              placeholder="Name"
              value={values.name}
              onChangeText={handleChange("name")}
              onBlur={() => handleBlur("name")}
              error={touched.name && errors.name ? errors.name : undefined}
              isFocused={nameFocus}
              setIsFocused={setNameFocus}
            />

            {/* Age Picker */}
            <Picker
              selectedValue={values.age}
              style={styles.picker}
              onValueChange={(itemValue: string) =>
                setFieldValue("age", itemValue)
              }
            >
              <Picker.Item label="Select Age Range" value="" />
              <Picker.Item label="18-25" value="18-25" />
              <Picker.Item label="26-35" value="26-35" />
              <Picker.Item label="36-45" value="36-45" />
              <Picker.Item label="46+" value="46+" />
            </Picker>
            {touched.age && errors.age && (
              <Text style={styles.error}>{errors.age}</Text>
            )}

            {/* Gender Radio */}
            <View style={styles.radioGroup}>
              {["Male", "Female", "Other"].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.radioOption}
                  onPress={() => setFieldValue("gender", option)}
                >
                  <View
                    style={[
                      styles.radioCircle,
                      values.gender === option && styles.selected,
                    ]}
                  />
                  <Text style={styles.radioLabel}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {touched.gender && errors.gender && (
              <Text style={styles.error}>{errors.gender}</Text>
            )}

            {/* Terms & Conditions */}
            <View style={styles.checkboxContainer}>
              <Checkbox
                value={values.terms}
                onValueChange={(newValue) => setFieldValue("terms", newValue)}
                color={values.terms ? "#4cd137" : undefined}
              />
              <Text style={styles.checkboxLabel}>
                I accept Terms & Conditions
              </Text>
            </View>
            {touched.terms && errors.terms && (
              <Text style={styles.error}>{errors.terms}</Text>
            )}

            {/* Email */}
            <LoginInput
              placeholder="Email"
              value={values.email}
              onChangeText={handleChange("email")}
              onBlur={() => handleBlur("email")}
              error={touched.email && errors.email ? errors.email : undefined}
              isFocused={emailFocus}
              setIsFocused={setEmailFocus}
            />

            {/* Password */}
            <LoginInput
              placeholder="Password"
              secureTextEntry={!showPassword}
              value={values.password}
              onChangeText={handleChange("password")}
              onBlur={() => handleBlur("password")}
              error={
                touched.password && errors.password
                  ? errors.password
                  : undefined
              }
              isFocused={passwordFocus}
              setIsFocused={setPasswordFocus}
              rightIcon={
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye" : "eye-off"}
                    size={20}
                    color="gray"
                  />
                </TouchableOpacity>
              }
            />

            {/* Confirm Password */}
            <LoginInput
              placeholder="Confirm Password"
              secureTextEntry={!showConfirmPassword}
              value={values.confirmPassword}
              onChangeText={handleChange("confirmPassword")}
              onBlur={() => handleBlur("confirmPassword")}
              error={
                touched.confirmPassword && errors.confirmPassword
                  ? errors.confirmPassword
                  : undefined
              }
              isFocused={confirmPasswordFocus}
              setIsFocused={setConfirmPasswordFocus}
              rightIcon={
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={showConfirmPassword ? "eye" : "eye-off"}
                    size={20}
                    color="gray"
                  />
                </TouchableOpacity>
              }
            />

            {/* Submit */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleSubmit()}
            >
              <Text style={styles.buttonText}>Signup</Text>
            </TouchableOpacity>

            {/* Reset Form */}
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#ccc" }]}
              onPress={() => resetForm({ values: initialValues })}
            >
              <Text style={[styles.buttonText, { color: "#000" }]}>Reset</Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#f5f6fa",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2f3640",
    marginBottom: 30,
    textAlign: "center",
  },
  picker: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 10,
  },
  error: {
    color: "#e84118",
    fontSize: 12,
    marginBottom: 8,
  },
  button: {
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
  radioGroup: {
    flexDirection: "row",
    marginVertical: 10,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  radioCircle: {
    height: 18,
    width: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#4cd137",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  selected: {
    backgroundColor: "#4cd137",
  },
  radioLabel: {
    fontSize: 14,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  checkboxLabel: {
    marginLeft: 8,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
  },
});

export default Signup;
