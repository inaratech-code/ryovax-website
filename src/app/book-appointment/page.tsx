import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BookAppointmentForm from "@/components/appointments/BookAppointmentForm";

export const metadata = {
    title: "Book an appointment - Ryovax",
    description: "Schedule a call with Ryovax. Choose your local time; we store it in UTC.",
};

export default function BookAppointmentPage() {
    return (
        <main className="min-h-screen bg-slate-50">
            <Navbar />
            <section className="pt-28 sm:pt-32 md:pt-40 pb-16 sm:pb-24">
                <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
                    <div className="text-center mb-10 sm:mb-12">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
                            Book an appointment
                        </h1>
                        <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
                            Pick a time that works for you, or share your availability window. We store times in UTC and
                            show you your local timezone so nothing gets lost across regions.
                        </p>
                    </div>
                    <BookAppointmentForm />
                </div>
            </section>
            <Footer />
        </main>
    );
}
