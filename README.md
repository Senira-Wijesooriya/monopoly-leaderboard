# Monopoly Night Leaderboard

A small Next.js app:

- **`/`** — public leaderboard. Animated bar chart of total wins per player. Anyone with the link can view it.
- **`/players/[name]`** — a player's full win history (dates), reached via "View win history" on the leaderboard.
- **`/admin/<your-secret>`** — the only place wins get recorded. Nobody can find or use it without the exact secret in the URL.

Data is stored in a small Redis database (via Upstash, through Vercel's Marketplace) as a single JSON record.

Full setup steps (Vercel account, GitHub, environment variables) are in the chat message this project came with. This file is just a quick reference.

## Local development (optional)

```bash
npm install
cp .env.local.example .env.local   # then fill in the values, see below
npm run dev
```

## Environment variables

| Variable | Where it comes from |
|---|---|
| `KV_REST_API_URL` | Auto-filled when you add the "Upstash Redis" integration in Vercel's Storage tab |
| `KV_REST_API_TOKEN` | Same as above |
| `ADMIN_SECRET` | You generate this yourself, e.g. `openssl rand -hex 20` |

Your admin page is `https://<your-app>.vercel.app/admin/<ADMIN_SECRET>` — bookmark it, don't share it.

## Notes

- The admin route returns a plain 404 if the secret is wrong, rather than a "wrong password" page — this way the route's existence isn't given away.
- The leaderboard and player pages are rendered fresh on every request (`force-dynamic`), so wins show up immediately after you record them.
- Player token icons (car, ship, crown, etc.) are assigned automatically per name — no setup needed.
