import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function truncate(s: string, max: number): string {
    if (s.length <= max) return s;
    return `${s.slice(0, max)}…`;
}

export async function GET() {
    const adminPanelEnabled = process.env.ADMIN_PANEL_ENABLED?.trim() === "true";
    const adminPasswordConfigured = !!process.env.ADMIN_PASSWORD?.trim();
    const adminSessionSecretLength = process.env.ADMIN_SESSION_SECRET?.trim().length ?? 0;
    const firebaseJsonConfigured = !!process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
    const googleCredentialsPathConfigured = !!process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim();

    let firebaseJsonParseOk = false;
    let firebaseJsonParseError = "";
    if (firebaseJsonConfigured) {
        try {
            JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON as string);
            firebaseJsonParseOk = true;
        } catch (e) {
            firebaseJsonParseOk = false;
            firebaseJsonParseError = e instanceof Error ? e.name : "Unknown error";
        }
    }

    let firebaseInitOk = false;
    let firebaseInitError = "";
    try {
        const { getAdminFirestore, getLastFirebaseAdminInitError } = await import("@/lib/firebase-admin");
        const db = getAdminFirestore();
        firebaseInitOk = !!db;
        if (!firebaseInitOk) {
            const detail = getLastFirebaseAdminInitError();
            firebaseInitError = detail ? truncate(detail, 500) : "getAdminFirestore returned null";
        }
    } catch (e) {
        firebaseInitOk = false;
        firebaseInitError = truncate(e instanceof Error ? `${e.name}: ${e.message}` : String(e), 500);
    }

    return NextResponse.json(
        {
            ok: true,
            checks: {
                nodeEnv: process.env.NODE_ENV ?? "unknown",
                adminPanelEnabled,
                adminPasswordConfigured,
                adminSessionSecretConfigured: adminSessionSecretLength >= 16,
                adminSessionSecretLength,
                firebaseJsonConfigured,
                firebaseJsonParseOk,
                firebaseJsonParseError,
                firebaseInitOk,
                firebaseInitError,
                firestorePreferRest: process.env.FIRESTORE_PREFER_REST !== "false",
                googleCredentialsPathConfigured,
            },
        },
        { status: 200 },
    );
}

