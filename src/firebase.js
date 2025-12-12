// /src/config/firebase/config.js

// Import Firebase SDK
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB5AvPeUQDR1NMKSOGw724qHCKo8UUzCro",
  authDomain: "calendar--calendar.firebaseapp.com",
  projectId: "calendar--calendar",
  storageBucket: "calendar--calendar.firebasestorage.app",
  messagingSenderId: "891852216537",
  appId: "1:891852216537:web:5e5a255b51fccaae03c6c8",
  measurementId: "G-TMFFHYBR0C"
};

// Inicializácia Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// API URL
const API_URL = 'http://localhost:8080/api/v1/api';

// Registrácia používateľa
export const registerWithEmailAndPassword = async (email, password, username) => {
  try {
    // Firebase registrácia
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Nastavenie displayName v Firebase
    if (username) {
      try {
        await updateProfile(userCredential.user, {
          displayName: username
        });
        await userCredential.user.reload();
      } catch (profileError) {
        console.error("Chyba pri nastavovaní displayName:", profileError);
      }
    }
    
    // Registrácia používateľa v backende
    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username || email.split('@')[0],
          email: email
        })
      });
      
      if (!response.ok) {
        throw new Error(`Backend registrácia zlyhala: ${response.status}`);
      }
      
      const userData = await response.json();
      console.log("Používateľ uložený v backende:", userData);
      
      // Uloženie ID používateľa do localStorage
      localStorage.setItem('userId', userData.id);
      
    } catch (backendError) {
      console.error("Chyba pri registrácii do backendu:", backendError);
      // Pokračujeme - používateľ je už vytvorený vo Firebase
    }
    
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

// Prihlásenie používateľa
export const loginWithEmailAndPassword = async (email, password) => {
  try {
    // Firebase prihlásenie
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Prihlásenie/overenie používateľa v backende
    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userCredential.user.displayName || email.split('@')[0],
          email: email
        })
      });
      
      if (!response.ok) {
        throw new Error(`Backend prihlásenie zlyhalo: ${response.status}`);
      }
      
      const userData = await response.json();
      console.log("Používateľ prihlásený v backende:", userData);
      
      // Uloženie ID používateľa do localStorage
      localStorage.setItem('userId', userData.id);
      
    } catch (backendError) {
      console.error("Chyba pri prihlásení do backendu:", backendError);
      // Pokračujeme - používateľ je už prihlásený vo Firebase
    }
    
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

// Odhlásenie používateľa
export const logoutUser = async () => {
  try {
    await signOut(auth);
    // Vymazanie ID používateľa z localStorage
    localStorage.removeItem('userId');
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Získanie ID používateľa
export const getUserId = () => {
  return localStorage.getItem('userId');
};

export { auth };