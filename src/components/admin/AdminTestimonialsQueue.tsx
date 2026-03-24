"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { approveTestimonial, deletePendingTestimonial, rejectTestimonial } from "@/app/admin/(dashboard)/testimonials/actions";
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

    function handleDelete(id: string) {
        startTransition(() => {
            void (async () => {
                await deletePendingTestimonial(id);
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
        <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] text-sm text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                        <th className="px-4 py-3 whitespace-nowrap">Type</th>
                        <th className="px-4 py-3 whitespace-nowrap">Submitted</th>
                        <th className="px-4 py-3 whitespace-nowrap">Name</th>
                        <th className="px-4 py-3 min-w-[200px]">Email · Company</th>
                        <th className="px-4 py-3 whitespace-nowrap">Rating / issue</th>
                        <th className="px-4 py-3 min-w-[220px]">Message</th>
                        <th className="px-4 py-3 text-right whitespace-nowrap w-[1%]">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {initialPending.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/80 transition-colors align-top">
                            <td className="px-4 py-4">
                                <span
                                    className={
                                        p.reviewType === "positive"
                                            ? "inline-block text-xs font-semibold uppercase tracking-wide text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded"
                                            : "inline-block text-xs font-semibold uppercase tracking-wide text-amber-800 bg-amber-50 px-2 py-0.5 rounded"
                                    }
                                >
                                    {p.reviewType === "positive" ? "Positive" : "Negative"}
                                </span>
                            </td>
                            <td className="px-4 py-4 text-slate-500 whitespace-nowrap">
                                {new Date(p.submittedAt).toLocaleString()}
                            </td>
                            <td className="px-4 py-4 font-semibold text-slate-900">{p.name}</td>
                            <td className="px-4 py-4 text-slate-600">
                                <span className="text-slate-800">{p.email}</span>
                                <span className="text-slate-400 mx-1">·</span>
                                <span>{p.company}</span>
                            </td>
                            <td className="px-4 py-4 text-slate-600 whitespace-nowrap">
                                {p.rating != null && <span>Rating: {p.rating}/5</span>}
                                {p.rating == null && p.issueType != null && <span>Issue: {p.issueType}</span>}
                                {p.rating == null && p.issueType == null && (
                                    <span className="text-slate-400">N/A</span>
                                )}
                            </td>
                            <td className="px-4 py-4 text-slate-800">
                                <p className="line-clamp-3 max-w-md" title={p.message}>
                                    {p.message}
                                </p>
                            </td>
                            <td className="px-4 py-4">
                                <div className="flex flex-wrap items-center justify-end gap-2">
                                    <button
                                        type="button"
                                        disabled={isPending}
                                        onClick={() => handleApprove(p.id)}
                                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold disabled:opacity-50"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        type="button"
                                        disabled={isPending}
                                        onClick={() => handleReject(p.id)}
                                        className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-800 text-xs font-semibold hover:bg-slate-50 disabled:opacity-50"
                                    >
                                        Reject
                                    </button>
                                    <button
                                        type="button"
                                        disabled={isPending}
                                        onClick={() => handleDelete(p.id)}
                                        className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 disabled:opacity-50"
                                        aria-label="Delete submission"
                                        title="Delete submission"
                                    >
                                        <Trash2 size={18} strokeWidth={2} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
