"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Link from "next/link";

const testimonials = [
    {
        text: "Ryovax changed how we buy in Asia. We cut wait times by about 30% and kept quality where we needed it—our margins look better too.",
        author: "Sarah Jenkins",
        role: "Supply Chain Director",
        company: "Nordic Manufacturing Solutions",
    },
    {
        text: "Finally we can see where our shipments are, and we trust who they connect us with. That alone saved us a ton of stress.",
        author: "David Chen",
        role: "Head of Buying",
        company: "Global Builders Inc.",
    },
    {
        text: "We couldn’t find solid suppliers in India until Ryovax. They know the ground there and still held everything to the standard we expect.",
        author: "Elena Rodriguez",
        role: "Operations Manager",
        company: "HealthCore Pharma",
    },
];

export default function Testimonials() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 8000);
        return () => clearInterval(timer);
    }, []);

    const handleNext = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

    return (
        <section className="py-16 sm:py-24 md:py-32 bg-slate-900 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-900/20 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-1/3 h-full bg-saffron-600/10 blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-4 sm:px-6 relative z-10">
                <div className="max-w-4xl mx-auto">
                    <Quote size={40} className="text-saffron-500 mb-8 sm:mb-12 opacity-50" />

                    <div className="relative min-h-[200px] sm:min-h-[250px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                                className="absolute inset-0"
                            >
                                <p className="text-lg sm:text-2xl md:text-4xl font-light leading-relaxed mb-8 sm:mb-10">
                                    "{testimonials[currentIndex].text}"
                                </p>
                                <div>
                                    <h4 className="text-xl font-bold">{testimonials[currentIndex].author}</h4>
                                    <p className="text-slate-400">
                                        {testimonials[currentIndex].role}, <span className="text-saffron-400">{testimonials[currentIndex].company}</span>
                                    </p>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="flex items-center gap-4 mt-12">
                        <button
                            onClick={handlePrev}
                            className="w-12 h-12 rounded-full border border-slate-700 flex items-center justify-center hover:bg-slate-800 transition-colors"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={handleNext}
                            className="w-12 h-12 rounded-full border border-slate-700 flex items-center justify-center hover:bg-slate-800 transition-colors"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>

                    <div className="mt-8">
                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-saffron-500 hover:bg-saffron-400 text-slate-900 font-semibold transition-colors shadow-sm"
                        >
                            Share your testimonial
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
