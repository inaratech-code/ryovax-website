import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactForm from "@/components/forms/ContactForm";

export const metadata = {
  title: "Contact Us - Ryovax",
  description: "Reach the Ryovax team—questions about buying, shipping, or working with us.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      
      <section className="pt-28 sm:pt-32 md:pt-40 pb-12 sm:pb-24">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="text-center mb-10 sm:mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4 sm:mb-6">Let’s talk</h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto px-2">
              Buying, selling, or just exploring options? Tell us what you’re trying to do—we’ll point you in the right direction.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
            {/* Contact Info */}
            <div>
              <div className="bg-blue-700 text-white p-6 sm:p-10 md:p-12 rounded-2xl sm:rounded-3xl h-full relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-800 rounded-full blur-[80px]" />
                <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 relative z-10">Get In Touch</h2>
                
                <div className="space-y-8 relative z-10">
                  <div>
                    <h3 className="text-blue-200 text-sm font-semibold uppercase tracking-wider mb-2">Main office</h3>
                    <p className="text-base sm:text-lg">Cyber City, Gurugram<br />Haryana 122002, India</p>
                  </div>
                  <div>
                    <h3 className="text-blue-200 text-sm font-semibold uppercase tracking-wider mb-2">Other places</h3>
                    <p className="text-base sm:text-lg leading-relaxed">
                      Middle East · Asia · Americas (North, South &amp; Latin) · Africa · Caribbean
                    </p>
                  </div>
                  <div>
                    <h3 className="text-blue-200 text-sm font-semibold uppercase tracking-wider mb-2">Email</h3>
                    <p className="text-base sm:text-lg break-all">
                      Email -{" "}
                      <a href="mailto:info@ryovax.com" className="font-medium hover:underline">
                        info@ryovax.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="bg-white p-6 sm:p-10 md:p-12 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-8">Send us a Message</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
