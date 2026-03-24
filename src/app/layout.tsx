import type { Metadata } from "next";
import "./globals.css";
import LenisScroll from "@/components/LenisScroll";

const siteDescription =
  "From India to the world: connect with suppliers, get quotes, and move goods with less hassle—clear steps and people who speak plainly.";

/** Same wordmark as the navbar; used for OG/Twitter previews. Favicon uses `app/icon.png` (see Next.js file convention). */
const brandIcon = "/Ryovax_logo-removebg-preview.png";

/** Resolves relative OG/Twitter image URLs; set NEXT_PUBLIC_SITE_URL in production if needed. */
function getMetadataBase(): URL | undefined {
    const explicit = process.env.NEXT_PUBLIC_SITE_URL;
    if (explicit) return new URL(explicit);
    const vercel = process.env.VERCEL_URL;
    if (vercel) return new URL(`https://${vercel}`);
    return undefined;
}

const metadataBase = getMetadataBase();

export const metadata: Metadata = {
    ...(metadataBase ? { metadataBase } : {}),
  title: "Ryovax | Help Buying & Shipping Goods Worldwide",
  description: siteDescription,
  openGraph: {
    title: "Ryovax | Help Buying & Shipping Goods Worldwide",
    description: siteDescription,
    siteName: "Ryovax",
    type: "website",
    images: [{ url: brandIcon, alt: "Ryovax" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ryovax | Help Buying & Shipping Goods Worldwide",
    description: siteDescription,
    images: [brandIcon],
  },
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
