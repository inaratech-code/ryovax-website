"use client";

import { motion } from "framer-motion";
import { CalendarClock, Menu, X } from "lucide-react";
import Link from "next/link";
import RyovaxLogo from "@/components/brand/RyovaxLogo";
import { useState, useEffect, useRef } from "react";

function useBodyScrollLock(locked: boolean) {
    useEffect(() => {
        if (locked) {
            const prev = document.body.style.overflow;
            document.body.style.overflow = "hidden";
            return () => {
                document.body.style.overflow = prev;
            };
        }
    }, [locked]);
}

const navLinks = [
    { name: "Services", href: "/services" },
    { name: "Book appointment", href: "/book-appointment" },
    { name: "Expert advice", href: "/advisory" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [headerHidden, setHeaderHidden] = useState(false);
    const lastScrollY = useRef(0);

    useBodyScrollLock(mobileMenuOpen);

    useEffect(() => {
        if (mobileMenuOpen) {
            setHeaderHidden(false);
        }
    }, [mobileMenuOpen]);

    useEffect(() => {
        lastScrollY.current = typeof window !== "undefined" ? window.scrollY : 0;
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const y = window.scrollY;
            setIsScrolled(y > 20);

            if (mobileMenuOpen) {
                setHeaderHidden(false);
                lastScrollY.current = y;
                return;
            }

            const prev = lastScrollY.current;
            const delta = y - prev;

            if (y < 56) {
                setHeaderHidden(false);
            } else if (delta > 6 && y > 96) {
                setHeaderHidden(true);
            } else if (delta < -6) {
                setHeaderHidden(false);
            }

            lastScrollY.current = y;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [mobileMenuOpen]);

    return (
        <motion.header
            initial={{ y: -16, opacity: 0.96 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 left-0 right-0 z-50"
        >
            <div
                className={`transition-[transform,background-color,border-color,box-shadow,padding] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform ${
                    headerHidden && !mobileMenuOpen ? "-translate-y-full" : "translate-y-0"
                } ${isScrolled ? "bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm py-2 sm:py-2.5" : "bg-transparent py-3 sm:py-4"}`}
            >
                <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between gap-3 min-w-0">
                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center group shrink-0 min-w-0 max-w-[min(100%,300px)] sm:max-w-none border-0 outline-none ring-0 focus:outline-none focus-visible:outline-none"
                    aria-label="Ryovax home"
                >
                    <RyovaxLogo
                        priority
                        heightClass="h-14 sm:h-[4.5rem] md:h-24 lg:h-28 xl:h-32"
                        className="group-hover:opacity-90 transition-opacity max-w-full object-contain object-left"
                    />
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* Auth & Actions */}
                <div className="hidden lg:flex items-center gap-3">
                    <Link
                        href="/book-appointment"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-saffron-800 bg-white border-2 border-saffron-500 hover:bg-saffron-50 px-4 py-2.5 rounded-lg shadow-sm transition-all"
                    >
                        <CalendarClock size={17} className="shrink-0" aria-hidden />
                        Schedule call
                    </Link>
                    <Link href="/auth/login" className="text-sm font-medium text-slate-600 hover:text-blue-700 px-3 py-2 transition-colors">
                        Sign In
                    </Link>
                    <Link href="/auth/register" className="text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 px-5 py-2.5 rounded-lg shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5">
                        Request quotes
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    type="button"
                    className="lg:hidden shrink-0 text-slate-900 p-2 rounded-lg hover:bg-slate-100 transition-colors"
                    onClick={() => setMobileMenuOpen(true)}
                    aria-label="Open menu"
                    aria-expanded={mobileMenuOpen}
                >
                    <Menu size={24} />
                </button>
                </div>
            </div>

            {/* Mobile Menu Fullscreen Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center space-y-6 sm:space-y-8 px-6 pt-[max(2rem,env(safe-area-inset-top))] pb-8 overflow-y-auto">
                    <button
                        type="button"
                        className="absolute top-4 right-4 sm:top-6 sm:right-6 text-slate-900 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                        aria-label="Close menu"
                    >
                        <X size={24} />
                    </button>

                    <nav className="flex flex-col items-center gap-5 sm:gap-6 text-lg sm:text-xl font-medium text-center max-w-sm w-full">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-slate-800 hover:text-blue-700 py-1"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex flex-col items-center gap-3 sm:gap-4 mt-4 sm:mt-8 w-full max-w-sm px-4">
                        <Link
                            href="/book-appointment"
                            className="w-full inline-flex items-center justify-center gap-2 text-center py-4 border-2 border-saffron-500 bg-saffron-50 rounded-xl font-semibold text-saffron-900"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <CalendarClock size={20} aria-hidden />
                            Schedule a call
                        </Link>
                        <Link
                            href="/auth/login"
                            className="w-full text-center py-4 border-2 border-slate-200 rounded-xl font-semibold text-slate-800"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/auth/register"
                            className="w-full text-center py-4 bg-blue-700 rounded-xl font-semibold text-white shadow-lg"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Request quotes
                        </Link>
                    </div>
                </div>
            )}
        </motion.header>
    );
}
