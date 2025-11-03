import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from "@react-native-firebase/auth";
import {
  GoogleSignin,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useUser } from "../app/store/UserContext";
import { safeStorage } from "../app/store/storage";
import Loader from "./Loader";

const GoogleLoginButton = () => {
  const { setUser } = useUser();
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const userInfo = await GoogleSignin.signIn();
      const { idToken } = await GoogleSignin.getTokens();
      console.log("userInfo: ", userInfo);

      if (!idToken) throw new Error("No ID token returned");

      const authInstance = getAuth();
      const googleCredential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(
        authInstance,
        googleCredential
      );

      setUser({
        name: userCredential?.user?.displayName,
        email: userCredential?.user?.email,
        prpfilePictureUrl: userCredential?.user?.photoURL,
      });
      safeStorage.set("name", userCredential?.user?.displayName || "");
      safeStorage.set("email", userCredential?.user?.email || "");
      safeStorage.set(
        "profilePictureUrl",
        userCredential?.user?.photoURL || ""
      );
      // console.log("✅ Signed in with Google:", userCredential.user);
    } catch (e: any) {
      console.log("❌ Google Sign-In error:", e.message || e);
    } finally {
      setLoading(false);
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
      {loading ? (
        <Loader />
      ) : (
        <GoogleSigninButton
          style={{
            width: 240,
            height: 50,
          }}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={handleGoogleSignIn}
          disabled={loading}
        />
      )}
    </View>
  );
};

export default GoogleLoginButton;
