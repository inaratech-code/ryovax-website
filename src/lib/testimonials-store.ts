import { FieldValue, type DocumentData } from "firebase-admin/lib/firestore/index.js";
import { getAdminFirestore } from "@/lib/firebase-admin";
import { FIRESTORE } from "@/lib/firestore-collections";

export type PendingSubmission = {
    id: string;
    reviewType: "positive" | "negative";
    name: string;
    email: string;
    company: string;
    message: string;
    rating?: string;
    issueType?: string;
    submittedAt: string;
};

export type ApprovedTestimonial = {
    id: string;
    text: string;
    author: string;
    role: string;
    company: string;
    approvedAt: string;
};

export type TestimonialsData = {
    pending: PendingSubmission[];
    approved: ApprovedTestimonial[];
};

const col = () => {
    const db = getAdminFirestore();
    if (!db) return null;
    return db.collection(FIRESTORE.testimonialSubmissions);
};

function docToPending(id: string, data: DocumentData): PendingSubmission {
    return {
        id,
        reviewType: data.reviewType === "negative" ? "negative" : "positive",
        name: String(data.name ?? ""),
        email: String(data.email ?? ""),
        company: String(data.company ?? ""),
        message: String(data.message ?? ""),
        rating: data.rating != null ? String(data.rating) : undefined,
        issueType: data.issueType != null ? String(data.issueType) : undefined,
        submittedAt: String(data.submittedAt ?? new Date().toISOString()),
    };
}

function docToApproved(id: string, data: DocumentData): ApprovedTestimonial {
    return {
        id,
        text: String(data.text ?? data.message ?? ""),
        author: String(data.author ?? data.name ?? ""),
        role: String(data.role ?? ""),
        company: String(data.company ?? ""),
        approvedAt: String(data.approvedAt ?? new Date().toISOString()),
    };
}

export async function readTestimonials(): Promise<TestimonialsData> {
    const c = col();
    if (!c) return { pending: [], approved: [] };
    const [pendingSnap, approvedSnap] = await Promise.all([
        c.where("status", "==", "pending").get(),
        c.where("status", "==", "approved").get(),
    ]);

    const pending: PendingSubmission[] = [];
    pendingSnap.forEach((doc) => {
        pending.push(docToPending(doc.id, doc.data()));
    });

    const approved: ApprovedTestimonial[] = [];
    approvedSnap.forEach((doc) => {
        approved.push(docToApproved(doc.id, doc.data()));
    });

    approved.sort((a, b) => new Date(b.approvedAt).getTime() - new Date(a.approvedAt).getTime());
    pending.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

    return { pending, approved };
}

/** @deprecated Prefer addPendingSubmission; kept for any legacy callers */
export async function writeTestimonials(data: TestimonialsData): Promise<void> {
    const db = getAdminFirestore();
    const c = col();
    if (!db || !c) throw new Error("Firebase is not configured");
    const batch = db.batch();
    const existing = await c.get();
    existing.forEach((doc) => batch.delete(doc.ref));

    for (const p of data.pending) {
        batch.set(c.doc(p.id), {
            status: "pending",
            reviewType: p.reviewType,
            name: p.name,
            email: p.email,
            company: p.company,
            message: p.message,
            rating: p.rating ?? null,
            issueType: p.issueType ?? null,
            submittedAt: p.submittedAt,
            updatedAt: FieldValue.serverTimestamp(),
        });
    }
    for (const a of data.approved) {
        batch.set(c.doc(a.id), {
            status: "approved",
            text: a.text,
            author: a.author,
            role: a.role,
            company: a.company,
            approvedAt: a.approvedAt,
            submittedAt: a.approvedAt,
            updatedAt: FieldValue.serverTimestamp(),
        });
    }
    await batch.commit();
}

export function newId(): string {
    return `pov-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function pendingToApproved(p: PendingSubmission): ApprovedTestimonial {
    const role =
        p.reviewType === "negative"
            ? p.issueType
                ? `${p.issueType.replace(/^\w/, (c) => c.toUpperCase())} feedback`
                : "Feedback"
            : "Customer";
    return {
        id: p.id,
        text: p.message,
        author: p.name,
        role,
        company: p.company,
        approvedAt: new Date().toISOString(),
    };
}

export async function addPendingSubmission(p: PendingSubmission): Promise<void> {
    const c = col();
    if (!c) throw new Error("Firebase is not configured");
    await c
        .doc(p.id)
        .set({
            status: "pending",
            reviewType: p.reviewType,
            name: p.name,
            email: p.email,
            company: p.company,
            message: p.message,
            rating: p.rating ?? null,
            issueType: p.issueType ?? null,
            submittedAt: p.submittedAt,
            updatedAt: FieldValue.serverTimestamp(),
        });
}

export async function approvePendingById(id: string): Promise<{ ok: true } | { ok: false; error: string }> {
    const c = col();
    if (!c) return { ok: false, error: "Firebase is not configured" };
    const ref = c.doc(id);
    const snap = await ref.get();
    if (!snap.exists) return { ok: false, error: "Not found" };
    const data = snap.data()!;
    if (data.status !== "pending") return { ok: false, error: "Not pending" };
    const pending = docToPending(id, data);
    const approved = pendingToApproved(pending);
    await ref.set(
        {
            status: "approved",
            text: approved.text,
            author: approved.author,
            role: approved.role,
            company: approved.company,
            approvedAt: approved.approvedAt,
            submittedAt: pending.submittedAt,
            reviewType: pending.reviewType,
            updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: false },
    );
    return { ok: true };
}

export async function deletePendingById(id: string): Promise<{ ok: true } | { ok: false; error: string }> {
    const c = col();
    if (!c) return { ok: false, error: "Firebase is not configured" };
    const ref = c.doc(id);
    const snap = await ref.get();
    if (!snap.exists) return { ok: false, error: "Not found" };
    const data = snap.data()!;
    if (data.status !== "pending") return { ok: false, error: "Not pending" };
    await ref.delete();
    return { ok: true };
}
