import LogoutButton from "@/components/LogoutButton";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as TaskManager from "expo-task-manager";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import GoogleLoginButton from "../../../components/googlelogin";
import { useUser } from "../../store/UserContext";
import { useThemeStore } from "../../store/themeStore";

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { name, email } = useLocalSearchParams();
  const theme = useThemeStore((state) => state.theme);

  const backgroundColor = theme == "light" ? "#2f3640" : "#f5f6fa";
  const textColor = theme === "light" ? "#f5f6fa" : "#2f3640";
  const subtitleColor = theme === "light" ? "#ccc" : "#666";

  const stopBackgroundUpdate = async () => {
    try {
      await TaskManager.unregisterAllTasksAsync();
      console.log("Background location updates stopped.");
    } catch (error) {
      console.error("Error stopping background location updates:", error);
    }
  };

  return (
    <ScrollView>
      <View style={[styles.container, { backgroundColor: backgroundColor }]}>
        <Text style={[styles.title, { color: textColor }]}>
          Welcome {name || user?.name || "Guest"}
        </Text>
        {(email || user?.email) && (
          <Text style={[styles.subtitle, { color: subtitleColor }]}>
            Your email: {email || user?.email}
          </Text>
        )}
        {!name && !user?.name && (
          <>
            <TouchableOpacity
              style={[styles.button]}
              onPress={() => router.push("../../login")}
            >
              <Text style={[styles.buttonText]}>Go To Login</Text>
            </TouchableOpacity>
            <GoogleLoginButton />

            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("../../signup")}
            >
              <Text style={[styles.buttonText]}>Signup</Text>
            </TouchableOpacity>
          </>
        )}

        {(name || user?.name) && <LogoutButton />}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Explore Features
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("../../about")}
          >
            <Text style={[styles.buttonText]}>ExpoMaps</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("../../mapclustering")}
          >
            <Text style={[styles.buttonText]}>ReactNativeMaps</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("../../todo")}
          >
            <Text style={[styles.buttonText]}>TodoList</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("../../minomp/signup")}
          >
            <Text style={[styles.buttonText]}>SignupTominomp</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={stopBackgroundUpdate}
          >
            <Text style={[styles.buttonText]}>stopBackgroud</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("../../NotificationPage")}
          >
            <Text style={[styles.buttonText]}>Notification</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2f3640",
    marginBottom: 30,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 20,
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
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "uppercase",
    justifyContent: "center",
    alignItems: "center",
  },
  loginButton: {
    backgroundColor: "#03DAC6",
  },
  loginButtonText: {
    color: "#000000",
  },
  section: {
    width: "100%",
    marginTop: 10,
    paddingTop: 20,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
    textAlign: "center",
  },
});
