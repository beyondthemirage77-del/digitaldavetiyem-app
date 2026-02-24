import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  type UserCredential,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

async function ensureUserDoc(
  uid: string,
  data: { fullName: string; email: string }
) {
  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);
  if (!snapshot.exists()) {
    await setDoc(userRef, {
      ...data,
      createdAt: new Date().toISOString(),
    });
  }
}

export async function signInWithEmail(
  email: string,
  password: string
): Promise<UserCredential> {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signUpWithEmail(
  email: string,
  password: string,
  fullName: string
): Promise<UserCredential> {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const { uid } = credential.user;

  await setDoc(doc(db, "users", uid), {
    fullName,
    email,
    createdAt: new Date().toISOString(),
  });

  return credential;
}

export async function signInWithGoogle(): Promise<UserCredential> {
  const provider = new GoogleAuthProvider();
  const credential = await signInWithPopup(auth, provider);
  const { uid, displayName, email } = credential.user;
  await ensureUserDoc(uid, {
    fullName: displayName || "Kullanıcı",
    email: email || "",
  });
  return credential;
}

export async function signOut(): Promise<void> {
  return firebaseSignOut(auth);
}
