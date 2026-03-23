"use client";

import { useState } from "react";

type ReviewType = "positive" | "negative";

export default function TestimonialForm() {
    const [reviewType, setReviewType] = useState<ReviewType>("positive");
    const [sent, setSent] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        const form = e.currentTarget;
        const fd = new FormData(form);
        const name = String(fd.get("name") ?? "").trim();
        const email = String(fd.get("email") ?? "").trim();
        const company = String(fd.get("company") ?? "").trim();
        const message = String(fd.get("message") ?? "").trim();
        const payload: Record<string, string> = {
            reviewType,
            name,
            email,
            company,
            message,
        };
        if (reviewType === "positive") {
            payload.rating = String(fd.get("rating") ?? "5");
        } else {
            payload.issueType = String(fd.get("issueType") ?? "other");
        }

        setSubmitting(true);
        try {
            const res = await fetch("/api/testimonials", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = (await res.json().catch(() => ({}))) as { error?: string };
            if (!res.ok) {
                setError(data.error ?? "Something went wrong. Please try again.");
                return;
            }
            setSent(true);
            form.reset();
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    if (sent) {
        return (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
                <p className="text-lg font-semibold text-emerald-900 mb-2">Review submitted</p>
                <p className="text-emerald-800 text-sm">
                    Thanks for sharing your feedback. Our team will review it shortly.
                </p>
                <button
                    type="button"
                    onClick={() => {
                        setSent(false);
                        setError(null);
                    }}
                    className="mt-6 text-sm font-medium text-blue-700 hover:text-blue-800 underline"
                >
                    Submit another review
                </button>
            </div>
        );
    }

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
                <p className="block text-sm font-medium text-slate-700 mb-3">Review type</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 cursor-pointer">
                        <input
                            type="radio"
                            name="reviewType"
                            value="positive"
                            checked={reviewType === "positive"}
                            onChange={() => setReviewType("positive")}
                            className="accent-blue-700"
                        />
                        <span className="text-sm font-medium text-slate-700">Positive review</span>
                    </label>
                    <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 cursor-pointer">
                        <input
                            type="radio"
                            name="reviewType"
                            value="negative"
                            checked={reviewType === "negative"}
                            onChange={() => setReviewType("negative")}
                            className="accent-blue-700"
                        />
                        <span className="text-sm font-medium text-slate-700">Negative review</span>
                    </label>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="tr-name" className="block text-sm font-medium text-slate-700 mb-2">
                        Full Name
                    </label>
                    <input
                        id="tr-name"
                        name="name"
                        required
                        type="text"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none"
                        placeholder="Your name"
                    />
                </div>
                <div>
                    <label htmlFor="tr-email" className="block text-sm font-medium text-slate-700 mb-2">
                        Company Email
                    </label>
                    <input
                        id="tr-email"
                        name="email"
                        required
                        type="email"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none"
                        placeholder="you@company.com"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="tr-company" className="block text-sm font-medium text-slate-700 mb-2">
                    Company
                </label>
                <input
                    id="tr-company"
                    name="company"
                    required
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none"
                    placeholder="Your company name"
                />
            </div>

            {reviewType === "positive" ? (
                <>
                    <div>
                        <label htmlFor="tr-rating" className="block text-sm font-medium text-slate-700 mb-2">
                            Rating
                        </label>
                        <select
                            id="tr-rating"
                            name="rating"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none bg-white"
                            defaultValue="5"
                        >
                            <option value="5">5 - Excellent</option>
                            <option value="4">4 - Very good</option>
                            <option value="3">3 - Good</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="tr-positive-message" className="block text-sm font-medium text-slate-700 mb-2">
                            What went well?
                        </label>
                        <textarea
                            id="tr-positive-message"
                            name="message"
                            required
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none resize-none"
                            placeholder="Tell us what you liked..."
                        />
                    </div>
                </>
            ) : (
                <>
                    <div>
                        <label htmlFor="tr-issue-type" className="block text-sm font-medium text-slate-700 mb-2">
                            Issue type
                        </label>
                        <select
                            id="tr-issue-type"
                            name="issueType"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none bg-white"
                            defaultValue="service"
                        >
                            <option value="service">Service quality</option>
                            <option value="timeline">Timeline / delivery</option>
                            <option value="communication">Communication</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="tr-negative-message" className="block text-sm font-medium text-slate-700 mb-2">
                            What should be improved?
                        </label>
                        <textarea
                            id="tr-negative-message"
                            name="message"
                            required
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none resize-none"
                            placeholder="Share the issue and how we can improve..."
                        />
                    </div>
                </>
            )}

            {error && (
                <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3" role="alert">
                    {error}
                </p>
            )}

            <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white rounded-xl font-bold transition-all shadow-md"
            >
                {submitting ? "Submitting…" : "Submit review"}
            </button>
        </form>
    );
}
