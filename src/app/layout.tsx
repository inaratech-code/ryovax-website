import type { Metadata } from "next";
import "./globals.css";
import LenisScroll from "@/components/LenisScroll";

export const metadata: Metadata = {
  title: "Ryovax | Global Procurement & Logistics Partner",
  description: "Global Procurement & Logistics Platform from India, connecting buyers and suppliers with seamless supply chain solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-white text-slate-900 selection:bg-saffron-500 selection:text-white">
        <LenisScroll>
          {children}
        </LenisScroll>
      </body>
    </html>
  );
}
