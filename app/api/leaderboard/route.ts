import { NextResponse } from 'next/server';
import redis from '@/lib/redis';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const keys = await redis.keys('player:*');
    if (!keys || keys.length === 0) return NextResponse.json([]);
    
    const players = await Promise.all(
      keys.map(async (key) => {
        const name = key.replace('player:', '');
        const data = await redis.hgetall(key) as Record<string, string>;
        return { 
          name, 
          wins: parseInt(data?.wins || '0'),
          nickname: data?.nickname || 'The Tycoon',
          avatar: data?.avatar || '🎩',
          country: data?.country || '🏛️ Government',
          color: data?.color || '#ffffff'
        };
      })
    );
    
    players.sort((a, b) => b.wins - a.wins);
    return NextResponse.json(players);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}