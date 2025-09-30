import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from "react";
import { UserProvider } from '../app/store/UserContext';
import { ThemeProvider } from '../app/theme/ThemeContext';

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  useEffect(()=>{
    SplashScreen.hide();
  })
  return (
    <ThemeProvider>
    <UserProvider>
    <Stack screenOptions={{ headerShown: false }}>
         <Stack.Screen name="(home)"/>
    </Stack>
    </UserProvider>
    </ThemeProvider>
  );
}
