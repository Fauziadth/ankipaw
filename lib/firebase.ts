import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "APIKEY",
    authDomain: "AUTHDOMAIN",
    projectId: "PROJECT_ID",
    storageBucket: "STORAGE_BUCKET_NAME",
    messagingSenderId: "MESSAGING_SENDER_ID",
    appId: "APP_ID",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
const db = getFirestore(app)

export { db }
