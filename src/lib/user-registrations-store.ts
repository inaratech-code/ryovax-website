import { FieldValue } from "firebase-admin/firestore";
import { getAdminFirestore } from "@/lib/firebase-admin";
import { FIRESTORE } from "@/lib/firestore-collections";

export type UserRegistrationRole = "buyer" | "supplier";
export type UserRegistrationStatus = "pending" | "approved" | "rejected";

export type UserRegistration = {
    id: string;
    companyName: string;
    email: string;
    role: UserRegistrationRole;
    status: UserRegistrationStatus;
    createdAt: string;
    updatedAt?: string;
};

const col = () => {
    const db = getAdminFirestore();
    if (!db) return null;
    return db.collection(FIRESTORE.userRegistrations);
};

function docToUser(id: string, data: Record<string, unknown>): UserRegistration {
    return {
        id,
        companyName: String(data.companyName ?? ""),
        email: String(data.email ?? ""),
        role: data.role === "supplier" ? "supplier" : "buyer",
        status:
            data.status === "approved" ? "approved" : data.status === "rejected" ? "rejected" : "pending",
        createdAt: String(data.createdAt ?? new Date().toISOString()),
        updatedAt: data.updatedAt != null ? String(data.updatedAt) : undefined,
    };
}

export async function listUserRegistrations(): Promise<UserRegistration[]> {
    const c = col();
    if (!c) return [];
    const snap = await c.get();
    const out: UserRegistration[] = [];
    snap.forEach((doc) => out.push(docToUser(doc.id, doc.data() as Record<string, unknown>)));
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
    const snap = await ref.get();
    if (!snap.exists) return { ok: false, error: "Not found" };
    await ref.update({
        status,
        updatedAt: FieldValue.serverTimestamp(),
    });
    return { ok: true };
}

export async function countUserRegistrations(): Promise<number> {
    const c = col();
    if (!c) return 0;
    const snap = await c.count().get();
    return snap.data().count;
}

export async function countPendingUserRegistrations(): Promise<number> {
    const c = col();
    if (!c) return 0;
    const snap = await c.where("status", "==", "pending").count().get();
    return snap.data().count;
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
