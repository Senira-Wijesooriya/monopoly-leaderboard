"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { PartyPopper, Plus, ExternalLink } from "lucide-react";
import TokenIcon from "./TokenIcon";
import type { LeaderboardData } from "@/lib/redis";

export default function AdminForm({
  secret,
  initialData,
}: {
  secret: string;
  initialData: LeaderboardData;
}) {
  const [data, setData] = useState(initialData);
  const [newName, setNewName] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const players = Object.keys(data.players).sort((a, b) => a.localeCompare(b));

  async function recordWin(player: string) {
    const trimmed = player.trim();
    if (!trimmed) return;
    setBusy(trimmed);
    setError(null);
    try {
      const res = await fetch("/api/win", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": secret,
        },
        body: JSON.stringify({ player: trimmed }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Something went wrong");
      }
      const updated: LeaderboardData = await res.json();
      setData(updated);
      setNewName("");
      setToast(`Win recorded for ${trimmed}!`);
      setTimeout(() => setToast(null), 2200);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 pb-20 pt-10">
      <div className="deed-rule bg-cream p-5 shadow-[3px_3px_0_0_rgba(34,28,16,0.15)]">
        <h2 className="font-display text-lg text-board">Quick +1</h2>
        <p className="mt-1 text-xs text-ink/60">Tap a regular to log another win for them.</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {players.length === 0 && (
            <p className="text-sm text-ink/50">No players yet — add the first one below.</p>
          )}
          {players.map((name) => (
            <button
              key={name}
              onClick={() => recordWin(name)}
              disabled={busy === name}
              className="flex items-center gap-2 rounded-full border-2 border-board bg-board/5 px-3 py-1.5 text-sm font-medium text-board transition-colors hover:bg-board hover:text-cream disabled:opacity-50"
            >
              <TokenIcon name={name} className="h-3.5 w-3.5" />
              {name}
              <span className="text-xs text-ink/50">
                {data.players[name].length}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="deed-rule mt-5 bg-cream p-5 shadow-[3px_3px_0_0_rgba(34,28,16,0.15)]">
        <h2 className="font-display text-lg text-board">New player</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            recordWin(newName);
          }}
          className="mt-3 flex gap-2"
        >
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Player name"
            maxLength={40}
            className="min-w-0 flex-1 rounded-sm border-2 border-board/30 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-board"
          />
          <button
            type="submit"
            disabled={!newName.trim() || busy === newName.trim()}
            className="flex shrink-0 items-center gap-1.5 rounded-sm bg-brick px-4 py-2 text-sm font-semibold text-cream transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Record win
          </button>
        </form>
      </div>

      {error && (
        <p className="mt-4 text-center text-sm text-brick" role="alert">
          {error}
        </p>
      )}

      <div className="mt-8 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-chest hover:underline"
        >
          View public leaderboard
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="fixed bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-board px-5 py-3 text-sm font-medium text-cream shadow-lg"
          >
            <PartyPopper className="h-4 w-4 text-gold" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
