import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_REACT_APP_FIREBASE_apiKey,
  authDomain: import.meta.env.VITE_REACT_APP_FIREBASE_authDomain,
  projectId: import.meta.env.VITE_REACT_APP_FIREBASE_projectId,
  storageBucket: import.meta.env.VITE_REACT_APP_FIREBASE_storageBucket,
  messagingSenderId: import.meta.env.VITE_REACT_APP_FIREBASE_messagingSenderId,
  appId: import.meta.env.VITE_REACT_APP_FIREBASE_appId,
  measurementId: import.meta.env.VITE_REACT_APP_FIREBASE_measurementId,
};

const FirebaseApp = initializeApp(firebaseConfig);
const FirebaseAuth = getAuth(FirebaseApp);
const FirebaseDB = getFirestore(FirebaseApp);

export { FirebaseApp, FirebaseAuth, FirebaseDB };
