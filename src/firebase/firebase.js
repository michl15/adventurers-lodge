import { initializeApp } from "firebase/app";
import { FIREBASE_CONFIG } from "../config/firebaseConfig";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseApp = initializeApp(FIREBASE_CONFIG);
const analytics = getAnalytics(firebaseApp);

const firebaseAuth = getAuth(firebaseApp);

const firebaseDatabase = getDatabase(firebaseApp)

export {firebaseApp, analytics, firebaseAuth, firebaseDatabase}

