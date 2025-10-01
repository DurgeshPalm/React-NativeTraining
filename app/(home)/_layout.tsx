import { Ionicons } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";
import { TouchableOpacity } from "react-native";
import { useThemeStore } from "../store/themeStore";

export default function HomeLayout() {
  //  const { theme, toggleTheme } = useTheme();
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const renderThemeToggle = () => (
    <TouchableOpacity onPress={toggleTheme} style={{ marginRight: 15 }}>
      <Ionicons
        name={theme === "light" ? "moon" : "sunny"}
        size={24}
        color={theme === "light" ? "#2f3640" : "#f5f6fa"}
      />
    </TouchableOpacity>
  );
  return (
    <Drawer
      screenOptions={{
        drawerActiveTintColor: "white",
        drawerActiveBackgroundColor: "#4cd137",
        drawerLabelStyle: {
          color: "gray",
        },
        headerStyle: {
          backgroundColor: "#4cd137",
        },
        headerRight: renderThemeToggle,
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{ drawerLabel: "Home", title: "Home", overlayColor: "gray" }}
      />
      <Drawer.Screen name="settings" options={{ drawerLabel: "Settings" }} />
      <Drawer.Screen
        name="getusers"
        options={{ drawerLabel: "GetUsers", title: "Users List" }}
      />
    </Drawer>
  );
}
