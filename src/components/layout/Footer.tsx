"use client";

import { motion } from "framer-motion";
import { Linkedin, Twitter, Facebook, Instagram } from "lucide-react";
import Link from "next/link";
import RyovaxLogo from "@/components/brand/RyovaxLogo";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-900 border-t border-slate-800 pt-12 sm:pt-16 md:pt-20 pb-8 sm:pb-10">
            <div className="container mx-auto px-4 sm:px-6 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 text-slate-400">

                <div className="flex flex-col gap-6">
                    <Link
                        href="/"
                        className="inline-flex items-center group border-0 outline-none ring-0 focus:outline-none focus-visible:outline-none"
                        aria-label="Ryovax home"
                    >
                        <RyovaxLogo
                            priority={false}
                            heightClass="h-16 sm:h-20 md:h-24 lg:h-28"
                            className="drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)] group-hover:opacity-95 transition-opacity duration-200 max-w-full object-contain object-left"
                        />
                    </Link>
                    <p className="text-sm leading-relaxed text-justify max-w-none sm:max-w-xs md:max-w-sm">
                        Based in India, helping businesses everywhere buy and ship goods with clear steps and honest communication.
                    </p>
                    <div className="flex items-center gap-4 mt-4 w-fit rounded-2xl border border-slate-800 bg-slate-900/40 p-2">
                        {(
                            [
                                { Icon: Linkedin, href: "https://www.linkedin.com/company/ryovax-flow-flawlessly/about/?viewAsMember=true" },
                                { Icon: Twitter, href: "https://twitter.com/" },
                                { Icon: Facebook, href: "https://www.facebook.com/" },
                                { Icon: Instagram, href: "https://www.instagram.com/" },
                            ] as const
                        ).map(({ Icon, href }, i) => (
                            <a
                                key={i}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full border border-slate-700 hover:border-saffron-500 hover:text-saffron-400 flex items-center justify-center transition-all bg-slate-800 hover:bg-slate-900"
                            >
                                <Icon size={18} />
                            </a>
                        ))}
                    </div>
                </div>

                <div className="mt-4 sm:mt-8 lg:mt-0">
                    <h4 className="text-white font-semibold mb-6">What we offer</h4>
                    <ul className="space-y-4 text-sm font-medium">
                        <li><Link href="/#services" className="hover:text-saffron-400 transition-colors">Buying worldwide</Link></li>
                        <li><Link href="/#services" className="hover:text-saffron-400 transition-colors">Buying from India</Link></li>
                        <li><Link href="/#services" className="hover:text-saffron-400 transition-colors">Shipping &amp; delivery</Link></li>
                        <li><Link href="/#services" className="hover:text-saffron-400 transition-colors">Rules &amp; quality</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-semibold mb-6">Company</h4>
                    <ul className="space-y-4 text-sm font-medium">
                        <li><Link href="/about" className="hover:text-saffron-400 transition-colors">About Us</Link></li>
                        <li><Link href="/contact" className="hover:text-saffron-400 transition-colors">Careers</Link></li>
                        <li><Link href="/contact" className="hover:text-saffron-400 transition-colors">Partner Network</Link></li>
                        <li><Link href="/contact" className="hover:text-saffron-400 transition-colors">Get help</Link></li>
                    </ul>
                </div>

            </div>

            <div className="container mx-auto px-4 sm:px-6 mt-10 sm:mt-16 md:mt-20 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-sm text-slate-500 gap-4 text-center md:text-left w-full">
                <p className="max-w-prose">
                    &copy; {currentYear} Ryovax Logistics Private Limited &amp;{" "}
                    <a
                        href="https://www.inaratech.com.np"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-500 hover:text-slate-300 transition-colors"
                    >
                        Inara Tech
                    </a>
                    . All rights reserved.
                </p>
                <div className="flex flex-wrap justify-center md:justify-end gap-4 sm:gap-6 font-medium w-full md:w-auto">
                    <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                    <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    <Link href="/cookies" className="hover:text-white transition-colors">Cookie Settings</Link>
                </div>
            </div>
        </footer>
    );
}
