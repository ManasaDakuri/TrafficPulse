// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCgFWXW4pR15nr-mfYpZdMzDOpVzhuQFRw",
  authDomain: "trafficpulse-862aa.firebaseapp.com",
  projectId: "trafficpulse-862aa",
  storageBucket: "trafficpulse-862aa.appspot.com", // Fixed from firebasestorage.app
  messagingSenderId: "256064695495",
  appId: "1:256064695495:web:68bad134bac95e6e48e2e2",
  measurementId: "G-6N31WR5PSJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };