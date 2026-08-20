# Deployment - EHRiva (actual setup, updated Aug 20, 2026)

Internal ops doc (not shown on the repo front page - README.md is the public one).

## Reality check: the site runs on a Worker, not Pages

- The static site is the Cloudflare Worker **`ehriva-com`** - a **Workers Static
  Assets** worker deployed from `public/` via `wrangler.site.jsonc`. Attached to the
  custom domain `ehriva.com` (and a zone route `ehriva.com/*`).
- The waitlist is a **separate Worker `ehriva-waitlist`** on the zone route
  **`ehriva.com/api/*`** (`wrangler.jsonc`), backed by KV namespace `WAITLIST`.
  Specific routes beat broad ones, so `/api/*` reaches the waitlist and everything
  else hits the site worker.

## ⚠️ History / warning

On Aug 19–20 the site worker (`ehriva-com`) was **overwritten with the waitlist code**
(versions uploaded ~22:50–23:09 UTC) - every request then returned waitlist JSON.
Fixed by redeploying `ehriva-com` as a static-assets worker. **Never deploy
`worker-waitlist.js` to `ehriva-com`** - the waitlist lives only on `ehriva-waitlist`.

## Site worker - update the live site

```bash
cp <new files> public/        # index.html, ehriva.png, ... (see public/)
npx wrangler deploy --config wrangler.site.jsonc   # from ehriva-site/
```

The site Worker does **not** auto-deploy from GitHub pushes - run the command above
(or set up Workers Builds CI) after each site change.

## Waitlist worker - deploy & config

Config: `wrangler.jsonc` (name `ehriva-waitlist`, main `worker-waitlist.js`,
KV binding `WAITLIST`, route `ehriva.com/api/*`).

```bash
npx wrangler deploy          # from ehriva-site/
npx wrangler tail --name ehriva-waitlist
```

Endpoints (live):
- `GET  https://ehriva.com/api/waitlist` → `{"ok":true,"service":"ehriva-waitlist","signups":N}`
- `POST https://ehriva.com/api/waitlist` `{email, org?}` → stores in KV

Signups live in KV under `waitlist:` keys; view/delete/export:

```bash
npx wrangler kv key list   --namespace-id 8bbcb84baa0f4f54871378a052727d17
npx wrangler kv key delete --namespace-id 8bbcb84baa0f4f54871378a052727d17 "<key>"
node scripts/export-waitlist.js   # exports to exports/ (gitignored)
```

## Old Pages notes (superseded)

Cloudflare Pages was never actually used for ehriva.com. The original Pages steps are
stored in git history; the `_redirects` file is inert on Workers (harmless).
