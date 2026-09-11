import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getLeaderboard } from "@/lib/redis";
import Hero from "@/components/Hero";
import WinHistory from "@/components/WinHistory";
import TokenIcon from "@/components/TokenIcon";

export const dynamic = "force-dynamic";

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name: rawName } = await params;
  const name = decodeURIComponent(rawName);
  const data = await getLeaderboard();
  const wins = data.players[name];

  if (!wins) notFound();

  return (
    <main className="min-h-screen pb-16">
      <Hero eyebrow={name} subtitle={`${wins.length} ${wins.length === 1 ? "win" : "wins"} logged`} />

      <div className="px-4 pt-10">
        <div className="mx-auto mb-6 flex max-w-md items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-board bg-board/5">
            <TokenIcon name={name} className="h-4.5 w-4.5 text-board" />
          </span>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-chest hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to leaderboard
          </Link>
        </div>

        <WinHistory dates={wins.map((w) => w.date)} />
      </div>
    </main>
  );
}
