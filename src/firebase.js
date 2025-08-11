// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBsZ0OVpbBasjq_6Nb7bFFPXIFTMLLUBjY",
  authDomain: "tattoo-consent-form.firebaseapp.com",
  projectId: "tattoo-consent-form",
  storageBucket: "tattoo-consent-form.firebasestorage.app",
  messagingSenderId: "749065746184",
  appId: "1:749065746184:web:e90df03355ac9ace735ebd",
  measurementId: "G-C87YZ0LDBQ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app); 

export { db };