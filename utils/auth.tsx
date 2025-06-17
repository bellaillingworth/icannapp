import { signInWithEmailAndPassword, createUserWithEmailAndPassword, UserCredential } from 'firebase/auth';
import { auth } from '../config/firebase';

export async function signIn(email: string, password: string): Promise<UserCredential> {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signUp(email: string, password: string): Promise<UserCredential> {
  return createUserWithEmailAndPassword(auth, email, password);
} 