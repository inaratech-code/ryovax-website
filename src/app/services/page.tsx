import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Services - Ryovax",
  description: "What Ryovax does: help you find suppliers, compare offers, ship goods, and get advice—in plain language.",
};

export default function ServicesPage() {
  const services = [
    {
      title: "Buying worldwide",
      description: "We help you find and buy materials and products from trusted suppliers around the world—start to finish.",
      icon: "🌐"
    },
    {
      title: "Buying from India",
      description: "Tap into India’s factories with our help on checking suppliers, quality, and price talks.",
      icon: "india-flag"
    },
    {
      title: "Finding the right supplier",
      description: "Tell us what you need—we match you with makers that fit your product, volume, and timing.",
      icon: "🔍"
    },
    {
      title: "Shipping & delivery",
      description: "Freight, customs, and final delivery—see where your shipment is and when it should arrive.",
      icon: "🚢"
    },
    {
      title: "Expert advice",
      description: "Practical guidance on what to buy, from where, and how to avoid costly mistakes.",
      icon: "📈"
    },
    {
      title: "Quality checks",
      description: "When you need it, we can inspect goods before they leave the factory so you get what you paid for.",
      icon: "✨"
    }
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      
      {/* Header */}
      <section className="pt-28 sm:pt-32 md:pt-40 pb-10 sm:pb-16 bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 text-center max-w-3xl">
          <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 font-medium rounded-full mb-4 sm:mb-6 text-sm sm:text-base">
            Our Services
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4 sm:mb-6 px-2">
            Help with buying, shipping &amp; advice
          </h1>
          <p className="text-base sm:text-lg text-slate-600 px-2">
            From finding a supplier to getting goods to your door—we handle the heavy lifting so you can focus on your business.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 sm:py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          {services.map((service, i) => (
            <div key={i} className="bg-white p-5 sm:p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow hover:border-blue-200 group">
              <div className="text-3xl sm:text-4xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform origin-left">
                {service.icon === "india-flag" ? (
                  <span
                    aria-label="India flag"
                    title="India"
                    className="relative inline-block w-10 h-7 rounded-[4px] overflow-hidden border border-slate-300 align-middle"
                  >
                    <span className="absolute inset-x-0 top-0 h-1/3 bg-[#FF9933]" />
                    <span className="absolute inset-x-0 top-1/3 h-1/3 bg-white" />
                    <span className="absolute inset-x-0 bottom-0 h-1/3 bg-[#138808]" />
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border border-[#000080]" />
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-0.5 rounded-full bg-[#000080]" />
                  </span>
                ) : (
                  service.icon
                )}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 sm:mb-4">{service.title}</h3>
              <p className="text-slate-600 leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
