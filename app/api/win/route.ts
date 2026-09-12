import { NextResponse } from 'next/server';
import redis from '@/lib/redis';

export async function POST(req: Request) {
  const { name, nickname, avatar, action } = await req.json();
  
  if (action === 'init') {
    const exists = await redis.exists(`player:${name}`);
    if (!exists) {
      await redis.hset(`player:${name}`, { wins: 0, nickname, avatar, country: '🏛️ Government', color: '#ffffff' });
    } else {
      await redis.hset(`player:${name}`, { nickname, avatar });
    }
  } else if (action === 'win') {
    await redis.hincrby(`player:${name}`, 'wins', 1);
    await redis.lpush(`history:${name}`, new Date().toISOString());
  }

  return NextResponse.json({ success: true });
}