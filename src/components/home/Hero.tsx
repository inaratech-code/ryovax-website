"use client";

import { motion } from "framer-motion";
import { ArrowRight, Globe2 } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Suspense } from "react";

// Use dynamic import for Three.js components to avoid SSR issues
const Globe3D = dynamic(() => import("./Globe3D"), { ssr: false });

export default function Hero() {
    return (
        <section className="relative min-h-screen pt-28 sm:pt-32 md:pt-40 lg:pt-44 pb-10 sm:pb-12 overflow-hidden flex items-center bg-slate-50">
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] bg-blue-100 rounded-full blur-[120px] opacity-60 mix-blend-multiply" />
                <div className="absolute bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-saffron-100 rounded-full blur-[100px] opacity-40 mix-blend-multiply" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 relative z-10 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div className="flex flex-col gap-6 sm:gap-8 max-w-2xl min-w-0">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="inline-flex flex-wrap items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-xs sm:text-sm font-medium mb-4 sm:mb-6 border border-blue-100 shadow-sm max-w-full">
                            <Globe2 size={16} className="text-saffron-500" />
                            <span>Worldwide reach, based in India</span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-slate-900 leading-[1.12] sm:leading-[1.1]">
                            Your place to <span className="text-blue-700">buy &amp; source goods</span>
                            <br />
                            from India to the world
                        </h1>

                        <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-slate-600 leading-relaxed max-w-lg">
                            We connect you with checked suppliers, help you compare prices, and keep shipping and paperwork simple—so you spend less time chasing vendors and more time running your business.
                        </p>
                    </motion.div>

                    <motion.div
                        className="flex flex-col sm:flex-row gap-4"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    >
                        <Link
                            href="/auth/register"
                            className="px-8 py-4 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2"
                        >
                            Tell us what you need
                            <ArrowRight size={18} />
                        </Link>
                        <Link
                            href="/contact"
                            className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200 hover:border-slate-300 rounded-xl font-medium transition-all shadow-sm flex items-center justify-center"
                        >
                            Get a Quote
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="mt-8 sm:mt-12 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 text-sm text-slate-500 font-medium"
                    >
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className={`w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden z-[${10 - i}]`}>
                                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt={`User ${i}`} />
                                </div>
                            ))}
                        </div>
                        <p>Trusted by 500+ global enterprises</p>
                    </motion.div>
                </div>

                <motion.div
                    className="relative h-[600px] w-full hidden lg:block"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                >
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-slate-50 via-transparent to-transparent z-10" />
                    <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-slate-400">Loading map…</div>}>
                        <Globe3D />
                    </Suspense>
                </motion.div>
            </div>

            <Link
                href="/#how-it-works"
                className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce cursor-pointer text-slate-400 max-sm:hidden hover:text-slate-600"
                aria-label="Scroll to how it works"
            >
                <span className="text-xs uppercase tracking-widest">Scroll</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-slate-500 to-transparent" />
            </Link>
        </section>
    );
}
