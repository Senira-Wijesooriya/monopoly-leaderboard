import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-board px-6 text-center">
      <p className="font-display text-3xl text-cream">Nothing on this square</p>
      <p className="max-w-xs text-sm text-cream/70">
        This page doesn&apos;t exist, or the link isn&apos;t right.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-sm bg-gold px-4 py-2 text-sm font-semibold text-ink hover:opacity-90"
      >
        Go to leaderboard
      </Link>
    </main>
  );
}
