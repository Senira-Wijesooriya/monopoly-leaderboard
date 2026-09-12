import { NextResponse } from 'next/server';
import redis from '@/lib/redis';

export const dynamic = 'force-dynamic';

export async function GET() {
  const settings = await redis.hgetall('settings:global');
  return NextResponse.json(settings || {});
}

export async function POST(req: Request) {
  const { topRegion } = await req.json();
  if (topRegion) {
    await redis.hset('settings:global', { topRegion });
  }
  return NextResponse.json({ success: true });
}