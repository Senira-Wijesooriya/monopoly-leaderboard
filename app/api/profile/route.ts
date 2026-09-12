import { NextResponse } from "next/server";
import redis from "@/lib/redis";

export async function POST(req: Request) {
  const secret = req.headers.get("x-admin-secret");
  
  try {
    const { name, nickname, avatar } = await req.json();
    
    if (name) {
      // Use standard Redis hset instead of the old named export
      await redis.hset(`player:${name}`, { nickname, avatar });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}