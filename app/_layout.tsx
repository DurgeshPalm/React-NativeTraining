import messaging from "@react-native-firebase/messaging";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Device from "expo-device";
import * as Linking from "expo-linking";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import { UserProvider } from "../app/store/UserContext";
import { safeStorage } from "./store/storage";

const queryClient = new QueryClient();

export default function RootLayout() {
  const router = useRouter();
  const [deviceInfo, setDeviceInfo] = useState<any>(null);

  useEffect(() => {
    const getDeviceData = async () => {
      const info = {
        brand: Device.brand,
        modelName: Device.modelName,
        osName: Device.osName,
        osVersion: Device.osVersion,
        deviceType: await Device.getDeviceTypeAsync(),
        isDevice: Device.isDevice,
      };
      setDeviceInfo(info);
      console.log("Device Info:", info);
    };

    getDeviceData();
  }, []);

  useEffect(() => {
    const handleDeepLink = (event: { url: string } | string) => {
      const url = typeof event === "string" ? event : event.url;
      const data = Linking.parse(url);
      console.log("🌐 Dynamic Link Data:", data);
      //npx uri-scheme open newapp://login --android
      //npx uri-scheme open newapp://getusers --android

      // if (data.path === "signup") {
      //   router.push("/signup");
      // }
    };

    const subscription = Linking.addEventListener("url", handleDeepLink);

    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink(url);
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const requestPermission = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log("Authorization status:", authStatus);

        const fcmToken = await messaging().getToken();
        safeStorage.set("fcmToken", fcmToken);
        console.log("FCM Token:", fcmToken);
        // Optionally send token to your server
      }
    };

    requestPermission();

    // Listen for foreground messages
    const unsubscribeOnMessage = messaging().onMessage(
      async (remoteMessage) => {
        console.log("Foreground Message:", remoteMessage.notification);
        Alert.alert(
          remoteMessage.notification?.title || "Notification",
          remoteMessage.notification?.body || "You received a message"
        );
      }
    );

    // Background state
    const unsubscribeBackground = messaging().onNotificationOpenedApp(
      (remoteMessage) => {
        console.log("Opened from background:", remoteMessage.notification);
        Alert.alert(
          remoteMessage.notification?.title || "Notification",
          remoteMessage.notification?.body || "Opened from background"
        );
        router.push("/signup");
      }
    );

    // App killed state
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log("Opened from quit state:", remoteMessage.notification);
          Alert.alert(
            remoteMessage.notification?.title || "Notification",
            remoteMessage.notification?.body || "Opened from quit state"
          );
          router.push("/signup");
        }
      });

    return () => {
      unsubscribeOnMessage();
      unsubscribeBackground();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(home)" />
        </Stack>
      </UserProvider>
    </QueryClientProvider>
  );
}
