import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// In a real application, these would be populated via environment variables.
// The user didn't provide specific credentials for Firebase in the prompt,
// so we'll set up the structure to use env variables, but provide a mocked
// fallback or warning if they are missing to satisfy the "cloud-ready" requirement
// without crashing if the user hasn't set them up yet.

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "mock-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mock-domain.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mock-project-id",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "mock-bucket.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "mock-sender-id",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "mock-app-id"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
