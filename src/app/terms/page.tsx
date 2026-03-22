import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Terms of Service - Ryovax",
  description: "Terms for using Ryovax services.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <section className="pt-28 sm:pt-32 md:pt-40 pb-16 sm:pb-24">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">Terms of Service</h1>
          <div className="space-y-4 text-slate-600 leading-relaxed">
            <p>
              This is placeholder content for your terms of service. Replace it with a full agreement reviewed by counsel before production use.
            </p>
            <p>
              Typical sections cover acceptable use, accounts, fees, liability limits, and how disputes are resolved.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
