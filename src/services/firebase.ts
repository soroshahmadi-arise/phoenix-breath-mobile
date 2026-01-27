import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
    apiKey: "AIzaSyBXEo37Ffk4jlO-DkIhBktq_c0XNdps8kQ",
    authDomain: "phoenix-f8906.firebaseapp.com",
    projectId: "phoenix-f8906",
    storageBucket: "phoenix-f8906.firebasestorage.app",
    messagingSenderId: "1082310737440",
    // appId is optional for Auth/Firestore but good to have if we had the web one. 
    // We will proceed without it for now as it usually works for core features.
};

// Initialize Firebase (Singleton pattern)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app, "us-central1"); 
