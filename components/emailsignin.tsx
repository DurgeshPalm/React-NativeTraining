import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "@react-native-firebase/auth";
import { safeStorage } from "../app/store/storage";

/**
 * This function handles email authentication:
 * - Creates a new account if it doesn’t exist
 * - Signs in if the account already exists
 */
export const handleEmailAuth = async (
  email: string,
  password: string,
  setUser: any
) => {
  if (!email?.trim() || !password?.trim()) {
    throw new Error("Please enter email and password");
  }

  const auth = getAuth();
  let userCredential;

  try {
    // Try creating a new user
    userCredential = await createUserWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );
    console.log("✅ Account created & signed in:", userCredential.user.email);
  } catch (createErr: any) {
    // If already exists, sign in instead
    if (createErr.code === "auth/email-already-in-use") {
      console.log("ℹ️ Email already in use, signing in instead...");
      userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      console.log("✅ Signed in with existing account:", userCredential.user);
    } else {
      console.error("❌ Auth error:", createErr.code, createErr.message);
      throw createErr;
    }
  }

  const user = userCredential.user;

  // Save and update user globally
  setUser({
    name: user.displayName || "AppUser",
    email: user.email || "",
    prpfilePictureUrl: user.photoURL || "",
  });

  safeStorage.set("name", user.displayName || "AppUser");
  safeStorage.set("email", user.email || "");
  safeStorage.set("profilePictureUrl", user.photoURL || "");

  return user;
};

export default handleEmailAuth;
