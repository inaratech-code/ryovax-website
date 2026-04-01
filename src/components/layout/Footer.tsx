"use client";

import { Linkedin, Twitter, Facebook, Instagram } from "lucide-react";
import Link from "next/link";
import RyovaxLogo from "@/components/brand/RyovaxLogo";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-white/10 pt-12 sm:pt-16 md:pt-20 pb-8 sm:pb-10 bg-[radial-gradient(1200px_600px_at_15%_20%,rgba(20,184,166,0.20),transparent_60%),radial-gradient(900px_500px_at_85%_0%,rgba(244,114,182,0.16),transparent_55%),linear-gradient(180deg,#070A14_0%,#0A1024_55%,#050710_100%)]">
            <div className="container mx-auto px-4 sm:px-6 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 text-slate-300/90">

                <div className="flex flex-col gap-5 col-span-2 lg:col-span-1">
                    <Link
                        href="/"
                        className="inline-flex items-center group border-0 outline-none ring-0 focus:outline-none focus-visible:outline-none"
                        aria-label="Ryovax home"
                    >
                        <RyovaxLogo
                            priority={false}
                            heightClass="h-20 sm:h-24 md:h-28 lg:h-32"
                            className="drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)] group-hover:opacity-95 transition-opacity duration-200 max-w-full object-contain object-left"
                        />
                    </Link>
                    <p className="text-sm leading-relaxed text-justify max-w-none sm:max-w-xs md:max-w-sm">
                        Based in India, helping businesses across the Middle East, Asia, the Americas (North, South &amp;
                        Latin), Africa, and the Caribbean buy and ship goods with clear steps and honest communication.
                    </p>
                    <div className="flex items-center gap-4 mt-4 w-fit rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-sm">
                        {(
                            [
                                { Icon: Linkedin, href: "https://www.linkedin.com/company/ryovax-flow-flawlessly/about/?viewAsMember=true" },
                                { Icon: Twitter, href: "https://x.com/inforyovax?s=21" },
                                { Icon: Facebook, href: "https://www.facebook.com/profile.php?id=61578526150760" },
                                { Icon: Instagram, href: "https://www.instagram.com/" },
                            ] as const
                        ).map(({ Icon, href }, i) => (
                            <a
                                key={i}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full border border-white/10 hover:border-teal-300/60 hover:text-teal-100 flex items-center justify-center transition-all bg-white/5 hover:bg-white/10"
                            >
                                <Icon size={18} />
                            </a>
                        ))}
                    </div>
                </div>

                <div className="mt-4 sm:mt-8 lg:mt-0">
                    <h4 className="text-white font-semibold mb-6">What we offer</h4>
                    <ul className="space-y-4 text-sm font-medium">
                        <li><Link href="/#services" className="hover:text-teal-200 transition-colors">Buying worldwide</Link></li>
                        <li><Link href="/#services" className="hover:text-teal-200 transition-colors">Buying from India</Link></li>
                        <li><Link href="/#services" className="hover:text-teal-200 transition-colors">Shipping &amp; delivery</Link></li>
                        <li><Link href="/#services" className="hover:text-teal-200 transition-colors">Rules &amp; quality</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-semibold mb-6">Company</h4>
                    <ul className="space-y-4 text-sm font-medium">
                        <li><Link href="/about" className="hover:text-teal-200 transition-colors">About Us</Link></li>
                        <li><Link href="/contact" className="hover:text-teal-200 transition-colors">Careers</Link></li>
                        <li><Link href="/contact" className="hover:text-teal-200 transition-colors">Partner Network</Link></li>
                        <li><Link href="/contact" className="hover:text-teal-200 transition-colors">Get help</Link></li>
                    </ul>
                </div>

            </div>

            <div className="container mx-auto px-4 sm:px-6 mt-8 sm:mt-12 md:mt-14 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-sm text-slate-300/60 gap-4 text-center md:text-left w-full">
                <p className="max-w-prose">
                    &copy; {currentYear} Ryovax Logistics Private Limited &amp;{" "}
                    <a
                        href="https://www.inaratech.com.np"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-200/70 hover:text-white transition-colors"
                    >
                        Inara Tech
                    </a>
                    . All rights reserved.
                    {/* Low-visibility staff entry; middleware still gates /admin in production. */}
                    <Link
                        href="/admin"
                        className="ml-0.5 inline text-[10px] text-white/20 hover:text-white/50 align-super opacity-60 hover:opacity-100 transition-opacity"
                        aria-label="Admin sign-in"
                        title="Admin"
                    >
                        ·
                    </Link>
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
