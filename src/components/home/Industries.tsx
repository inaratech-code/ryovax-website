"use client";

import { motion } from "framer-motion";
import { Factory, ShoppingCart, HardHat, Pill } from "lucide-react";
import Link from "next/link";

const industries = [
    { name: "Manufacturing", icon: Factory, color: "text-blue-700 bg-blue-50 border-blue-100" },
    { name: "FMCG", icon: ShoppingCart, color: "text-green-600 bg-green-50 border-green-100" },
    { name: "Construction", icon: HardHat, color: "text-amber-600 bg-amber-50 border-amber-100" },
    { name: "Pharma", icon: Pill, color: "text-rose-600 bg-rose-50 border-rose-100" },
];

export default function Industries() {
    return (
        <section id="industries" className="py-16 sm:py-20 md:py-24 bg-slate-50">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 lg:gap-8 mb-10 sm:mb-16">
                    <div className="max-w-xl">
                        <motion.h2
                            className="text-2xl sm:text-3xl md:text-5xl font-bold text-slate-900 tracking-tight"
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            Industries We Serve
                        </motion.h2>
                        <motion.p
                            className="mt-4 text-lg text-slate-600"
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            Different lines of work need different care on timing and rules—we shape buying and shipping to fit yours.
                        </motion.p>
                    </div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Link
                            href="/services"
                            className="text-blue-700 font-semibold hover:text-blue-800 hover:underline underline-offset-4 inline-flex items-center gap-2"
                            onClick={(e) => {
                                // Defensive: ensure clicks on this link only navigate here.
                                e.stopPropagation();
                            }}
                        >
                            See all sectors &rarr;
                        </Link>
                    </motion.div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
                    {industries.map((industry, index) => (
                        <Link
                            key={industry.name}
                            href={`/services?industry=${encodeURIComponent(industry.name)}`}
                            className="block"
                        >
                            <motion.div
                                className="group bg-white border border-slate-200 rounded-2xl p-4 sm:p-8 flex flex-col items-center justify-center text-center hover:shadow-xl hover:-translate-y-1 transition-all min-h-[140px] sm:min-h-0"
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                            >
                                <div className={`w-14 h-14 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mb-3 sm:mb-6 border-2 transition-transform group-hover:scale-110 ${industry.color}`}>
                                    <industry.icon size={30} strokeWidth={1.75} />
                                </div>
                                <h3 className="text-base sm:text-xl font-bold text-slate-800 leading-tight">{industry.name}</h3>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
