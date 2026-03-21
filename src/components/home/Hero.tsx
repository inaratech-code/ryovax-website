"use client";

import { motion } from "framer-motion";
import { ArrowRight, Globe2 } from "lucide-react";
import dynamic from "next/dynamic";
import { Suspense } from "react";

// Use dynamic import for Three.js components to avoid SSR issues
const Globe3D = dynamic(() => import("./Globe3D"), { ssr: false });

export default function Hero() {
    return (
        <section className="relative min-h-screen pt-24 pb-12 overflow-hidden flex items-center bg-slate-50">
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] bg-blue-100 rounded-full blur-[120px] opacity-60 mix-blend-multiply" />
                <div className="absolute bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-saffron-100 rounded-full blur-[100px] opacity-40 mix-blend-multiply" />
            </div>

            <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                <div className="flex flex-col gap-8 max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6 border border-blue-100 shadow-sm">
                            <Globe2 size={16} className="text-saffron-500" />
                            <span>Global Reach, Indian Roots</span>
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1]">
                            Global <span className="text-blue-700">Procurement</span> <br /> & Logistics Partner
                        </h1>

                        <p className="mt-6 text-xl text-slate-600 leading-relaxed max-w-lg">
                            Streamline your supply chain with Ryovax. We bridge the gap between reliable suppliers and global buyers with seamless efficiency.
                        </p>
                    </motion.div>

                    <motion.div
                        className="flex flex-col sm:flex-row gap-4"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    >
                        <button className="px-8 py-4 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2">
                            Post Requirement
                            <ArrowRight size={18} />
                        </button>
                        <button className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200 hover:border-slate-300 rounded-xl font-medium transition-all shadow-sm flex items-center justify-center">
                            Get a Quote
                        </button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="mt-12 flex items-center gap-6 text-sm text-slate-500 font-medium"
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
                    <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-slate-400">Loading Interactive Globe...</div>}>
                        <Globe3D />
                    </Suspense>
                </motion.div>
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce cursor-pointer text-slate-400">
                <span className="text-xs uppercase tracking-widest">Scroll</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-slate-500 to-transparent" />
            </div>
        </section>
    );
}
