import { NextResponse } from 'next/server';
import redis from '@/lib/redis';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const { name, nickname, avatar, country, color, action } = await req.json();
  
  if (action === 'add') {
    // Defaults to Government and White color on creation
    await redis.hset(`player:${name}`, { wins: 0, nickname, avatar, country: '🏛️ Government', color: '#ffffff' });
  } else if (action === 'update_profile') {
    // Updates just the country and color for a specific user
    await redis.hset(`player:${name}`, { country, color });
  } else if (action === 'win') {
    await redis.hincrby(`player:${name}`, 'wins', 1);
    await redis.lpush(`history:${name}`, new Date().toISOString());
  } else if (action === 'lose') {
    const data = await redis.hgetall(`player:${name}`) as Record<string, string>;
    const currentWins = parseInt(data?.wins || '0');
    if (currentWins > 0) {
      await redis.hincrby(`player:${name}`, 'wins', -1);
      await redis.lpop(`history:${name}`);
    }
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const { name } = await req.json();
  await redis.del(`player:${name}`);
  return NextResponse.json({ success: true });
}