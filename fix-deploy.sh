#!/usr/bin/env bash
# Fix & redeploy EHRiva Cloudflare Workers.
# Usage:  bash fix-deploy.sh      (requires wrangler login or CLOUDFLARE_API_TOKEN)
set -euo pipefail
cd "$(dirname "$0")"

echo "==> 1/3 Site worker (ehriva-com) — static assets + route ehriva.com/*"
npx --yes wrangler@latest deploy --config wrangler.site.jsonc

echo "==> 2/3 Waitlist worker (ehriva-waitlist) — route ehriva.com/api/*"
npx --yes wrangler@latest deploy --config wrangler.jsonc

echo "==> 3/3 Verifying…"
sleep 6
echo "  site  : $(curl -s -m 15 -o /dev/null -w '%{http_code}' https://ehriva.com/) (expect 200)"
echo "  api   : $(curl -s -m 15 https://ehriva.com/api/waitlist)"
