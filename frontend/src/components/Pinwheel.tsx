import { useEffect, useRef } from "react";
import gsap from "gsap";

import { cn } from "@/lib/utils";

const CORES = [
  "var(--color-lavrado)",
  "var(--color-rio)",
  "var(--color-estrada)",
  "var(--color-tepui)",
];

interface PinwheelProps {
  className?: string;
  /** Gira sozinho, devagar, como se o vento estivesse soprando. */
  girando?: boolean;
}

export function Pinwheel({ className, girando = true }: PinwheelProps) {
  const blades = useRef<SVGGElement>(null);

  useEffect(() => {
    if (!girando || !blades.current) return;
    const reduzMovimento = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduzMovimento) return;

    const tween = gsap.to(blades.current, {
      rotation: 360,
      transformOrigin: "50% 50%",
      duration: 6,
      repeat: -1,
      ease: "none",
    });
    return () => {
      tween.kill();
    };
  }, [girando]);

  return (
    <svg
      viewBox="0 0 200 280"
      className={cn("w-full max-w-[180px]", className)}
      role="img"
      aria-label="Catavento"
    >
      {/* vareta — começa colada no pino, sem vão entre as pás e o palito */}
      <rect x="97" y="106" width="6" height="164" rx="3" fill="var(--color-tepui)" />
      <ellipse cx="100" cy="272" rx="26" ry="6" fill="var(--color-ink)" opacity="0.12" />

      <g ref={blades}>
        {CORES.map((cor, i) => (
          <g key={i} transform={`rotate(${i * 90} 100 100)`}>
            <path
              d="M100,100 L100,34 C100,34 132,42 132,68 C132,90 100,100 100,100 Z"
              fill={cor}
            />
          </g>
        ))}
      </g>

      {/* pino central */}
      <circle cx="100" cy="100" r="9" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="3" />
    </svg>
  );
}
