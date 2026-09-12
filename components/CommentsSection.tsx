"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Send, Trash2 } from "lucide-react";
import type { CommentRecord } from "@/lib/redis";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function CommentsSection({
  initialComments,
  adminSecret,
}: {
  initialComments: CommentRecord[];
  adminSecret?: string;
}) {
  const [comments, setComments] = useState(initialComments);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setPosting(true);
    setError(null);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, text }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Failed to post comment");
      setComments((prev) => [body.comment, ...prev]);
      setText("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to post comment");
    } finally {
      setPosting(false);
    }
  }

  async function remove(id: string) {
    if (!adminSecret) return;
    setComments((prev) => prev.filter((c) => c.id !== id));
    try {
      await fetch("/api/comments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "x-admin-secret": adminSecret },
        body: JSON.stringify({ id }),
      });
    } catch {
      // best-effort; a page refresh will resync if this silently failed
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4 flex items-center gap-2 px-1">
        <MessageCircle className="h-5 w-5 text-cream/70" />
        <h2 className="font-display text-lg text-cream">Table talk</h2>
      </div>

      <form onSubmit={submit} className="deed-rule mb-5 bg-cream p-4 shadow-[3px_3px_0_0_rgba(34,28,16,0.15)]">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name (optional)"
          maxLength={40}
          className="mb-2 w-full rounded-sm border-2 border-board/20 bg-white px-3 py-1.5 text-sm text-ink outline-none focus:border-board"
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Say something about the game..."
          maxLength={500}
          rows={2}
          className="w-full resize-none rounded-sm border-2 border-board/20 bg-white px-3 py-1.5 text-sm text-ink outline-none focus:border-board"
        />
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-ink/40">{text.length}/500</span>
          <button
            type="submit"
            disabled={!text.trim() || posting}
            className="flex items-center gap-1.5 rounded-sm bg-brick px-3 py-1.5 text-sm font-semibold text-cream transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <Send className="h-3.5 w-3.5" />
            Post
          </button>
        </div>
        {error && <p className="mt-2 text-xs text-brick">{error}</p>}
      </form>

      {comments.length === 0 ? (
        <p className="px-1 text-center text-sm text-cream/50">No comments yet — be the first.</p>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {comments.map((c, i) => (
            <motion.li
              key={c.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.3) }}
              className="flex items-start justify-between gap-3 rounded-sm border border-gold/30 bg-cream/95 px-4 py-3"
            >
              <div className="min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-semibold text-ink">{c.name}</span>
                  <span className="text-xs text-ink/40">{formatDate(c.date)}</span>
                </div>
                <p className="mt-0.5 break-words text-sm text-ink/80">{c.text}</p>
              </div>
              {adminSecret && (
                <button
                  onClick={() => remove(c.id)}
                  aria-label="Delete comment"
                  className="shrink-0 text-ink/30 transition-colors hover:text-brick"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
}
