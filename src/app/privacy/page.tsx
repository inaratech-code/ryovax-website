import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Privacy Policy - Ryovax",
  description: "How Ryovax handles personal information.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <section className="pt-28 sm:pt-32 md:pt-40 pb-16 sm:pb-24">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">Privacy Policy</h1>
          <div className="space-y-4 text-slate-600 leading-relaxed">
            <p>
              This is placeholder content for your privacy policy. Replace it with wording your legal team approves before you go live.
            </p>
            <p>
              We describe what data we collect, how we use it, who we share it with, how long we keep it, and what choices you have. Contact us at{" "}
              <a href="mailto:info@ryovax.com" className="text-blue-700 font-medium hover:underline">
                info@ryovax.com
              </a>{" "}
              with questions.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
