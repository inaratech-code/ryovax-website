"use client";

import { motion } from "framer-motion";
import { ClipboardList, Users, FileText, CheckCircle } from "lucide-react";

const steps = [
    {
        title: "Say what you need",
        description: "Tell us what you’re buying, how much, and when you need it—right on the platform.",
        icon: ClipboardList,
    },
    {
        title: "We find suppliers",
        description: "We line up factories and sellers that fit your job—people we’ve already checked out.",
        icon: Users,
    },
    {
        title: "Compare offers",
        description: "Get prices and delivery times side by side, plus the paperwork you need to decide.",
        icon: FileText,
    },
    {
        title: "Pick one & track it",
        description: "Choose the offer you like and follow your shipment until it reaches you.",
        icon: CheckCircle,
    },
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-16 sm:py-20 md:py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-20">
                    <motion.h2
                        className="text-2xl sm:text-3xl md:text-5xl font-bold text-slate-900 tracking-tight px-2"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        How It Works
                    </motion.h2>
                    <motion.p
                        className="mt-4 text-lg text-slate-600"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        Simple steps: less back-and-forth, fewer surprises on price and timing.
                    </motion.p>
                </div>

                <div className="relative">
                    {/* Connecting Line */}
                    <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
                    <motion.div
                        className="hidden md:block absolute top-1/2 left-[10%] h-0.5 bg-blue-700 -translate-y-1/2 z-0"
                        initial={{ width: "0%" }}
                        whileInView={{ width: "80%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-8 max-w-5xl mx-auto lg:max-w-none relative z-10">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.title}
                                className="flex flex-col items-center text-center relative group"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                            >
                                <div className="w-20 h-20 rounded-full bg-white border-4 border-slate-100 flex items-center justify-center text-blue-700 group-hover:border-blue-700 group-hover:text-blue-800 transition-colors shadow-lg mb-6 z-10 relative">
                                    <step.icon size={32} />
                                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-saffron-500 text-white font-bold flex items-center justify-center text-sm shadow-md">
                                        {index + 1}
                                    </div>
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 sm:mb-3">{step.title}</h3>
                                <p className="text-slate-600 leading-relaxed text-sm px-1 sm:px-4">
                                    {step.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
