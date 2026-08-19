# Ehriva landing page

Static site hosted on **Cloudflare Pages** at **https://ehriva.com**.

- `index.html` — single-file landing page (no build step, no dependencies)
- `_redirects` — Cloudflare Pages redirect rules (www → apex; ehriva.ai later)

## Deploy pipeline

1. Push to `main` → Cloudflare Pages auto-builds and deploys (framework preset: **None**,
   build command: *empty*, output directory: `/`).
2. Preview deployments are generated automatically for PRs.

## One-time setup (already done for you)

- GitHub repo: `github.com/ehriva/ehriva.com` (pushed via `gh`).
- Cloudflare Pages: connect this repo → Create → **Connect to Git** → select
  `ehriva/ehriva.com` → Framework preset **None** → Build command *(leave empty)* →
  Output directory `/` → Deploy.

## Custom domain + DNS (you)

1. **Add the zone:** Cloudflare dashboard → **Add a site** → `ehriva.com` (Free plan).
   Cloudflare will show two nameservers — update them at your registrar (where you
   bought ehriva.com). DNS propagation is usually 10–60 min.
2. **Attach to Pages:** Workers & Pages → your project → **Custom domains** → Add
   `ehriva.com` **and** `www.ehriva.com`. Cloudflare creates the DNS records
   automatically. The `www → apex` redirect in `_redirects` then kicks in.
3. **Email:** Cloudflare dashboard → Email → **Email Routing** → enable, create
   `hello@ehriva.com` → forward to your personal inbox (free, no Google Workspace
   needed — add Workspace later if you want calendar/shared drives).
4. **Waitlist form:** the form posts to Formspree — create a free form at
   formspree.io and replace `YOUR_FORM_ID` in `index.html`, or swap in your own
   endpoint (e.g., a Cloudflare Worker).

## Local preview

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

## Brand

Ehriva — **from EHR data to agentic action.** · `ehriva.com` / `ehriva.ai`
