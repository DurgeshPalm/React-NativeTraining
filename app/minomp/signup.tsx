import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Formik } from "formik";
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
        label: `${item.country_code}`,
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
          <Image
            source={require("../../assets/SignupTextImage.png")}
            style={styles.signupImage}
            resizeMode="contain"
          />

          {/* Toggle */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                signupType === "mobile" && styles.toggleButtonActive,
              ]}
              onPress={() => setSignupType("mobile")}
            >
              <Text style={styles.toggleText}>Mobile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toggleButton,
                signupType === "email" && styles.toggleButtonActive,
              ]}
              onPress={() => setSignupType("email")}
            >
              <Text style={styles.toggleText}>Email</Text>
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
                        style={[styles.mobileInput, { flex: 1, marginLeft: 8 }]}
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
                    <Text style={styles.signupBtnText}>SIGNUP</Text>
                  )}
                </TouchableOpacity>

                <Text style={styles.loginText}>
                  Already have an account ?{" "}
                  <Text
                    style={styles.loginLink}
                    onPress={() => router.push("./loginminomp")}
                  >
                    Login
                  </Text>
                </Text>
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
    width: 135,
    height: 48,
    color: "#000", // text color inside the white box
    backgroundColor: "#FFFFFF",
    borderWidth: 3,
    borderColor: "#40E0D0",
    borderRadius: 10,
    textAlign: "center",
    textAlignVertical: "center",
    fontFamily: "Fredoka_700Bold", // make sure Fredoka is loaded via expo-google-fonts or similar
    fontWeight: "700",
    fontSize: 40,
    lineHeight: 48,
    letterSpacing: 0.07 * 40, // roughly 7% of font size
    overflow: "hidden",
    alignSelf: "center",
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

  toggleButtonActive: {
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
    // marginTop: 9, // positions the text visually per Figma 'top: 9px'
    // marginLeft: 17, // aligns it per 'left: 17px'
  },

  toggleTextActive: { color: "#fff" },

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
    width: "100%",
    marginVertical: 5,
  },

  dropdown: {
    backgroundColor: "#C08FFF",
    borderColor: "#C08FFF",
    borderRadius: 10,
    height: 41,
  },

  dropdownContainer: {
    backgroundColor: "#C08FFF",
    borderColor: "#C08FFF",
    marginTop: 5,
    zIndex: 1000,
  },

  codePicker: {
    backgroundColor: "#C08FFF",
    borderColor: "#C08FFF",
    borderRadius: 10,
    height: 41,
    justifyContent: "center",
    paddingLeft: 8,
  },

  codeDropdown: {
    backgroundColor: "#C08FFF",
    borderColor: "#C08FFF",
    borderRadius: 10,
    zIndex: 2000,
  },

  mobileInput: {
    flex: 1,
    height: 41,
    backgroundColor: "#C08FFF",
    borderColor: "#C08FFF",
    borderRadius: 10,
    paddingHorizontal: 12,
    color: "#fff",
  },

  signupButton: {
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

  signupBtnText: {
    color: "#6C5B8F",
    fontFamily: "Fredoka_700Bold", // load via expo-google-fonts if not already
    fontWeight: "700",
    fontSize: 16,
    lineHeight: 16, // 100% of font size
    letterSpacing: 0.07 * 16, // 7% of font size ≈ 1.12
    textAlign: "center",
  },

  errorText: { color: "red", fontSize: 12, marginBottom: 4 },
  signupImage: {
    width: 140, // same proportion as your uploaded design
    height: 44,
    alignSelf: "center",
    marginBottom: 18, // keep same spacing as previous text
  },
  loginText: {
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
  loginLink: {
    color: "#4EE1C1",
    fontFamily: "Fredoka_400Regular",
    fontWeight: "400",
    fontSize: 13,
    lineHeight: 13,
    letterSpacing: 0,
  },
});
