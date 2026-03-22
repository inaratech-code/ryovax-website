import Image from "next/image";

const LOGO_SRC = "/Ryovax_logo-removebg-preview.png";

type RyovaxLogoProps = {
    className?: string;
    /** Tailwind height class — default is large for clear brand visibility */
    heightClass?: string;
    priority?: boolean;
};

/**
 * Official Ryovax wordmark. Source: public/Ryovax_logo-removebg-preview.png
 */
export default function RyovaxLogo({
    className = "",
    heightClass = "h-16",
    priority = false,
}: RyovaxLogoProps) {
    return (
        <Image
            src={LOGO_SRC}
            alt="Ryovax Logo"
            width={528}
            height={115}
            className={`w-auto max-w-none border-0 outline-none ring-0 ${heightClass} ${className}`}
            priority={priority}
            sizes="(max-width: 640px) 92vw, 560px"
            fetchPriority={priority ? "high" : "auto"}
        />
    );
}
