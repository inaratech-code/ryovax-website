import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    /** Smaller bundles for icon / animation / chart libs (tree-shake barrel imports). */
    experimental: {
        optimizePackageImports: ["lucide-react", "framer-motion", "recharts"],
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "i.pravatar.cc",
                pathname: "/**",
            },
        ],
    },
};

export default nextConfig;

// Enables `wrangler dev` compatibility in local development when needed.
void import("@opennextjs/cloudflare").then((m) => m.initOpenNextCloudflareForDev());
