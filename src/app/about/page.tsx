import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "About Us - Ryovax",
  description: "Who we are: a team focused on helping you buy and ship goods with less confusion—especially between India and the rest of the world.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-28 sm:pt-32 md:pt-40 pb-14 sm:pb-20 bg-blue-700 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-800 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center max-w-4xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">Making global buying simpler</h1>
          <p className="text-base sm:text-lg md:text-xl text-blue-100 leading-relaxed">
            Ryovax helps companies find trusted suppliers especially in India and move goods across borders without drowning in jargon or paperwork.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-12 sm:py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-8 md:gap-16">
            <div className="bg-white p-6 sm:p-10 md:p-12 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-blue-600" />
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4 sm:mb-6">Our Mission</h2>
              <p className="text-slate-600 leading-relaxed text-base sm:text-lg">
                To make buying across countries easier: clear information, fair processes, and tools that help businesses grow without getting lost in red tape.
              </p>
            </div>
            <div className="bg-white p-6 sm:p-10 md:p-12 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-saffron-500" />
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4 sm:mb-6">Our Vision</h2>
              <p className="text-slate-600 leading-relaxed text-base sm:text-lg">
                To be a name people trust when they buy and ship globally—grounded in India’s manufacturing strength and built for how business works today.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats/Metrics */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8">
            {[
              { label: "Verified Suppliers", value: "10,000+" },
              { label: "Active Buyers", value: "5,000+" },
              { label: "Countries Served", value: "50+" },
              { label: "Typical savings", value: "15%" },
            ].map((stat, i) => (
              <div key={i} className="text-center p-4 sm:p-8 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100">
                <div className="text-2xl sm:text-4xl font-bold text-blue-700 mb-1 sm:mb-2">{stat.value}</div>
                <div className="text-slate-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
