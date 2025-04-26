// firebase/firebaseConfig.ts

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Configurazione del tuo progetto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCOrRq9NLR9zw1pG8fqcPEYMX-nLIhfO6w",
  authDomain: "billit-89312.firebaseapp.com",
  projectId: "billit-89312",
  storageBucket: "billit-89312.firebasestorage.app",
  messagingSenderId: "439098648288",
  appId: "1:439098648288:web:8c3fb4c2b01809529c1285",
  measurementId: "G-3FN35TX7N5"
};

// Inizializza Firebase
const app = initializeApp(firebaseConfig);

// Inizializza l'autenticazione
export const auth = getAuth(app);
