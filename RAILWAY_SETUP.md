# Railway Deployment Checklist

## 1. Add PostgreSQL
- Railway dashboard → your project → **+ New** → **Database** → **Add PostgreSQL**
- Wait for it to spin up

## 2. Set Variables (app service)
- Click your **app** (not Postgres) → **Variables** tab
- Add/ensure:
  - `DATABASE_URL` = `${{Postgres.DATABASE_URL}}` (reference the Postgres plugin)
  - `PAYLOAD_SECRET` = random 32+ char string from https://generate-secret.vercel.app/32
  - `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` = random 32-char string (required for Payload admin in production; use same generator as PAYLOAD_SECRET)
  - `NEXT_PUBLIC_SERVER_URL` = `https://thetruckersedge.com` (or your Railway URL)
## 3. Start Command
- Use default from `railway.json`: `npx tsx scripts/init-db.ts && npm start`
- The init step must run before the app

## 3b. Seed News Feeds (one-time)
- With Railway CLI: `railway run npx tsx scripts/seed-news-feeds.ts` (runs against your linked project’s DB)
- Or add `&& npx tsx scripts/seed-news-feeds.ts` to the start command for one deploy, then remove it

## 4. Deploy
- Push to GitHub; Railway auto-deploys
- First load may take ~30s: init creates tables, seed adds the CDL General Knowledge test
- Visit `/practice-tests` to take the test, `/admin` to create your first user

## 5. If admin/create-first-user shows 500 or "Cannot destructure property 'config'"
- Ensure `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` is set (32+ chars). Without it, Server Actions fail in production.
- Redeploy after adding the variable.

## 6. AI Viral News (optional)
- Add `XAI_API_KEY` from [xAI Console](https://console.x.ai/) for AI headline scoring/rewriting
- **In-app trigger (no cron):** Open `/admin`, log in, and use the "Process News Now" button on the dashboard. Uses your admin session.
- **External cron:** Add `CRON_SECRET` and configure cron to POST `https://your-app.up.railway.app/api/cron/process-news` every 24 hours with `Authorization: Bearer $CRON_SECRET` or `x-cron-secret: $CRON_SECRET`. Cron expression for daily at midnight UTC: `0 0 * * *`

## 7. If "relation articles does not exist" persists
- **Start command:** Must be `npx tsx scripts/init-db.ts && npm start`. Check App **Settings** → Deploy → Start Command. Remove any custom override so Railway uses railway.json.
- **Redeploy** — the init script must run before the app starts.
