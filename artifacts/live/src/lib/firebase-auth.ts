import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const requiredConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

if (Object.values(requiredConfig).some((value) => typeof value !== "string" || !value.trim())) {
  throw new Error("Firebase web authentication is not configured.");
}

const firebaseApp = getApps()[0] || initializeApp(requiredConfig);

export const firebaseAuth = getAuth(firebaseApp);