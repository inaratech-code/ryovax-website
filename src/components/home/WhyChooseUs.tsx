"use client";

import { motion } from "framer-motion";
import { Check, ShieldAlert, Award, TrendingDown } from "lucide-react";

const features = [
    {
        title: "Suppliers we’ve checked",
        description: "We don’t let just anyone on the platform—suppliers go through serious checks before you see them.",
        icon: ShieldAlert,
    },
    {
        title: "Rules & paperwork",
        description: "Cross-border buying means forms and customs—we help you stay on the right side of the rules.",
        icon: Check,
    },
    {
        title: "Fairer pricing",
        description: "We use our scale and data to help you pay a sensible price—not whatever someone first quotes.",
        icon: TrendingDown,
    },
    {
        title: "Quality checks",
        description: "When it matters, our people can inspect goods before they ship so you’re not stuck with junk.",
        icon: Award,
    },
];

export default function WhyChooseUs() {
    return (
        <section id="why-choose-us" className="py-16 sm:py-20 md:py-24 bg-slate-50">
            <div className="container mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-block px-4 py-2 bg-saffron-100 text-saffron-600 font-semibold rounded-full text-sm mb-6">
                        The Ryovax Advantage
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
                        Why growing businesses pick us.
                    </h2>
                    <p className="mt-4 sm:mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed mb-6 sm:mb-8">
                        We don’t just introduce you to a supplier and vanish. We stay in your corner on quality, timing, and getting stuff from A to B.
                    </p>

                    <span className="inline-flex w-full sm:w-auto justify-center px-8 py-4 bg-slate-900 text-white rounded-xl font-medium shadow-lg cursor-default select-none">
                        See how it works
                    </span>
                </motion.div>

                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            className="bg-white p-5 sm:p-8 rounded-2xl border border-slate-200 shadow-sm"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <div className="w-12 h-12 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center mb-6">
                                <feature.icon size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
