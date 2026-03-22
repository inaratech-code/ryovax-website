import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Cookie Settings - Ryovax",
  description: "Information about cookies on Ryovax.",
};

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <section className="pt-28 sm:pt-32 md:pt-40 pb-16 sm:pb-24">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">Cookies</h1>
          <div className="space-y-4 text-slate-600 leading-relaxed">
            <p>
              This site may use cookies and similar technologies to remember preferences and measure traffic. This page is a placeholder until you add a cookie banner and a detailed policy.
            </p>
            <p>
              For questions, reach us at{" "}
              <a href="mailto:hello@ryovax.com" className="text-blue-700 font-medium hover:underline">
                hello@ryovax.com
              </a>
              .
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
