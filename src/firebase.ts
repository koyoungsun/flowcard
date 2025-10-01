// src/firebase.ts
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore" 

const firebaseConfig = {
    apiKey: "AIzaSyBtZKzzNHRBvkjzNhVfYw4r3R_ht2yjqsQ",
    authDomain: "flow-card-9e6e8.firebaseapp.com",
    projectId: "flow-card-9e6e8",
    storageBucket: "flow-card-9e6e8.firebasestorage.app",
    messagingSenderId: "801480827397",
    appId: "1:801480827397:web:a608f4604c2af4a2d6726c"
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

export { auth, db }