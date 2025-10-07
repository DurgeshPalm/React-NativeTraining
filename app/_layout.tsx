import messaging from "@react-native-firebase/messaging";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Linking from "expo-linking";
import { Stack, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Alert } from "react-native";
import { UserProvider } from "../app/store/UserContext";

const queryClient = new QueryClient();

const linking = {
  prefixes: [Linking.createURL("/"), "newapp://"],
  config: {
    screens: {
      login: "login",
      signup: "signup",
      about: "about",
      todo: "todo",
      userdetail: "userdetail",
      productdetail: "productdetail",
      "(home)": {
        screens: {
          "(tabs)": {
            screens: {
              index: "",
              feed: "feed",
              friends: "friends",
              profile: "profile",
            },
          },
          settings: "settings",
          products: "products",
          getusers: "getusers",
        },
      },
    },
  },
};

export default function RootLayout() {
  const router = useRouter();
  useEffect(() => {
    const requestPermission = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log("Authorization status:", authStatus);

        const fcmToken = await messaging().getToken();
        console.log("FCM Token:", fcmToken);
        // Optionally send token to your server
      }
    };

    requestPermission();

    // Listen for foreground messages
    const unsubscribeOnMessage = messaging().onMessage(
      async (remoteMessage) => {
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
