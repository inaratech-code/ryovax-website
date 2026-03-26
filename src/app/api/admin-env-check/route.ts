import { NextResponse } from "next/server";
import { parseFirebaseServiceAccountJson } from "@/lib/firebase-admin";

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
        const parsed = parseFirebaseServiceAccountJson(process.env.FIREBASE_SERVICE_ACCOUNT_JSON as string);
        firebaseJsonParseOk = parsed.ok;
        firebaseJsonParseError = parsed.ok ? "" : truncate(parsed.error, 240);
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

