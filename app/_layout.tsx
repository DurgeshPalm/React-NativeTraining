import { Stack } from "expo-router";
import React from "react";
import { UserProvider } from "../app/store/UserContext";

export default function RootLayout() {
  return (
    <UserProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(home)" />
      </Stack>
    </UserProvider>
  );
}
