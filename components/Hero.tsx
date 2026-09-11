"use client";

import { motion } from "framer-motion";
import { Dices } from "lucide-react";

export default function Hero({
  subtitle,
  eyebrow,
}: {
  subtitle: string;
  eyebrow?: string;
}) {
  return (
    <div className="felt-band px-6 py-14 text-center">
      <motion.div
        initial={{ opacity: 0, rotate: -35, scale: 0.6 }}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg border-2 border-gold bg-cream/10"
      >
        <Dices className="h-7 w-7 text-gold" strokeWidth={1.75} />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="font-display text-4xl text-cream sm:text-5xl"
      >
        {eyebrow ?? "Monopoly Night"}
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
