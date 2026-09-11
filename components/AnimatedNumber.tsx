"use client";

import { useEffect, useRef, useState } from "react";

export default function AnimatedNumber({
  value,
  durationMs = 700,
  delayMs = 0,
}: {
  value: number;
  durationMs?: number;
  delayMs?: number;
}) {
  const [display, setDisplay] = useState(0);
  const frame = useRef<number | undefined>(undefined);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      setDisplay(value);
      return;
    }

    let start: number | null = null;
    const timeout = setTimeout(() => {
      const step = (ts: number) => {
        if (start === null) start = ts;
        const progress = Math.min((ts - start) / durationMs, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(Math.round(eased * value));
        if (progress < 1) frame.current = requestAnimationFrame(step);
      };
      frame.current = requestAnimationFrame(step);
    }, delayMs);

    return () => {
      clearTimeout(timeout);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [value, durationMs, delayMs]);

  return <>{display}</>;
}
