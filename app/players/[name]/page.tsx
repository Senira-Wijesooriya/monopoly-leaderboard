import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getLeaderboard } from "@/lib/redis";
import Hero from "@/components/Hero";
import WinHistory from "@/components/WinHistory";
import Avatar from "@/components/Avatar";

export const dynamic = "force-dynamic";

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name: rawName } = await params;
  const name = decodeURIComponent(rawName);
  const data = await getLeaderboard();
  const player = data.players[name];

  if (!player) notFound();

  return (
    <main className="min-h-screen pb-16">
      <Hero
        eyebrow={name}
        subtitle={`${player.wins.length} ${player.wins.length === 1 ? "win" : "wins"} logged`}
      />

      <div className="px-4 pt-10">
        <div className="mx-auto mb-6 flex max-w-md items-center gap-3">
          <Avatar
            name={name}
            avatarUrl={player.avatarUrl}
            className="h-9 w-9 rounded-full border-2 border-board bg-board/5"
            iconClassName="h-4.5 w-4.5 text-board"
          />
          <div className="min-w-0 flex-1">
            {player.nickname && (
              <p className="truncate text-sm italic text-cream/70">&ldquo;{player.nickname}&rdquo;</p>
            )}
          </div>
          <Link
            href="/"
            className="flex shrink-0 items-center gap-1.5 text-sm text-chest hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to leaderboard
          </Link>
        </div>

        <WinHistory dates={player.wins.map((w) => w.date)} />
      </div>
    </main>
  );
}
