import { MessageSquareQuote } from "lucide-react";
import AdminTestimonialsQueue from "@/components/admin/AdminTestimonialsQueue";

export default async function AdminTestimonialsPage() {
    let loadError = "";
    let pending: any[] = [];

    try {
        const { readTestimonials } = await import("@/lib/testimonials-store");
        const data = await readTestimonials();
        pending = [...data.pending].sort(
            (a: any, b: any) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
        );
    } catch {
        loadError =
            "Testimonials data could not be loaded. Check Firebase admin runtime secrets and redeploy.";
    }

    return (
        <div className="space-y-8">
            {loadError ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-900 text-sm">
                    {loadError}
                </div>
            ) : null}

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2 sm:gap-3">
                <MessageSquareQuote className="text-blue-700 shrink-0 w-7 h-7 sm:w-8 sm:h-8" />
                <span>POV & testimonials</span>
            </h1>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <p className="text-slate-600 text-sm">
                        Submissions from <span className="font-medium text-slate-800">Share your POV</span> stay
                        pending until you approve them. Only approved entries appear on the homepage carousel.
                    </p>
                </div>
                <div className="p-6">
                    <AdminTestimonialsQueue initialPending={pending} />
                </div>
            </div>
        </div>
    );
}
