import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
        const { getAdminFirestore } = await import("@/lib/firebase-admin");
        const db = getAdminFirestore();
        firebaseInitOk = !!db;
    } catch (e) {
        firebaseInitOk = false;
        firebaseInitError = e instanceof Error ? e.name : "Unknown error";
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
                googleCredentialsPathConfigured,
            },
        },
        { status: 200 },
    );
}

