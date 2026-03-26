import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { initializeFirestore, type Firestore } from "firebase-admin/firestore";

let cachedDb: Firestore | undefined;
let lastInitError: string | null = null;

export function getLastFirebaseAdminInitError(): string | null {
    return lastInitError;
}

export function isFirebaseConfigured(): boolean {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim()) return true;
    // Local dev: ADC file path. Production serverless (e.g. Cloudflare) has no key file — use FIREBASE_SERVICE_ACCOUNT_JSON secret.
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim()) return false;
    if (process.env.NODE_ENV === "production") {
        return process.env.FIREBASE_ALLOW_GOOGLE_APPLICATION_CREDENTIALS_IN_PRODUCTION === "true";
    }
    return true;
}

/**
 * Returns Firestore when Firebase Admin is configured; otherwise `null` (e.g. CI build without secrets).
 * Set `FIREBASE_SERVICE_ACCOUNT_JSON`, or optionally a readable file path via `GOOGLE_APPLICATION_CREDENTIALS`.
 */
export function getAdminFirestore(): Firestore | null {
    if (!isFirebaseConfigured()) return null;
    if (cachedDb) return cachedDb;

    const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
    lastInitError = null;
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

        // Cloudflare Workers/OpenNext: gRPC often fails; REST transport is safer.
        const preferRest = process.env.FIRESTORE_PREFER_REST !== "false";
        cachedDb = initializeFirestore(app, { preferRest });
        return cachedDb;
    } catch (e) {
        lastInitError = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
        // Runtime credentials/parsing issue: expose as "not configured" to callers.
        return null;
    }
}
