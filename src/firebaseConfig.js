// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyChFe4DiiJ1H33UscsKTAm3Jedgow_lAt8",
  authDomain: "beingwell-a9725.firebaseapp.com",
  projectId: "beingwell-a9725",
  storageBucket: "beingwell-a9725.appspot.com",
  messagingSenderId: "885568934763",
  appId: "1:885568934763:web:0f4c04da4a2d1569d8b22e",
  measurementId: "G-N4RJ9YSKTD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
export { app,auth, analytics, firebaseConfig};

