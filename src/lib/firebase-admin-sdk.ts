import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { initializeFirestore, type Firestore } from "firebase-admin/firestore";

let cachedDb: Firestore | undefined;

/**
 * Node / local dev: Firebase Admin SDK (gRPC or REST via preferRest).
 * Not loaded on Cloudflare Workers when using Firestore REST instead.
 */
export function getSdkFirestore(): Firestore | null {
    const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
    if (!json) {
        if (!process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim()) return null;
        if (process.env.NODE_ENV === "production") {
            if (process.env.FIREBASE_ALLOW_GOOGLE_APPLICATION_CREDENTIALS_IN_PRODUCTION !== "true") {
                return null;
            }
        }
    }

    if (cachedDb) return cachedDb;

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

    const preferRest = process.env.FIRESTORE_PREFER_REST !== "false";
    cachedDb = initializeFirestore(app, { preferRest });
    return cachedDb;
}
