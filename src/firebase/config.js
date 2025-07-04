// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCVml3eY0z26hEXUPX_yFknnBNYWlKRLxI",
  authDomain: "blaze-sports-23f1f.firebaseapp.com",
  projectId: "blaze-sports-23f1f",
  storageBucket: "blaze-sports-23f1f.firebasestorage.app",
  messagingSenderId: "41477914663",
  appId: "1:41477914663:web:4bdf2fa2080dae0f770e02"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
export default app;
