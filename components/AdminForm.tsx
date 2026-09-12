"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { PartyPopper, Plus, Minus, Pencil, ExternalLink, Check, X } from "lucide-react";
import Avatar from "./Avatar";
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
  const [newNickname, setNewNickname] = useState("");
  const [newAvatarUrl, setNewAvatarUrl] = useState("");
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [editingPlayer, setEditingPlayer] = useState<string | null>(null);
  const [editNickname, setEditNickname] = useState("");
  const [editAvatarUrl, setEditAvatarUrl] = useState("");

  const players = Object.keys(data.players).sort((a, b) => a.localeCompare(b));

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }

  async function recordWin(player: string, profile?: { nickname?: string; avatarUrl?: string }) {
    const trimmed = player.trim();
    if (!trimmed) return;
    setBusyKey(`${trimmed}:add`);
    setError(null);
    try {
      const res = await fetch("/api/win", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-secret": secret },
        body: JSON.stringify({ player: trimmed, ...profile }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Something went wrong");
      setData(body);
      setNewName("");
      setNewNickname("");
      setNewAvatarUrl("");
      showToast(`Win recorded for ${trimmed}!`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusyKey(null);
    }
  }

  async function undoWin(player: string) {
    setBusyKey(`${player}:undo`);
    setError(null);
    try {
      const res = await fetch("/api/win", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "x-admin-secret": secret },
        body: JSON.stringify({ player }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Something went wrong");
      setData(body);
      showToast(`Removed last win for ${player}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusyKey(null);
    }
  }

  function openEdit(player: string) {
    setEditingPlayer(player);
    setEditNickname(data.players[player]?.nickname ?? "");
    setEditAvatarUrl(data.players[player]?.avatarUrl ?? "");
  }

  async function saveEdit(player: string) {
    setBusyKey(`${player}:edit`);
    setError(null);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-secret": secret },
        body: JSON.stringify({ player, nickname: editNickname, avatarUrl: editAvatarUrl }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Something went wrong");
      setData(body);
      setEditingPlayer(null);
      showToast(`Updated ${player}'s profile`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusyKey(null);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 pb-10 pt-10">
      <div className="deed-rule bg-cream p-5 shadow-[3px_3px_0_0_rgba(34,28,16,0.15)]">
        <h2 className="font-display text-lg text-board">Players</h2>
        <p className="mt-1 text-xs text-ink/60">
          +1 to log a win, −1 to undo the most recent one, pencil to edit their profile.
        </p>

        <div className="mt-4 flex flex-col gap-2">
          {players.length === 0 && (
            <p className="text-sm text-ink/50">No players yet — add the first one below.</p>
          )}
          {players.map((name) => {
            const player = data.players[name];
            const isEditing = editingPlayer === name;
            return (
              <div key={name} className="rounded-sm border-2 border-board/15 bg-white/40">
                <div className="flex items-center gap-3 px-3 py-2.5">
                  <Avatar
                    name={name}
                    avatarUrl={player.avatarUrl}
                    className="h-9 w-9 shrink-0 rounded-full border-2 border-board bg-board/5"
                    iconClassName="h-4 w-4 text-board"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">{name}</p>
                    <p className="truncate text-xs text-ink/50">
                      {player.nickname ? `"${player.nickname}" · ` : ""}
                      {player.wins.length} {player.wins.length === 1 ? "win" : "wins"}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <button
                      onClick={() => openEdit(name)}
                      aria-label={`Edit ${name}'s profile`}
                      className="rounded-sm p-1.5 text-board/60 transition-colors hover:bg-board/10 hover:text-board"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => undoWin(name)}
                      disabled={player.wins.length === 0 || busyKey === `${name}:undo`}
                      aria-label={`Undo last win for ${name}`}
                      className="rounded-sm border-2 border-board/30 p-1.5 text-board transition-colors hover:bg-board/10 disabled:opacity-30"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => recordWin(name)}
                      disabled={busyKey === `${name}:add`}
                      aria-label={`Record win for ${name}`}
                      className="rounded-sm bg-board p-1.5 text-cream transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {isEditing && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-board/15 px-3"
                    >
                      <div className="flex flex-col gap-2 py-3">
                        <input
                          type="text"
                          value={editNickname}
                          onChange={(e) => setEditNickname(e.target.value)}
                          placeholder="Nickname"
                          maxLength={40}
                          className="rounded-sm border-2 border-board/20 bg-white px-2.5 py-1.5 text-sm text-ink outline-none focus:border-board"
                        />
                        <input
                          type="url"
                          value={editAvatarUrl}
                          onChange={(e) => setEditAvatarUrl(e.target.value)}
                          placeholder="Profile picture URL"
                          className="rounded-sm border-2 border-board/20 bg-white px-2.5 py-1.5 text-sm text-ink outline-none focus:border-board"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveEdit(name)}
                            disabled={busyKey === `${name}:edit`}
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-sm bg-board py-1.5 text-sm font-semibold text-cream transition-opacity hover:opacity-90 disabled:opacity-50"
                          >
                            <Check className="h-3.5 w-3.5" />
                            Save
                          </button>
                          <button
                            onClick={() => setEditingPlayer(null)}
                            className="flex items-center justify-center gap-1.5 rounded-sm border-2 border-board/30 px-3 py-1.5 text-sm font-semibold text-board transition-colors hover:bg-board/10"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      <div className="deed-rule mt-5 bg-cream p-5 shadow-[3px_3px_0_0_rgba(34,28,16,0.15)]">
        <h2 className="font-display text-lg text-board">New player</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            recordWin(newName, { nickname: newNickname, avatarUrl: newAvatarUrl });
          }}
          className="mt-3 flex flex-col gap-2"
        >
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Player name"
            maxLength={40}
            className="rounded-sm border-2 border-board/30 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-board"
          />
          <input
            type="text"
            value={newNickname}
            onChange={(e) => setNewNickname(e.target.value)}
            placeholder="Nickname (optional)"
            maxLength={40}
            className="rounded-sm border-2 border-board/30 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-board"
          />
          <input
            type="url"
            value={newAvatarUrl}
            onChange={(e) => setNewAvatarUrl(e.target.value)}
            placeholder="Profile picture URL (optional)"
            className="rounded-sm border-2 border-board/30 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-board"
          />
          <button
            type="submit"
            disabled={!newName.trim() || busyKey === `${newName.trim()}:add`}
            className="flex items-center justify-center gap-1.5 rounded-sm bg-brick px-4 py-2 text-sm font-semibold text-cream transition-opacity hover:opacity-90 disabled:opacity-50"
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
            className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-board px-5 py-3 text-sm font-medium text-cream shadow-lg"
          >
            <PartyPopper className="h-4 w-4 text-gold" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
