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
export type PlayerData = {
  nickname?: string;
  avatarUrl?: string;
  wins: WinRecord[];
};
export type LeaderboardData = { players: Record<string, PlayerData> };
export type CommentRecord = { id: string; name: string; text: string; date: string };

const KEY = "monopoly:leaderboard";
const COMMENTS_KEY = "monopoly:comments";
const MAX_COMMENTS = 200;

// Older deployments stored each player as a plain array of wins. This
// upgrades that shape on read so nothing already recorded gets lost.
function normalizePlayer(raw: unknown): PlayerData {
  if (Array.isArray(raw)) {
    return { wins: raw as WinRecord[] };
  }
  const obj = (raw ?? {}) as Partial<PlayerData>;
  return {
    nickname: obj.nickname || undefined,
    avatarUrl: obj.avatarUrl || undefined,
    wins: Array.isArray(obj.wins) ? obj.wins : [],
  };
}

export async function getLeaderboard(): Promise<LeaderboardData> {
  const raw = await redis.get<{ players?: Record<string, unknown> }>(KEY);
  const rawPlayers = raw?.players ?? {};
  const players: Record<string, PlayerData> = {};
  for (const [name, value] of Object.entries(rawPlayers)) {
    players[name] = normalizePlayer(value);
  }
  return { players };
}

async function saveLeaderboard(data: LeaderboardData) {
  await redis.set(KEY, data);
}

export async function addWin(
  playerName: string,
  date?: string,
  profile?: { nickname?: string; avatarUrl?: string }
): Promise<LeaderboardData> {
  const name = playerName.trim();
  if (!name) throw new Error("Player name is required");
  if (name.length > 40) throw new Error("Player name is too long");

  const data = await getLeaderboard();
  if (!data.players[name]) {
    data.players[name] = { wins: [], nickname: profile?.nickname, avatarUrl: profile?.avatarUrl };
  } else if (profile) {
    if (profile.nickname) data.players[name].nickname = profile.nickname;
    if (profile.avatarUrl) data.players[name].avatarUrl = profile.avatarUrl;
  }
  data.players[name].wins.push({ date: date ?? new Date().toISOString() });
  await saveLeaderboard(data);
  return data;
}

export async function undoLastWin(playerName: string): Promise<LeaderboardData> {
  const name = playerName.trim();
  const data = await getLeaderboard();
  const player = data.players[name];
  if (!player || player.wins.length === 0) {
    throw new Error("No wins to remove for this player");
  }
  player.wins.pop();
  await saveLeaderboard(data);
  return data;
}

export async function updateProfile(
  playerName: string,
  profile: { nickname?: string; avatarUrl?: string }
): Promise<LeaderboardData> {
  const name = playerName.trim();
  const data = await getLeaderboard();
  if (!data.players[name]) throw new Error("Player not found");
  if (profile.nickname !== undefined) {
    data.players[name].nickname = profile.nickname.trim() || undefined;
  }
  if (profile.avatarUrl !== undefined) {
    data.players[name].avatarUrl = profile.avatarUrl.trim() || undefined;
  }
  await saveLeaderboard(data);
  return data;
}

export function sortedPlayers(data: LeaderboardData) {
  return Object.entries(data.players)
    .map(([name, p]) => ({
      name,
      nickname: p.nickname,
      avatarUrl: p.avatarUrl,
      total: p.wins.length,
    }))
    .sort((a, b) => b.total - a.total);
}

export async function getComments(limit = 50): Promise<CommentRecord[]> {
  const raw = await redis.lrange<string>(COMMENTS_KEY, 0, limit - 1);
  return raw
    .map((item) => {
      try {
        return typeof item === "string" ? (JSON.parse(item) as CommentRecord) : (item as CommentRecord);
      } catch {
        return null;
      }
    })
    .filter((c): c is CommentRecord => c !== null);
}

export async function addComment(name: string, text: string): Promise<CommentRecord> {
  const trimmedText = text.trim();
  if (!trimmedText) throw new Error("Comment can't be empty");
  if (trimmedText.length > 500) throw new Error("Comment is too long (max 500 characters)");

  const trimmedName = name.trim().slice(0, 40) || "Anonymous";
  const comment: CommentRecord = {
    id: crypto.randomUUID(),
    name: trimmedName,
    text: trimmedText,
    date: new Date().toISOString(),
  };

  await redis.lpush(COMMENTS_KEY, JSON.stringify(comment));
  await redis.ltrim(COMMENTS_KEY, 0, MAX_COMMENTS - 1);
  return comment;
}

export async function deleteComment(id: string): Promise<void> {
  const raw = await redis.lrange<string>(COMMENTS_KEY, 0, MAX_COMMENTS - 1);
  const match = raw.find((item) => {
    try {
      const parsed = typeof item === "string" ? (JSON.parse(item) as CommentRecord) : (item as CommentRecord);
      return parsed.id === id;
    } catch {
      return false;
    }
  });
  if (match) {
    await redis.lrem(COMMENTS_KEY, 1, match);
  }
}
