"use client";

import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function WinHistory({ dates }: { dates: string[] }) {
  const sorted = [...dates].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  return (
    <ol className="mx-auto flex max-w-md flex-col gap-3">
      {sorted.map((iso, i) => (
        <motion.li
          key={`${iso}-${i}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: i * 0.06 }}
          className="deed-rule flex items-center gap-3 bg-cream px-4 py-3 shadow-[2px_2px_0_0_rgba(34,28,16,0.12)]"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-board/40 text-board">
            <Calendar className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">Game {sorted.length - i}</p>
            <p className="text-xs text-ink/60">{formatDate(iso)}</p>
          </div>
        </motion.li>
      ))}
    </ol>
  );
}
