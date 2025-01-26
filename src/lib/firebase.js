// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBbbmNwmAHRimVwOA--jqmeq9vFgLjYZt4",
  authDomain: "chat-15fee.firebaseapp.com",
  projectId: "chat-15fee",
  storageBucket: "chat-15fee.firebasestorage.app",
  messagingSenderId: "864604120705",
  appId: "1:864604120705:web:334e6c957a40d3ffbecf80",
  measurementId: "G-JS1B2SW653"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth()
export const db = getFirestore()
