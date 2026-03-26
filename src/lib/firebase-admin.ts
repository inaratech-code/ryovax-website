import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let cachedDb: Firestore | undefined;

export function isFirebaseConfigured(): boolean {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim()) return true;
    // Keep fallback for local environments using ADC file credentials.
    return !!process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim();
}

/**
 * Returns Firestore when Firebase Admin is configured; otherwise `null` (e.g. CI build without secrets).
 * Set `FIREBASE_SERVICE_ACCOUNT_JSON`, or optionally a readable file path via `GOOGLE_APPLICATION_CREDENTIALS`.
 */
export function getAdminFirestore(): Firestore | null {
    if (!isFirebaseConfigured()) return null;
    if (cachedDb) return cachedDb;

    const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
    try {
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
    } catch {
        // Runtime credentials/parsing issue: expose as "not configured" to callers.
        return null;
    }
}
