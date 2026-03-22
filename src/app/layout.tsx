import type { Metadata } from "next";
import "./globals.css";
import LenisScroll from "@/components/LenisScroll";

export const metadata: Metadata = {
  title: "Ryovax | Help Buying & Shipping Goods Worldwide",
  description:
    "From India to the world: connect with suppliers, get quotes, and move goods with less hassle—clear steps and people who speak plainly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden" data-scroll-behavior="smooth">
      <body className="antialiased bg-white text-slate-900 selection:bg-saffron-500 selection:text-slate-900 overflow-x-hidden">
        <LenisScroll>
          {children}
        </LenisScroll>
      </body>
    </html>
  );
}
