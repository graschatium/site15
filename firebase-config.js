// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAKnnxGUTpNWtkYetID8UwTp6cJgbcj9Kc",
  authDomain: "scp-site19.firebaseapp.com",
  projectId: "scp-site19",
  storageBucket: "scp-site19.firebasestorage.app",
  messagingSenderId: "245750946774",
  appId: "1:245750946774:web:821944a85e207094b22277"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);