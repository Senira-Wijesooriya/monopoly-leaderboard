"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Dices } from "lucide-react";
import TokenIcon from "./TokenIcon";
import AnimatedNumber from "./AnimatedNumber";

type Player = { name: string; total: number };

export default function LeaderboardBars({ players }: { players: Player[] }) {
  if (players.length === 0) {
    return (
      <div className="mx-auto max-w-xl rounded-sm border-2 border-dashed border-gold/60 bg-cream/60 p-10 text-center">
        <Dices className="mx-auto mb-3 h-8 w-8 text-board/70" />
        <p className="font-display text-xl text-board">No wins on the board yet</p>
        <p className="mt-2 text-sm text-ink/70">
          Ask the banker to record the first game from the admin page.
        </p>
      </div>
    );
  }

  const max = players[0].total;

  return (
    <ol className="mx-auto flex max-w-2xl flex-col gap-4">
      {players.map((p, i) => {
        const pct = Math.max((p.total / max) * 100, 8);
        return (
          <li key={p.name}>
            <div className="deed-rule bg-cream shadow-[3px_3px_0_0_rgba(34,28,16,0.15)]">
              <div className="flex items-center gap-4 px-4 pb-4 pt-3">
                <span className="font-display w-6 shrink-0 text-center text-lg text-gold">
                  {i + 1}
                </span>

                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-board bg-board/5">
                  <TokenIcon name={p.name} className="h-5 w-5 text-board" />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 flex items-baseline justify-between gap-3">
                    <span className="truncate font-semibold text-ink">{p.name}</span>
                    <span className="font-display shrink-0 text-2xl text-brick">
                      <AnimatedNumber value={p.total} delayMs={150 + i * 80} />
                      <span className="ml-1 text-xs font-body font-normal text-ink/60">
                        {p.total === 1 ? "win" : "wins"}
                      </span>
                    </span>
                  </div>

                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-board/10">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-gold to-brick"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: 0.1 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </div>
              </div>

              <Link
                href={`/players/${encodeURIComponent(p.name)}`}
                className="flex items-center justify-between border-t border-gold/30 px-4 py-2 text-sm text-chest transition-colors hover:bg-chest/5"
              >
                <span>View win history</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
