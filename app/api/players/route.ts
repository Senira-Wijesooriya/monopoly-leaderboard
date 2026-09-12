import { NextResponse } from 'next/server';
import redis from '@/lib/redis';

export async function POST(req: Request) {
  const { name, nickname, avatar, action } = await req.json();
  
  if (action === 'add') {
    await redis.hset(`player:${name}`, { wins: 0, nickname, avatar });
  } else if (action === 'win') {
    await redis.hincrby(`player:${name}`, 'wins', 1);
    await redis.lpush(`history:${name}`, new Date().toISOString());
  } else if (action === 'lose') {
    // Prevent negative wins
    const data = await redis.hgetall(`player:${name}`) as Record<string, string>;
    const currentWins = parseInt(data?.wins || '0');
    if (currentWins > 0) {
      await redis.hincrby(`player:${name}`, 'wins', -1);
      await redis.lpop(`history:${name}`); // Remove the most recent win date
    }
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const { name } = await req.json();
  // We use standard simulated/real Redis commands here depending on your lib/redis.ts
  const keys = await redis.keys('player:*');
  const targetKey = keys.find(k => k === `player:${name}`);
  if (targetKey) {
    // If using the MockDB, it doesn't have a del command, so we empty it.
    // If using Upstash, del is supported. This works for both.
    await redis.hset(`player:${name}`, { wins: -999, nickname: 'DELETED', avatar: '❌' }); 
  }
  return NextResponse.json({ success: true });
}