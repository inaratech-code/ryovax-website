import { existsSync } from "node:fs";
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let cachedDb: Firestore | undefined;

/**
 * Set `FIREBASE_USE_GOOGLE_CREDENTIALS_FILE=false` in `.env.local` if you only use
 * `FIREBASE_SERVICE_ACCOUNT_JSON` but still have `GOOGLE_APPLICATION_CREDENTIALS` set (e.g. globally on Windows).
 */
function hasUsableGoogleApplicationCredentials(): boolean {
    const optOut = process.env.FIREBASE_USE_GOOGLE_CREDENTIALS_FILE?.trim().toLowerCase();
    if (optOut === "false" || optOut === "0") return false;

    const p = process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim();
    if (!p) return false;
    try {
        return existsSync(p);
    } catch {
        return false;
    }
}

export function isFirebaseConfigured(): boolean {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim()) return true;
    return hasUsableGoogleApplicationCredentials();
}

/**
 * Returns Firestore when Firebase Admin is configured; otherwise `null` (e.g. CI build without secrets).
 * Set `FIREBASE_SERVICE_ACCOUNT_JSON`, or optionally a readable file path via `GOOGLE_APPLICATION_CREDENTIALS`.
 */
export function getAdminFirestore(): Firestore | null {
    if (!isFirebaseConfigured()) return null;
    if (cachedDb) return cachedDb;

    const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
    let app: App;
    if (!getApps().length) {
        if (json) {
            app = initializeApp({ credential: cert(JSON.parse(json)) });
        } else {
            app = initializeApp();
        }
    } else {
        app = getApps()[0]!;
    }

    cachedDb = getFirestore(app);
    return cachedDb;
}
