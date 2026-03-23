"use client";

import { motion } from "framer-motion";
import { Globe, ShieldCheck, Truck, Lightbulb } from "lucide-react";

export const services = [
    {
        title: "Buying worldwide",
        description:
            "Tap into suppliers we’ve already checked. We help you find what you need, talk price, and make sure quality matches what you ordered.",
        icon: Globe,
        color: "bg-blue-50 text-blue-700",
        href: "/contact",
    },
    {
        title: "Buying from India",
        description:
            "India makes a lot of great products at strong prices. We hook you up with reliable factories and help you buy without the usual runaround.",
        icon: ShieldCheck,
        color: "bg-saffron-50 text-saffron-600",
        href: "/contact",
    },
    {
        title: "Shipping & delivery",
        description:
            "From pickup to customs to final delivery—we help your goods move on time so you’re not stuck guessing where a shipment is.",
        icon: Truck,
        color: "bg-emerald-50 text-emerald-600",
        href: "/services",
    },
    {
        title: "Expert advice",
        description:
            "Not sure what to buy, from whom, or how to lower risk? Our team helps you plan purchases and avoid costly mistakes.",
        icon: Lightbulb,
        color: "bg-violet-50 text-violet-600",
        href: "/advisory",
    },
];

export default function Services() {
    return (
        <section id="services" className="py-16 sm:py-20 md:py-24 bg-white">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="max-w-2xl mx-auto text-center mb-10 sm:mb-16">
                    <motion.h2
                        className="text-2xl sm:text-3xl md:text-5xl font-bold text-slate-900 tracking-tight px-2"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        What we <span className="text-blue-700">can do for you</span>
                    </motion.h2>
                    <motion.p
                        className="mt-3 sm:mt-4 text-base sm:text-lg text-slate-600 px-2"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        Find suppliers, compare offers, and get your goods moving—without drowning in jargon.
                    </motion.p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.title}
                            className="group p-5 sm:p-8 h-full rounded-2xl border border-slate-100 bg-white hover:bg-slate-50 transition-all hover:shadow-xl hover:-translate-y-2 cursor-default"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:rotate-3 ${service.color}`}>
                                <service.icon size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-700 transition-colors">
                                {service.title}
                            </h3>
                            <p className="text-slate-600 leading-relaxed">
                                {service.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
