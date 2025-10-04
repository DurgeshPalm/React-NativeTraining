import { Ionicons } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";
import { Dimensions, TouchableOpacity } from "react-native";
import CustomDrawerContent from "../../components/CustomDrawerContent";
import { useThemeStore } from "../store/themeStore";

const { width } = Dimensions.get("window");

export default function HomeLayout() {
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
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerActiveTintColor: "white",
        drawerActiveBackgroundColor: "#4cd137",
        drawerLabelStyle: {
          color: "gray",
        },
        headerStyle: {
          backgroundColor: "#4cd137",
        },
        drawerStyle: {
          width: width * 0.7,
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
