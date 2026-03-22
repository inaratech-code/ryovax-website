import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Expert advice - Ryovax",
  description: "Sit down with our team for plain-English help on buying smarter, lowering risk, and shipping goods globally.",
};

export default function AdvisoryPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      
      {/* Header */}
      <section className="pt-28 sm:pt-32 md:pt-40 pb-12 sm:pb-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/bg-pattern.svg')] opacity-10" />
        <div className="container mx-auto px-4 sm:px-6 relative z-10 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="min-w-0">
            <div className="inline-block px-4 py-1.5 bg-saffron-500/20 text-saffron-400 font-medium rounded-full mb-4 sm:mb-6 border border-saffron-500/30 text-sm sm:text-base">
              Expert advice
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              Straight talk on buying &amp; shipping
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-400 leading-relaxed mb-6 sm:mb-8">
              Worried about costs, delays, or who to trust? Our team helps you plan purchases and avoid nasty surprises—without the buzzwords.
            </p>
            <Link
              href="/contact"
              className="inline-flex w-full sm:w-auto justify-center px-8 py-4 bg-saffron-500 hover:bg-saffron-600 text-slate-900 rounded-xl font-bold transition-all"
            >
              Book a call
            </Link>
          </div>
          <div className="relative min-h-[240px] sm:min-h-[320px] lg:h-[400px] bg-slate-800 rounded-2xl sm:rounded-3xl border border-slate-700 overflow-hidden flex items-center justify-center">
            {/* Placeholder for 3D graphic or image */}
            <div className="text-slate-500 text-center p-8">
              <span className="block text-6xl mb-4">📊</span>
              <p>Supply chain snapshot (sample)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Topics */}
      <section className="py-12 sm:py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 sm:mb-4">Where we help most</h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-600">
              Practical advice so buying and shipping supports your business—not drains it.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 sm:gap-8">
            {[
              {
                title: "Better prices & deals",
                desc: "Spot where you’re overpaying and use smarter ordering to negotiate terms that actually stick."
              },
              {
                title: "Fewer nasty surprises",
                desc: "Don’t rely on one supplier or one country—build backup plans when things go sideways."
              },
              {
                title: "Smarter buying tools",
                desc: "Move from spreadsheets and guesswork to online ordering, spend tracking, and clearer contracts."
              },
              {
                title: "Doing the right thing—legally",
                desc: "Keep up with environmental and safety expectations and the rules that apply where you ship and sell."
              }
            ].map((focus, i) => (
              <div key={i} className="bg-white p-5 sm:p-8 rounded-2xl shadow-sm hover:shadow-md transition-all border border-slate-100 border-l-4 border-l-blue-600">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 sm:mb-4">{focus.title}</h3>
                <p className="text-slate-600 text-base sm:text-lg leading-relaxed">{focus.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
