import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDx1G2IIji356Kxd3DvBUZJ5lkALObTKks",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "spendwise-4cbb7.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "spendwise-4cbb7",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "spendwise-4cbb7.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1085748127091",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1085748127091:web:3f31de6e340a0e8a71d106",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-MMJXHWHLMJ"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };