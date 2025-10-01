// src/services/auth.ts
import { auth } from "@/firebase"
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth"

export function loginUser(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password)
}

export function registerUser(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password)
}