# Railway Deployment Checklist

## 1. Add PostgreSQL
- Railway dashboard → your project → **+ New** → **Database** → **Add PostgreSQL**
- Wait for it to spin up

## 2. Set Variables (app service)
- Click your **app** (not Postgres) → **Variables** tab
- Add/ensure:
  - `DATABASE_URL` = `${{Postgres.DATABASE_URL}}` (reference the Postgres plugin)
  - `PAYLOAD_SECRET` = random 32+ char string from https://generate-secret.vercel.app/32
  - `NEXT_PUBLIC_SERVER_URL` = `https://thetruckersedge.com` (or your Railway URL)
## 3. Start Command
- Use default from `railway.json`: `npx tsx scripts/init-db.ts && npm start`
- The init script runs first, creates tables with NODE_ENV=development, then the app starts
- Do NOT override — the init step must run before the app

## 4. Deploy
- Push to GitHub; Railway auto-deploys
- First load may take ~30s: init creates tables, seed adds the CDL General Knowledge test
- Visit `/practice-tests` to take the test, `/admin` to create your first user

## 5. If "relation articles does not exist" persists
- **Start command:** Must be `npx tsx scripts/init-db.ts && npm start`. Check App **Settings** → Deploy → Start Command. Remove any custom override so Railway uses railway.json.
- **Redeploy** — the init script must run before the app starts.
