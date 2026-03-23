import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TestimonialForm from "@/components/forms/TestimonialForm";

export const metadata = {
    title: "Share Your POV - Ryovax",
    description: "Share positive or negative feedback so we can improve your experience.",
};

export default function TestimonialPage() {
    return (
        <main className="min-h-screen bg-slate-50">
            <Navbar />

            <section className="pt-28 sm:pt-32 md:pt-40 pb-12 sm:pb-24">
                <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
                    <div className="text-center mb-10 sm:mb-12">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4 sm:mb-6">
                            Share your POV
                        </h1>
                        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
                            We welcome both positive and negative reviews. Use the form below and choose your review type.
                        </p>
                    </div>

                    <div className="bg-white p-6 sm:p-10 md:p-12 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100">
                        <TestimonialForm />
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
