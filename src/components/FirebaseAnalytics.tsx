"use client";

import { useEffect } from "react";
import { getApps, initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getPublicFirebaseConfig } from "@/lib/firebase-client";

/**
 * Initializes Firebase App + Google Analytics in the browser only.
 * No-op if NEXT_PUBLIC_FIREBASE_* vars are missing.
 */
export default function FirebaseAnalytics() {
    useEffect(() => {
        const config = getPublicFirebaseConfig();
        if (!config) return;

        const app = getApps().length > 0 ? getApps()[0]! : initializeApp(config);

        void (async () => {
            try {
                if (await isSupported()) {
                    getAnalytics(app);
                }
            } catch {
                /* Analytics unavailable (e.g. blocked, unsupported) */
            }
        })();
    }, []);

    return null;
}
