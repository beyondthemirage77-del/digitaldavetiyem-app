/* eslint-disable no-var */
import type { App } from "firebase-admin/app";
import type { Auth } from "firebase-admin/auth";
import type { Firestore } from "firebase-admin/firestore";
import type { Storage } from "firebase-admin/storage";

declare global {
  var firebaseAdminApp: App | undefined;
  var adminDb: Firestore | undefined;
  var adminAuth: Auth | undefined;
  var adminStorage: Storage | undefined;
}

export async function getFirebaseAdmin(): Promise<{
  app: App;
  adminDb: Firestore;
  adminAuth: Auth;
  adminStorage: Storage;
}> {
  if (
    globalThis.firebaseAdminApp &&
    globalThis.adminDb &&
    globalThis.adminAuth &&
    globalThis.adminStorage
  ) {
    return {
      app: globalThis.firebaseAdminApp,
      adminDb: globalThis.adminDb,
      adminAuth: globalThis.adminAuth,
      adminStorage: globalThis.adminStorage,
    };
  }

  const { initializeApp, getApps, cert } = await import("firebase-admin/app");
  const { getFirestore } = await import("firebase-admin/firestore");
  const { getAuth } = await import("firebase-admin/auth");
  const { getStorage } = await import("firebase-admin/storage");

  if (getApps().length === 0) {
    const app = initializeApp({
      credential: cert({
        projectId:
          process.env.FIREBASE_ADMIN_PROJECT_ID ||
          process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(
          /\\n/g,
          "\n"
        ),
      }),
    });
    globalThis.firebaseAdminApp = app;
    globalThis.adminDb = getFirestore(app);
    globalThis.adminAuth = getAuth(app);
    globalThis.adminStorage = getStorage(app);
  }

  return {
    app: globalThis.firebaseAdminApp!,
    adminDb: globalThis.adminDb!,
    adminAuth: globalThis.adminAuth!,
    adminStorage: globalThis.adminStorage!,
  };
}
