import { NextResponse } from "next/server";
import { addWin } from "@/lib/redis";

export async function POST(req: Request) {
  const secret = req.headers.get("x-admin-secret");

  if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) {
    // Deliberately generic message — don't confirm whether a secret was close.
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const player = typeof body?.player === "string" ? body.player : "";
    const date = typeof body?.date === "string" ? body.date : undefined;

    if (!player.trim()) {
      return NextResponse.json({ error: "Player name is required" }, { status: 400 });
    }

    const data = await addWin(player, date);
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to record win" }, { status: 500 });
  }
}
