import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import React, { useState } from "react";
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
import * as Yup from "yup";
import api from "../fetchapi";
import { useSignupStore } from "../store/minomp_signup";

interface CountryCode {
  id: number;
  country_name: string;
  country_code: string;
}

export default function SignupScreen() {
  const [signupType, setSignupType] = useState<"email" | "mobile">("email");
  const [open, setOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState<number | null>(null);

  const router = useRouter();
  const { setSignupData } = useSignupStore();

  const { data: countryCodes = [], isLoading } = useQuery({
    queryKey: ["countryCodes"],
    queryFn: async () => {
      const res = await api.get("/users/getCountryCode");
      return res.data;
    },
    select: (response) =>
      response?.data?.map((item: CountryCode) => ({
        label: `${item.country_code} ${item.country_name}`,
        value: item.id,
      })) || [],
  });

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
    password: Yup.string().min(6).required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
  });

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
          <Text style={styles.title}>Signup</Text>

          {/* Toggle */}
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

          {/* ✅ Form */}
          <Formik
            initialValues={{
              name: "",
              email: "",
              mobileno: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={SignupSchema}
            onSubmit={(values, { resetForm }) => {
              const payload = {
                name: values.name,
                email: signupType === "email" ? values.email : "",
                password: values.password,
                mobileno: signupType === "mobile" ? values.mobileno : "",
                country_code_id:
                  signupType === "mobile" ? Number(selectedCode) || 0 : 0,
                signupType,
              };
              setSignupData(payload);
              router.push("./selectrole");
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
            }) => (
              <>
                {/* Name */}
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  placeholderTextColor="#fff"
                  value={values.name}
                  onChangeText={handleChange("name")}
                />
                {touched.name && errors.name && (
                  <Text style={styles.errorText}>{errors.name}</Text>
                )}

                {/* Email / Mobile */}
                {signupType === "email" ? (
                  <>
                    <TextInput
                      style={styles.input}
                      placeholder="Email"
                      placeholderTextColor="#fff"
                      value={values.email}
                      onChangeText={handleChange("email")}
                      keyboardType="email-address"
                    />
                    {touched.email && errors.email && (
                      <Text style={styles.errorText}>{errors.email}</Text>
                    )}
                  </>
                ) : (
                  <>
                    <View style={styles.row}>
                      <View style={{ width: 90 }}>
                        <DropDownPicker
                          open={open}
                          value={selectedCode}
                          items={countryCodes}
                          setOpen={setOpen}
                          setValue={setSelectedCode}
                          placeholder="+91"
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
                        value={values.mobileno}
                        onChangeText={handleChange("mobileno")}
                        keyboardType="numeric"
                      />
                    </View>

                    {touched.mobileno && errors.mobileno && (
                      <Text style={styles.errorText}>{errors.mobileno}</Text>
                    )}
                  </>
                )}

                {/* Password */}
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#fff"
                  secureTextEntry
                  value={values.password}
                  onChangeText={handleChange("password")}
                />
                {touched.password && errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}

                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  placeholderTextColor="#fff"
                  secureTextEntry
                  value={values.confirmPassword}
                  onChangeText={handleChange("confirmPassword")}
                />
                {touched.confirmPassword && errors.confirmPassword && (
                  <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                )}

                {/* NEXT button */}
                <TouchableOpacity
                  style={styles.signupButton}
                  onPress={handleSubmit as any}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.signupBtnText}>NEXT</Text>
                  )}
                </TouchableOpacity>
              </>
            )}
          </Formik>
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
    paddingBottom: 35,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },

  title: {
    fontSize: 32,
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
  },

  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 25,
    alignItems: "center",
  },

  toggleButtonActive: { backgroundColor: "#00EAD3" },

  toggleText: { color: "#000", fontWeight: "bold" },

  toggleTextActive: { color: "#fff" },

  input: {
    backgroundColor: "#C08FFF",
    borderRadius: 10,
    padding: 12,
    color: "#fff",
    marginVertical: 5,
  },

  row: { flexDirection: "row", alignItems: "center", width: "100%" },

  dropdown: {
    backgroundColor: "#C08FFF",
    borderColor: "#C08FFF",
    borderRadius: 10,
    height: 50,
  },

  dropdownContainer: {
    backgroundColor: "#C08FFF",
    borderColor: "#C08FFF",
    marginTop: 4,
    zIndex: 1000,
  },

  signupButton: {
    backgroundColor: "#00EAD3",
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 16,
    alignItems: "center",
  },

  signupBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  errorText: { color: "red", fontSize: 12, marginBottom: 4 },
  codePicker: {
    backgroundColor: "#C08FFF",
    borderColor: "#C08FFF",
    borderRadius: 10,
    height: 50,
  },

  codeDropdown: {
    backgroundColor: "#C08FFF",
    borderColor: "#C08FFF",
    borderRadius: 10,
    zIndex: 2000,
  },
});
