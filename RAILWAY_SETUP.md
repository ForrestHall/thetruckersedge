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
- **Do NOT add `NODE_ENV`** — it breaks the build. The start command sets it for runtime.

## 3. Start Command
- Use default from `railway.json`: `NODE_ENV=development npm start`
- NODE_ENV=development is required at runtime so Payload pushes the schema (only runs in non-production)
- Do NOT override with `npm run migrate`

## 4. Deploy
- Push to GitHub; Railway auto-deploys
- First load may take ~30s while tables are created
- Then visit `/admin` to create your first user
