"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

/** App shells use nested scroll; Lenis on the root body fights those — skip for smoother admin/dashboard. */
function shouldSkipLenis(pathname: string | null) {
    if (!pathname) return false;
    return pathname.startsWith("/admin") || pathname.startsWith("/dashboard");
}

export default function LenisScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const skip = shouldSkipLenis(pathname);
  const rafId = useRef<number>(0);

  useEffect(() => {
    if (skip) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({
      // Higher lerp = scroll catches up faster (less “lag” behind the wheel).
      lerp: 0.26,
      wheelMultiplier: 1.05,
      smoothWheel: true,
      touchMultiplier: 1,
      syncTouch: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      rafId.current = requestAnimationFrame(raf);
    }

    rafId.current = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId.current);
      lenis.destroy();
    };
  }, [skip]);

  return <>{children}</>;
}
