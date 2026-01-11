import { initializeApp, getApps } from "firebase/app"
import { getDatabase, ref } from "firebase/database";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
}

// Initialize Firebase only if not already initialized
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const database = getDatabase(app);
export const strainGaugeRef = ref(database, 'strainGauges');
export const loadCellRef = ref(database, 'loadCells');
