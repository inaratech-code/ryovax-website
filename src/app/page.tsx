import Hero from "@/components/home/Hero";
import Services from "@/components/home/Services";
import Industries from "@/components/home/Industries";
import HowItWorks from "@/components/home/HowItWorks";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Testimonials from "@/components/home/Testimonials";
import CTA from "@/components/home/CTA";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Services />
      <Industries />
      <HowItWorks />
      <WhyChooseUs />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
