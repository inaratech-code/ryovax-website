import dynamic from "next/dynamic";
import Hero from "@/components/home/Hero";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

/** Below-the-fold chunks load after first paint for faster TTFB / less main-thread work. */
const Services = dynamic(() => import("@/components/home/Services"), {
    loading: () => <section className="min-h-[12rem] bg-slate-50/50" aria-hidden />,
});
const Industries = dynamic(() => import("@/components/home/Industries"), {
    loading: () => <section className="min-h-[10rem] bg-white/50" aria-hidden />,
});
const HowItWorks = dynamic(() => import("@/components/home/HowItWorks"), {
    loading: () => <section className="min-h-[14rem] bg-slate-50/50" aria-hidden />,
});
const WhyChooseUs = dynamic(() => import("@/components/home/WhyChooseUs"), {
    loading: () => <section className="min-h-[12rem] bg-white/50" aria-hidden />,
});
const Testimonials = dynamic(() => import("@/components/home/Testimonials"), {
    loading: () => <section className="min-h-[16rem] bg-slate-50/50" aria-hidden />,
});
const CTA = dynamic(() => import("@/components/home/CTA"), {
    loading: () => <section className="min-h-[8rem] bg-blue-900/5" aria-hidden />,
});

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
