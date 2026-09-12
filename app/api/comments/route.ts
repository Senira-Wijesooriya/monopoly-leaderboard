import { NextResponse } from 'next/server';
import redis from '@/lib/redis';

export const dynamic = 'force-dynamic';

export async function GET() {
  const comments = await redis.lrange('monopoly_comments', 0, -1);
  return NextResponse.json((comments || []).map((c: any) => JSON.parse(c as string)));
}

export async function POST(req: Request) {
  const { text } = await req.json();
  const comment = { id: Date.now().toString(), text, timestamp: new Date().toISOString() };
  await redis.lpush('monopoly_comments', JSON.stringify(comment));
  return NextResponse.json(comment);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  const comments = await redis.lrange('monopoly_comments', 0, -1);
  for (const c of (comments || [])) {
    const parsed = JSON.parse(c as string);
    if (parsed.id === id) {
      await redis.lrem('monopoly_comments', 1, c);
      break;
    }
  }
  return NextResponse.json({ success: true });
}