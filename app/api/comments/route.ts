import { NextResponse } from "next/server";
import { addComment, deleteComment, getComments } from "@/lib/redis";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const comments = await getComments();
    return NextResponse.json({ comments });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to load comments" }, { status: 500 });
  }
}

// Intentionally open — anyone with the site link can comment, same as
// anyone with the link can view the leaderboard. Deleting is admin-only.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = typeof body?.name === "string" ? body.name : "";
    const text = typeof body?.text === "string" ? body.text : "";

    const comment = await addComment(name, text);
    return NextResponse.json({ comment });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to post comment";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const secret = req.headers.get("x-admin-secret");
  if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const id = typeof body?.id === "string" ? body.id : "";
    if (!id) {
      return NextResponse.json({ error: "Comment id is required" }, { status: 400 });
    }
    await deleteComment(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
  }
}
