import { NextResponse } from "next/server";
import { addWin, undoLastWin } from "@/lib/redis";

function isAuthorized(req: Request) {
  const secret = req.headers.get("x-admin-secret");
  return Boolean(process.env.ADMIN_SECRET) && secret === process.env.ADMIN_SECRET;
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const player = typeof body?.player === "string" ? body.player : "";
    const date = typeof body?.date === "string" ? body.date : undefined;
    const nickname = typeof body?.nickname === "string" ? body.nickname : undefined;
    const avatarUrl = typeof body?.avatarUrl === "string" ? body.avatarUrl : undefined;

    if (!player.trim()) {
      return NextResponse.json({ error: "Player name is required" }, { status: 400 });
    }

    const data = await addWin(player, date, { nickname, avatarUrl });
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "Failed to record win";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const player = typeof body?.player === "string" ? body.player : "";

    if (!player.trim()) {
      return NextResponse.json({ error: "Player name is required" }, { status: 400 });
    }

    const data = await undoLastWin(player);
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "Failed to remove win";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
