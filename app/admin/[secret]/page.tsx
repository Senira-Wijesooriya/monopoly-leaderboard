import { notFound } from "next/navigation";
import { getLeaderboard, getComments } from "@/lib/redis";
import Hero from "@/components/Hero";
import AdminForm from "@/components/AdminForm";
import CommentsSection from "@/components/CommentsSection";

export const dynamic = "force-dynamic";

export default async function AdminPage({
  params,
}: {
  params: Promise<{ secret: string }>;
}) {
  const { secret } = await params;
  const configured = process.env.ADMIN_SECRET;

  // No matching env var, or wrong secret in the URL -> pretend the route
  // doesn't exist at all, rather than showing a "wrong password" screen.
  if (!configured || secret !== configured) {
    notFound();
  }

  const [data, comments] = await Promise.all([getLeaderboard(), getComments()]);

  return (
    <main className="min-h-screen pb-16">
      <Hero eyebrow="Banker's Desk" subtitle="Only visible to you — bookmark this page." />
      <AdminForm secret={secret} initialData={data} />
      <div className="mt-4 px-4">
        <CommentsSection initialComments={comments} adminSecret={secret} />
      </div>
    </main>
  );
}
