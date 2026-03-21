"use client";

import { motion } from "framer-motion";
import { Menu, Globe2, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

const navLinks = [
    { name: "Services", href: "#services" },
    { name: "Industries", href: "#industries" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Company", href: "#company" },
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm py-4" : "bg-transparent py-6"}`}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="h-10 w-10 bg-blue-700 rounded-lg flex items-center justify-center text-white shadow-lg group-hover:bg-blue-800 transition-colors">
                        <Globe2 size={24} />
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-slate-900">
                        Ryovax<span className="text-saffron-500">.</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-8">
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
                <div className="hidden lg:flex items-center gap-4">
                    <Link href="/auth/login" className="text-sm font-medium text-slate-600 hover:text-blue-700 px-4 py-2 transition-colors">
                        Sign In
                    </Link>
                    <Link href="/auth/register" className="text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 px-5 py-2.5 rounded-lg shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5">
                        Post RFQ
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="lg:hidden text-slate-900 p-2"
                    onClick={() => setMobileMenuOpen(true)}
                >
                    <Menu size={24} />
                </button>
            </div>

            {/* Mobile Menu Fullscreen Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center space-y-8">
                    <button
                        className="absolute top-6 right-6 text-slate-900 p-2 bg-slate-100 rounded-full"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <X size={24} />
                    </button>

                    <nav className="flex flex-col items-center gap-6 text-xl font-medium">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-slate-800 hover:text-blue-700"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.name}
                            </a>
                        ))}
                    </nav>

                    <div className="flex flex-col items-center gap-4 mt-8 w-full px-12">
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
                            Post RFQ
                        </Link>
                    </div>
                </div>
            )}
        </motion.header>
    );
}
