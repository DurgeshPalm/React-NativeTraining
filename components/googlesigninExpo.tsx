// import * as AuthSession from "expo-auth-session";
// import * as WebBrowser from "expo-web-browser";
// import React, { useEffect, useState } from "react";
// import { Alert, Button, View } from "react-native";
// import {
//   auth,
//   GoogleAuthProvider,
//   signInWithCredential,
// } from "../app/firebase/firebaseconfig";
// import { useUser } from "../app/store/UserContext";
// import { safeStorage } from "../app/store/storage";
// import Loader from "./Loader";

// WebBrowser.maybeCompleteAuthSession();

// const GoogleLoginButtonExpo = () => {
//   const { setUser } = useUser();
//   const [loading, setLoading] = useState(false);

//   // Replace with your Web Client ID from Firebase Console (NOT the iOS one)
//   const clientId =
//     "1081027851873-7a543pao7d2p2g84rabrdut061c2qqln.apps.googleusercontent.com";

//   const [request, response, promptAsync] = AuthSession.useAuthRequest(
//     {
//       responseType: "id_token",
//       clientId,
//       scopes: ["profile", "email"],
//       redirectUri: AuthSession.makeRedirectUri({
//         scheme: "newapp",
//       }),
//     },
//     {
//       authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
//     }
//   );

//   useEffect(() => {
//     const signInWithGoogle = async () => {
//       if (response?.type === "success") {
//         try {
//           setLoading(true);
//           const { id_token } = response.params;
//           console.log("🔑 Google ID Token:", id_token);
//           const credential = GoogleAuthProvider.credential(id_token);
//           const userCredential = await signInWithCredential(auth, credential);
//           console.log("✅ Firebase login successful:", userCredential.user);
//           setUser({
//             name: userCredential.user.displayName,
//             email: userCredential.user.email,
//             prpfilePictureUrl: userCredential?.user?.photoURL,
//           });

//           safeStorage.set("name", userCredential.user.displayName || "");
//           safeStorage.set("email", userCredential.user.email || "");
//           safeStorage.set(
//             "profilePictureUrl",
//             userCredential.user.photoURL || ""
//           );
//           setLoading(false);
//         } catch (error: any) {
//           console.error("❌ Google Sign-in Error:", error);

//           // Optional user-friendly alert
//           Alert.alert(
//             "Login Failed",
//             error?.message || "Something went wrong. Please try again."
//           );
//         } finally {
//           setLoading(false);
//         }
//       } else if (response?.type === "error") {
//         console.error("🚫 Auth response error:", response);
//         Alert.alert("Error", "Authorization failed. Please try again.");
//       }
//     };

//     signInWithGoogle();
//   }, [response]);

//   return (
//     <View style={{ alignItems: "center", marginVertical: 10 }}>
//       {loading ? (
//         <Loader />
//       ) : (
//         <Button
//           title="Sign in with Google"
//           disabled={!request}
//           onPress={() => promptAsync()}
//         />
//       )}
//     </View>
//   );
// };

// export default GoogleLoginButtonExpo;
