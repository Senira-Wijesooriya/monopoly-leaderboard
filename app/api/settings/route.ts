import { NextResponse } from 'next/server';
import redis from '@/lib/redis';

export async function GET() {
  const colors = await redis.hgetall('settings:colors');
  return NextResponse.json(colors || {});
}

export async function POST(req: Request) {
  const { colors } = await req.json();
  if (colors && Object.keys(colors).length > 0) {
    await redis.hset('settings:colors', colors);
  }
  return NextResponse.json({ success: true });
}