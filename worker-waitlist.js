// EHRiva waitlist - standalone Cloudflare Worker (fallback if Pages Functions 404).
//
// Deploy (dashboard, ~2 min):
//   1. Workers & Pages -> Create -> Worker -> name: ehriva-waitlist -> Edit code
//   2. Paste this file, Deploy.
//   3. Triggers -> Add route:  ehriva.com/api/*   (method: all) -> Save.
//   4. Optional: Settings -> KV namespace bindings -> WAITLIST (see DEPLOYMENT.md).
//
// Works without KV (responds OK, doesn't persist) until the binding is added.

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "GET") {
      let count = null;
      if (env.WAITLIST) {
        const list = await env.WAITLIST.list({ prefix: "waitlist:" });
        count = list.keys.length;
      }
      return json({ ok: true, service: "ehriva-waitlist", signups: count });
    }

    if (request.method === "POST") {
      try {
        const data = await request.json().catch(() => ({}));
        const email = String(data.email || "").trim().toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          return json({ ok: false, error: "Please enter a valid email address." }, 400);
        }
        const org = String(data.org || "").trim().slice(0, 120);
        const ts = new Date().toISOString();
        if (env.WAITLIST) {
          const key = `waitlist:${ts}:${Math.random().toString(36).slice(2, 8)}`;
          await env.WAITLIST.put(key, JSON.stringify({ email, org, ts }));
        }
        return json({ ok: true, message: "You're on the list - thank you!" });
      } catch (err) {
        return json({ ok: false, error: "Something went wrong. Please try again." }, 500);
      }
    }

    return json({ ok: false, error: "Method not allowed." }, 405);
  },
};

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": "*",
    },
  });
}
