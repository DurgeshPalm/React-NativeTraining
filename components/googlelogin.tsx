import auth from "@react-native-firebase/auth";
import {
  GoogleSignin,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
import React, { useEffect } from "react";
import { View } from "react-native";
import { useUser } from "../app/store/UserContext";

const GoogleLoginButton = () => {
  const { setUser } = useUser();
  useEffect(() => {
    async function init() {
      const hasPlayServices = await GoogleSignin.hasPlayServices();
      if (hasPlayServices) {
        GoogleSignin.configure({
          offlineAccess: true,
          webClientId:
            "1081027851873-7a543pao7d2p2g84rabrdut061c2qqln.apps.googleusercontent.com",
        });
      }
    }
    init();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const userInfo = await GoogleSignin.signIn();
      const { idToken } = await GoogleSignin.getTokens();
      console.log("userInfo: ", userInfo);

      if (!idToken) throw new Error("No ID token returned");

      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userCredential = await auth().signInWithCredential(
        googleCredential
      );

      setUser({
        name: userCredential?.user?.displayName,
        email: userCredential?.user?.email,
        prpfilePictureUrl: userCredential?.user?.photoURL,
      });
      console.log("✅ Signed in with Google:", userCredential.user);
    } catch (e: any) {
      console.log("❌ Google Sign-In error:", e.message || e);
    }
  };

  return (
    <View
      style={{
        alignItems: "center",
        marginVertical: 10,
        // flex: 1,
        justifyContent: "center",
      }}
    >
      <GoogleSigninButton
        style={{ width: 240, height: 50 }}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={handleGoogleSignIn}
      />
    </View>
  );
};

export default GoogleLoginButton;
