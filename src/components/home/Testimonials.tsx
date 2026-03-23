"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Link from "next/link";

type TestimonialItem = {
    text: string;
    author: string;
    role: string;
    company: string;
};

export default function Testimonials() {
    const [items, setItems] = useState<TestimonialItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        let cancelled = false;
        fetch("/api/testimonials")
            .then((res) => res.json())
            .then((data: { testimonials?: TestimonialItem[] }) => {
                if (!cancelled && Array.isArray(data.testimonials)) {
                    setItems(data.testimonials);
                }
            })
            .catch(() => {
                if (!cancelled) setItems([]);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (items.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % items.length);
        }, 8000);
        return () => clearInterval(timer);
    }, [items.length]);

    useEffect(() => {
        setCurrentIndex((i) => {
            if (items.length === 0) return 0;
            return i % items.length;
        });
    }, [items.length]);

    const handleNext = () =>
        setCurrentIndex((prev) => (items.length ? (prev + 1) % items.length : 0));
    const handlePrev = () =>
        setCurrentIndex((prev) =>
            items.length ? (prev - 1 + items.length) % items.length : 0,
        );

    return (
        <section className="py-16 sm:py-24 md:py-32 bg-slate-900 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-900/20 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-1/3 h-full bg-saffron-600/10 blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-4 sm:px-6 relative z-10">
                <div className="max-w-4xl mx-auto">
                    <Quote size={40} className="text-saffron-500 mb-8 sm:mb-12 opacity-50" />

                    <div className="relative min-h-[200px] sm:min-h-[250px]">
                        {loading ? (
                            <div className="absolute inset-0 flex items-center">
                                <p className="text-slate-400 text-lg">Loading testimonials…</p>
                            </div>
                        ) : items.length === 0 ? (
                            <div className="absolute inset-0 flex flex-col justify-center gap-4">
                                <p className="text-lg sm:text-2xl font-light text-slate-300 leading-relaxed">
                                    Approved POV submissions will appear here. Be the first to share your story.
                                </p>
                            </div>
                        ) : (
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
                                        &ldquo;{items[currentIndex].text}&rdquo;
                                    </p>
                                    <div>
                                        <h4 className="text-xl font-bold">{items[currentIndex].author}</h4>
                                        <p className="text-slate-400">
                                            {items[currentIndex].role},{" "}
                                            <span className="text-saffron-400">{items[currentIndex].company}</span>
                                        </p>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        )}
                    </div>

                    {!loading && items.length > 0 && (
                        <div className="flex items-center gap-4 mt-12">
                            <button
                                type="button"
                                onClick={handlePrev}
                                className="w-12 h-12 rounded-full border border-slate-700 flex items-center justify-center hover:bg-slate-800 transition-colors"
                                aria-label="Previous testimonial"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                type="button"
                                onClick={handleNext}
                                className="w-12 h-12 rounded-full border border-slate-700 flex items-center justify-center hover:bg-slate-800 transition-colors"
                                aria-label="Next testimonial"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    )}

                    <div className="mt-8">
                        <Link
                            href="/testimonial"
                            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-saffron-500 hover:bg-saffron-400 text-slate-900 font-semibold transition-colors shadow-sm"
                        >
                            Share your POV
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
