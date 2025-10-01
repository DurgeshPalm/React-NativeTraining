import { Stack } from "expo-router";
import { useEffect } from "react";
import { UserProvider } from "../app/store/UserContext";
import { useThemeStore } from "../app/store/themeStore";

export default function RootLayout() {
  const loadTheme = useThemeStore((state) => state.loadTheme);

  useEffect(() => {
    loadTheme();
  }, []);

  return (
    <UserProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(home)" />
      </Stack>
    </UserProvider>
  );
}
