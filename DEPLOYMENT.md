# Deployment — EHRiva (actual setup, updated Aug 20, 2026)

Internal ops doc (not shown on the repo front page — README.md is the public one).

## Reality check: the site runs on a Worker, not Pages

- The static site is deployed as the Cloudflare Worker **`ehriva-com`** attached to the
  **custom domain `ehriva.com`** (created in the dashboard / via wrangler).
- The waitlist is a **separate Worker `ehriva-waitlist`** on the route
  **`ehriva.com/api/*`**, backed by the KV namespace **`WAITLIST`**
  (`8bbcb84b…d17`). Zone routes take precedence over the custom-domain Worker, so
  `/api/*` reaches the waitlist while everything else hits the site Worker.

## Waitlist worker — deploy & config

Config: `wrangler.jsonc` (name `ehriva-waitlist`, main `worker-waitlist.js`,
KV binding `WAITLIST`, route `ehriva.com/api/*`).

```bash
npx wrangler deploy          # from ehriva-site/
npx wrangler tail --name ehriva-waitlist
```

Endpoints (live):
- `GET  https://ehriva.com/api/waitlist` → `{"ok":true,"service":"ehriva-waitlist","signups":N}`
- `POST https://ehriva.com/api/waitlist` `{email, org?}` → stores in KV

Signups live in KV under `waitlist:` keys; view/delete:

```bash
npx wrangler kv key list   --namespace-id 8bbcb84baa0f4f54871378a052727d17
npx wrangler kv key delete --namespace-id 8bbcb84baa0f4f54871378a052727d17 "<key>"
```

## Static site updates

The site Worker (`ehriva-com`) was created outside this repo's automation — pushing to
GitHub does **not** redeploy it. To update the live site, redeploy the Worker with the
repo contents (or via the dashboard's Quick Edit). **TODO: wire the site Worker to
auto-deploy from `main`** (e.g., Workers Builds / CI), or migrate to Pages + Git
integration if preferred.

## Old Pages notes (superseded)

Cloudflare Pages was never actually used for ehriva.com. The original Pages steps are
stored in git history; the `_redirects` file is inert on Workers (harmless).
