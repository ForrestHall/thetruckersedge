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
  - `NODE_ENV` = `development` — **required** so Payload pushes the schema to create tables (Payload only auto-creates tables in non-production)

## 3. Start Command
- App **Settings** → Deploy → Start Command should be empty or `npm start`
- Do NOT use `npm run migrate` — schema is created automatically via `push: true`

## 4. Deploy
- Push to GitHub; Railway auto-deploys
- First load may take ~30s while tables are created
- Then visit `/admin` to create your first user
