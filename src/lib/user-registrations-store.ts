import { getAdminFirestore } from "@/lib/firebase-admin";
import type { FirestoreQueryDoc } from "@/lib/firestore-query-doc";
import { serverTimestampField } from "@/lib/firestore-timestamps";
import { FIRESTORE } from "@/lib/firestore-collections";

export type UserRegistrationRole = "buyer" | "supplier";
export type UserRegistrationStatus = "pending" | "approved" | "rejected";

export type UserRegistration = {
    id: string;
    companyName: string;
    firstName?: string;
    lastName?: string;
    email: string;
    role: UserRegistrationRole;
    status: UserRegistrationStatus;
    createdAt: string;
    updatedAt?: string;
};

/** Server-only auth shape (password hash never exposed to clients). */
export type AuthUserRegistration = UserRegistration & { passwordHash: string };

const col = () => {
    const db = getAdminFirestore();
    if (!db) return null;
    return db.collection(FIRESTORE.userRegistrations);
};

function formatFirestoreDate(d: unknown): string {
    if (d != null && typeof d === "object" && "toDate" in d && typeof (d as { toDate: () => Date }).toDate === "function") {
        try {
            return (d as { toDate: () => Date }).toDate().toISOString();
        } catch {
            /* ignore */
        }
    }
    return String(d ?? new Date().toISOString());
}

function docToUser(id: string, data: Record<string, unknown>): UserRegistration {
    return {
        id,
        companyName: String(data.companyName ?? ""),
        firstName: data.firstName != null ? String(data.firstName) : undefined,
        lastName: data.lastName != null ? String(data.lastName) : undefined,
        email: String(data.email ?? ""),
        role: data.role === "supplier" ? "supplier" : "buyer",
        status:
            data.status === "approved" ? "approved" : data.status === "rejected" ? "rejected" : "pending",
        createdAt: formatFirestoreDate(data.createdAt),
        updatedAt: data.updatedAt != null ? formatFirestoreDate(data.updatedAt) : undefined,
    };
}

export async function listUserRegistrations(): Promise<UserRegistration[]> {
    const c = col();
    if (!c) return [];
    let snap;
    try {
        snap = await c.get();
    } catch {
        return [];
    }
    const out: UserRegistration[] = [];
    snap.forEach((doc: FirestoreQueryDoc) =>
        out.push(docToUser(doc.id, doc.data() as Record<string, unknown>)),
    );
    out.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return out;
}

export async function listRecentUserRegistrations(limit: number): Promise<UserRegistration[]> {
    const all = await listUserRegistrations();
    return all.slice(0, limit);
}

export async function setUserRegistrationStatus(
    id: string,
    status: "approved" | "rejected",
): Promise<{ ok: true } | { ok: false; error: string }> {
    const c = col();
    if (!c) return { ok: false, error: "Firebase is not configured" };
    const ref = c.doc(id);
    let snap;
    try {
        snap = await ref.get();
    } catch {
        return { ok: false, error: "Could not update status right now." };
    }
    if (!snap.exists) return { ok: false, error: "Not found" };
    try {
        await ref.update({
            status,
            updatedAt: serverTimestampField(),
        });
    } catch {
        return { ok: false, error: "Could not update status right now." };
    }
    return { ok: true };
}

export async function countUserRegistrations(): Promise<number> {
    const c = col();
    if (!c) return 0;
    try {
        const snap = await c.count().get();
        return snap.data().count;
    } catch {
        return 0;
    }
}

export async function countPendingUserRegistrations(): Promise<number> {
    const c = col();
    if (!c) return 0;
    try {
        const snap = await c.where("status", "==", "pending").count().get();
        return snap.data().count;
    } catch {
        return 0;
    }
}

export async function countApprovedUserRegistrationsByRole(role: UserRegistrationRole): Promise<number> {
    const c = col();
    if (!c) return 0;
    try {
        const snap = await c.where("role", "==", role).where("status", "==", "approved").count().get();
        return snap.data().count;
    } catch {
        return 0;
    }
}

export async function countUserRegistrationsByRoleAndStatus(
    role: UserRegistrationRole,
    status: UserRegistrationStatus,
): Promise<number> {
    const c = col();
    if (!c) return 0;
    try {
        const snap = await c.where("role", "==", role).where("status", "==", status).count().get();
        return snap.data().count;
    } catch {
        return 0;
    }
}

/** UI row for admin approval tables */
export type UserApprovalRow = {
    id: string;
    name: string;
    role: "Supplier" | "Buyer";
    status: "Pending" | "Approved" | "Rejected";
};

export function userRegistrationToApprovalRow(u: UserRegistration): UserApprovalRow {
    return {
        id: u.id,
        name: u.companyName,
        role: u.role === "supplier" ? "Supplier" : "Buyer",
        status:
            u.status === "pending" ? "Pending" : u.status === "approved" ? "Approved" : "Rejected",
    };
}

function normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
}

/**
 * Server-only: load registration for login (includes password hash). Never send to the client.
 */
export async function getRegistrationByEmailForAuth(email: string): Promise<AuthUserRegistration | null> {
    const c = col();
    if (!c) return null;
    let q;
    try {
        q = await c.where("email", "==", normalizeEmail(email)).limit(1).get();
    } catch {
        return null;
    }
    if (q.empty) return null;
    const doc = q.docs[0]!;
    const data = doc.data() as Record<string, unknown>;
    const passwordHash = String(data.passwordHash ?? "");
    if (!passwordHash) return null;
    const base = docToUser(doc.id, data);
    return { ...base, passwordHash };
}

export type CreatePendingRegistrationInput = {
    email: string;
    companyName: string;
    firstName: string;
    lastName: string;
    role: UserRegistrationRole;
    passwordHash: string;
};

export async function createPendingRegistration(
    input: CreatePendingRegistrationInput,
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
    const c = col();
    if (!c) {
        return {
            ok: false,
            error:
                "Registration is unavailable because Firebase Admin is not configured. Set FIREBASE_SERVICE_ACCOUNT_JSON (recommended) or GOOGLE_APPLICATION_CREDENTIALS.",
        };
    }

    const email = normalizeEmail(input.email);
    const existing = await c.where("email", "==", email).limit(1).get();
    if (!existing.empty) {
        return { ok: false, error: "An account with this email already exists. Try signing in." };
    }

    const ref = await c.add({
        email,
        companyName: input.companyName.trim(),
        firstName: input.firstName.trim(),
        lastName: input.lastName.trim(),
        role: input.role,
        status: "pending",
        passwordHash: input.passwordHash,
        createdAt: serverTimestampField(),
    }).catch(() => null);

    if (!ref) return { ok: false, error: "Could not create registration right now." };

    return { ok: true, id: ref.id };
}
