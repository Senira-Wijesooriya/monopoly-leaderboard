import { NextResponse } from "next/server";
import { getLeaderboard } from "@/lib/redis";

// Always read fresh data — this is a live leaderboard, not a static page.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getLeaderboard();
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to load leaderboard" }, { status: 500 });
  }
}
