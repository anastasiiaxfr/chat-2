import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "react-chat-1-aa90a.firebaseapp.com",
  projectId: "react-chat-1-aa90a",
  storageBucket: "react-chat-1-aa90a.firebasestorage.app",
  messagingSenderId: "1057961390386",
  appId: "1:1057961390386:web:4eebae4e3041e5c058a72b"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore();