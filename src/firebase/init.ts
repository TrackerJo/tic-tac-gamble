// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAEbjiL7Qx6_8Gvj6jYe8u3QowBklCtRaM",
    authDomain: "tic-tac-gamble.firebaseapp.com",
    projectId: "tic-tac-gamble",
    storageBucket: "tic-tac-gamble.firebasestorage.app",
    messagingSenderId: "1045232678266",
    appId: "1:1045232678266:web:ef9a94ca640e51369fd2c3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);