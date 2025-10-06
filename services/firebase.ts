
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

// Your web app's Firebase configuration, now from environment variables
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Check if all required Firebase environment variables are set
const requiredFirebaseEnvVars: (keyof typeof firebaseConfig)[] = [
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId',
];

const missingVars = requiredFirebaseEnvVars.filter(key => !firebaseConfig[key]);

if (missingVars.length > 0) {
    // Transform keys for better readability in the error message, e.g., 'apiKey' -> 'FIREBASE_API_KEY'
    const missingEnvKeys = missingVars.map(key => `FIREBASE_${key.replace(/([A-Z])/g, '_$1').toUpperCase()}`);
    throw new Error(`Missing required Firebase environment variables: ${missingEnvKeys.join(', ')}. Please check your .env file.`);
}

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// As requested, Firebase Storage has been removed.
// Images will be stored directly in Firestore as Base64 data URLs.
export { app, auth, db };