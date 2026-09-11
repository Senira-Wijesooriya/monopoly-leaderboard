import { Redis } from "@upstash/redis";

// The Vercel Marketplace "Upstash Redis" integration injects these two
// env vars automatically once you add the integration in the Storage tab.
const url = process.env.KV_REST_API_URL;
const token = process.env.KV_REST_API_TOKEN;

if (!url || !token) {
  // Thrown lazily (inside request handlers) rather than at import time
  // in dev, so `next build` still succeeds before the integration is set up.
  console.warn(
    "KV_REST_API_URL / KV_REST_API_TOKEN are not set. Add the Upstash Redis " +
      "integration in your Vercel project's Storage tab, then pull the env vars."
  );
}

export const redis = new Redis({
  url: url ?? "http://localhost:0",
  token: token ?? "placeholder",
});

export type WinRecord = { date: string };
export type LeaderboardData = { players: Record<string, WinRecord[]> };

const KEY = "monopoly:leaderboard";

export async function getLeaderboard(): Promise<LeaderboardData> {
  const data = await redis.get<LeaderboardData>(KEY);
  return data ?? { players: {} };
}

export async function addWin(playerName: string, date?: string): Promise<LeaderboardData> {
  const name = playerName.trim();
  if (!name) throw new Error("Player name is required");
  if (name.length > 40) throw new Error("Player name is too long");

  const data = await getLeaderboard();
  if (!data.players[name]) data.players[name] = [];
  data.players[name].push({ date: date ?? new Date().toISOString() });

  await redis.set(KEY, data);
  return data;
}

export function sortedPlayers(data: LeaderboardData) {
  return Object.entries(data.players)
    .map(([name, wins]) => ({ name, wins, total: wins.length }))
    .sort((a, b) => b.total - a.total);
}
