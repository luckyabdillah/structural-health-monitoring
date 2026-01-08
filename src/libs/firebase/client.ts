import { initializeApp } from "firebase/app"
import { getDatabase, ref } from "firebase/database";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL!,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
}

export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const sensorsRef = ref(database, 'sensors');
