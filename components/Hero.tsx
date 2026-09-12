"use client";

import { motion } from "framer-motion";
import Mascot from "./Mascot";

export default function Hero({
  subtitle,
  eyebrow,
}: {
  subtitle: string;
  eyebrow?: string;
}) {
  return (
    <div className="hero-band px-6 py-14 text-center">
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.7 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto mb-2 h-28 w-24"
      >
        <Mascot className="h-full w-full drop-shadow-lg" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="font-display text-4xl text-cream sm:text-5xl"
      >
        {eyebrow ?? "M-Polly"}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.28 }}
        className="mx-auto mt-3 max-w-sm text-sm text-cream/70"
      >
        {subtitle}
      </motion.p>
    </div>
  );
}
