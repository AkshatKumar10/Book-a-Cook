// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDpGUs0E3NMH6mUAxz4Al7fdlpYMJblxcU",
  authDomain: "react-native-63837.firebaseapp.com",
  projectId: "react-native-63837",
  storageBucket: "react-native-63837.firebasestorage.app",
  messagingSenderId: "1059315005597",
  appId: "1:1059315005597:web:40eeff1cea4d4c218bbc74",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
