import { MessageSquareQuote } from "lucide-react";
import AdminTestimonialsQueue from "@/components/admin/AdminTestimonialsQueue";
import { readTestimonials } from "@/lib/testimonials-store";

export default async function AdminTestimonialsPage() {
    const data = await readTestimonials();
    const pending = [...data.pending].sort(
        (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
    );

    return (
        <div className="space-y-8">
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
