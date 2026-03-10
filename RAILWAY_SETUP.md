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
  - `NODE_ENV` = `development` — **required** so Payload auto-creates tables on first run

## 3. Start Command
- Use default from `railway.json`: `NODE_ENV=development npm start`
- NODE_ENV=development is required at runtime so Payload pushes the schema (only runs in non-production)
- Do NOT override with `npm run migrate`

## 4. Deploy
- Push to GitHub; Railway auto-deploys
- First load may take ~30s while tables are created
- Then visit `/admin` to create your first user

## 5. If "relation articles does not exist" persists
- **Start command:** App **Settings** → Deploy → Start Command. It MUST be `NODE_ENV=development npm start` (or empty so Railway uses railway.json). If you have a custom command, add `NODE_ENV=development` before `npm start`.
- **Variables:** Ensure `NODE_ENV` = `development` in Variables (our build script forces production during build, so this is safe).
- Redeploy after changes.
