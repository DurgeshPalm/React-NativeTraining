import messaging from "@react-native-firebase/messaging";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { Alert } from "react-native";

export default function RootLayout() {
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
      }
    );

    // App killed state
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log("Opened from quit state:", remoteMessage.notification);
        }
      });

    return () => {
      unsubscribeOnMessage();
      unsubscribeBackground();
    };
  }, []);

  return <Stack />;
}
