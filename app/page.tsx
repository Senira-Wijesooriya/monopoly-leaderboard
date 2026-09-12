import { getLeaderboard, getComments, sortedPlayers } from "@/lib/redis";
import Hero from "@/components/Hero";
import LeaderboardBars from "@/components/LeaderboardBars";
import CommentsSection from "@/components/CommentsSection";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [data, comments] = await Promise.all([getLeaderboard(), getComments()]);
  const players = sortedPlayers(data);
  const totalGames = players.reduce((sum, p) => sum + p.total, 0);

  return (
    <main className="min-h-screen pb-16">
      <Hero
        subtitle={
          totalGames > 0
            ? `${totalGames} game${totalGames === 1 ? "" : "s"} on the books.`
            : "Bragging rights, tracked properly."
        }
      />
      <div className="px-4 pt-10">
        <LeaderboardBars players={players} />
      </div>
      <div className="mt-14 px-4">
        <CommentsSection initialComments={comments} />
      </div>
    </main>
  );
}
