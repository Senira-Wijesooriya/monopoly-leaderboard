import { NextResponse } from "next/server";
import { updateProfile } from "@/lib/redis";

export async function POST(req: Request) {
  const secret = req.headers.get("x-admin-secret");
  if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const player = typeof body?.player === "string" ? body.player : "";

    if (!player.trim()) {
      return NextResponse.json({ error: "Player name is required" }, { status: 400 });
    }

    const data = await updateProfile(player, {
      nickname: typeof body?.nickname === "string" ? body.nickname : undefined,
      avatarUrl: typeof body?.avatarUrl === "string" ? body.avatarUrl : undefined,
    });
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "Failed to update profile";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
