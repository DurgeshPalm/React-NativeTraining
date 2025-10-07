import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCtqaE6YnmFpSo8JEtWAkKGVEw5Dx371k4T",
  authDomain: "my-project-f6613.firebaseapp.com",
  projectId: "my-project-f6613",
  storageBucket: "my-project-f6613.firebasestorage.app",
  messagingSenderId: "1081027851873",
  appId: "1:1081027851873:android:566d6de84fb8686bcf9c20",
};
  
  const app = initializeApp(firebaseConfig);
  export const db = getFirestore(app)
  export const auth = getAuth(app);
  export { GoogleAuthProvider, signInWithCredential };
