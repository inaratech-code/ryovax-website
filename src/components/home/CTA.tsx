"use client";

import { motion } from "framer-motion";
import { ArrowRight, PhoneCall } from "lucide-react";
import Link from "next/link";

export default function CTA() {
    return (
        <section className="relative py-16 sm:py-24 md:py-32 overflow-hidden bg-white">
            {/* Background Animated Elements */}
            <div className="absolute inset-0 z-0 opacity-40">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-1/4 -right-1/4 w-96 h-96 rounded-full bg-saffron-200 blur-[80px]"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [90, 0, 90],
                        opacity: [0.5, 0.3, 0.5]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-1/4 -left-1/4 w-96 h-96 rounded-full bg-blue-200 blur-[100px]"
                />
            </div>

            <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="max-w-3xl mx-auto backdrop-blur-sm bg-white/50 border border-white/40 p-6 sm:p-10 md:p-12 rounded-2xl sm:rounded-3xl shadow-xl"
                >
                    <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-50 text-blue-700 mb-6 sm:mb-8 shadow-sm">
                        <PhoneCall size={32} />
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 sm:mb-6 tracking-tight">
                        Want buying &amp; shipping to feel easier?
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-slate-600 mb-8 sm:mb-10 leading-relaxed">
                        Talk to someone on our team—no fancy talk, just straight answers about finding suppliers, prices, and moving goods.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/contact"
                            className="px-8 py-4 w-full sm:w-auto bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-medium transition-all shadow-lg hover:-translate-y-1 flex items-center justify-center gap-2"
                        >
                            Talk to our team
                            <ArrowRight size={18} />
                        </Link>
                        <Link
                            href="/book-appointment"
                            className="px-8 py-4 w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200 rounded-xl font-medium transition-all shadow-sm text-center"
                        >
                            Book appointment
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
