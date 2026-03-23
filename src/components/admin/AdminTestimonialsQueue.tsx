"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { approveTestimonial, rejectTestimonial } from "@/app/admin/testimonials/actions";
import type { PendingSubmission } from "@/lib/testimonials-store";

export default function AdminTestimonialsQueue({ initialPending }: { initialPending: PendingSubmission[] }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    function handleApprove(id: string) {
        startTransition(() => {
            void (async () => {
                await approveTestimonial(id);
                router.refresh();
            })();
        });
    }

    function handleReject(id: string) {
        startTransition(() => {
            void (async () => {
                await rejectTestimonial(id);
                router.refresh();
            })();
        });
    }

    if (initialPending.length === 0) {
        return (
            <p className="text-slate-600 text-sm py-4">
                No POV submissions waiting for review. New submissions appear here until you approve or reject them.
            </p>
        );
    }

    return (
        <ul className="divide-y divide-slate-100">
            {initialPending.map((p) => (
                <li key={p.id} className="py-5 first:pt-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="min-w-0 space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                                <span
                                    className={
                                        p.reviewType === "positive"
                                            ? "text-xs font-semibold uppercase tracking-wide text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded"
                                            : "text-xs font-semibold uppercase tracking-wide text-amber-800 bg-amber-50 px-2 py-0.5 rounded"
                                    }
                                >
                                    {p.reviewType === "positive" ? "Positive" : "Negative"}
                                </span>
                                <span className="text-xs text-slate-500">
                                    {new Date(p.submittedAt).toLocaleString()}
                                </span>
                            </div>
                            <p className="font-semibold text-slate-900">{p.name}</p>
                            <p className="text-sm text-slate-600">
                                {p.email} · {p.company}
                            </p>
                            {p.rating != null && (
                                <p className="text-sm text-slate-600">Rating: {p.rating}/5</p>
                            )}
                            {p.issueType != null && (
                                <p className="text-sm text-slate-600">Issue: {p.issueType}</p>
                            )}
                            <blockquote className="text-slate-800 text-sm border-l-2 border-slate-200 pl-3 mt-2 whitespace-pre-wrap">
                                {p.message}
                            </blockquote>
                        </div>
                        <div className="flex shrink-0 gap-2">
                            <button
                                type="button"
                                disabled={isPending}
                                onClick={() => handleApprove(p.id)}
                                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium disabled:opacity-50"
                            >
                                Approve
                            </button>
                            <button
                                type="button"
                                disabled={isPending}
                                onClick={() => handleReject(p.id)}
                                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-800 text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
}
