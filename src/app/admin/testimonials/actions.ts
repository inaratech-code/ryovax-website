"use server";

import {
    pendingToApproved,
    readTestimonials,
    writeTestimonials,
} from "@/lib/testimonials-store";

export async function approveTestimonial(id: string) {
    const data = await readTestimonials();
    const idx = data.pending.findIndex((p) => p.id === id);
    if (idx === -1) return { ok: false as const, error: "Not found" };

    const [pending] = data.pending.splice(idx, 1);
    const approved = pendingToApproved(pending);
    const existingIdx = data.approved.findIndex((a) => a.id === id);
    if (existingIdx >= 0) {
        data.approved[existingIdx] = approved;
    } else {
        data.approved.push(approved);
    }
    await writeTestimonials(data);
    return { ok: true as const };
}

export async function rejectTestimonial(id: string) {
    const data = await readTestimonials();
    const next = data.pending.filter((p) => p.id !== id);
    if (next.length === data.pending.length) return { ok: false as const, error: "Not found" };
    data.pending = next;
    await writeTestimonials(data);
    return { ok: true as const };
}
