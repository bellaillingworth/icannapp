import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// Replace these with your actual Firebase config values from GoogleService-Info.plist
const firebaseConfig = {
  apiKey: "AIzaSyBOKwScVSoJm-uTOnagRK63J1DGaw95p8w",
  authDomain: "icanapp-3142b.firebaseapp.com",
  projectId: "icanapp-3142b",
  storageBucket: "icanapp-3142b.firebasestorage.app",
  messagingSenderId: "812671383916",
  appId: "1:812671383916:web:bc40c47f4ab546171ddb49"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getFirestore(app);

export { db };
