# Deployment — Cloudflare Pages

Deploy notes for the `ehriva/ehriva.com` landing page. Internal ops doc (not shown on
the repo front page — README.md is the public one).

## Pipeline

1. Push to `main` → Cloudflare Pages auto-builds and deploys.
   - Framework preset: **None** · Build command: *(empty)* · Output directory: `/`
2. Preview deployments are generated automatically for PRs.

## One-time Cloudflare setup

1. **Add the zone:** Cloudflare dashboard → **Add a site** → `ehriva.com` (Free plan).
   Cloudflare shows two nameservers — update them at the registrar where ehriva.com was
   bought. Propagation is usually 10–60 min.
2. **Connect Pages:** **Workers & Pages → Create → Pages → Connect to Git** → authorize
   GitHub → select `ehriva/ehriva.com` → settings as above → **Deploy**.
3. **Custom domains:** in the Pages project → **Custom domains** → add `ehriva.com`
   **and** `www.ehriva.com` (Cloudflare creates the DNS records; the www→apex redirect
   in `_redirects` then kicks in).
4. **Email (free):** **Email → Email Routing** → enable → create `hello@ehriva.com` →
   forward to a personal inbox. (Google Workspace optional later for calendar/drives.)
5. **Waitlist form:** the form in `index.html` posts to Formspree — create a free form
   at formspree.io and replace `YOUR_FORM_ID`, or swap in a Cloudflare Worker endpoint.

## Waitlist endpoint (Pages Function — Workers runtime)

The form on the site posts to `/api/waitlist` (see `functions/api/waitlist.js`). It
uses a **KV namespace bound as `WAITLIST`** on the Pages project:

1. Cloudflare dashboard → **Workers & Pages → KV** → **Create a namespace** →
   name it `WAITLIST`.
2. Pages project → **Settings → Functions → KV namespace bindings** → **Add
   binding** → Variable name: `WAITLIST` → select the namespace → **Save**.
3. Redeploy (push to `main` or use the dashboard's **Retry deployment**).

Without the binding the endpoint still responds (gracefully) but doesn't persist —
signups are only stored once the binding is set. Check counts: `GET /api/waitlist`.

## Future

- When `ehriva.ai` is registered, add it as a second custom domain on this project and
  uncomment the `ehriva.ai/*` redirect in `_redirects`.
