// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDdlmef1rPnmXy4IssTLONvnxz1DtYmhSU",
  authDomain: "sase-2449b.firebaseapp.com",
  databaseURL: "https://sase-2449b-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "sase-2449b",
  storageBucket: "sase-2449b.firebasestorage.app",
  messagingSenderId: "380480530636",
  appId: "1:380480530636:web:9991f969622922df8cba69",
  measurementId: "G-1E6SJGTQG5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
export default app;
