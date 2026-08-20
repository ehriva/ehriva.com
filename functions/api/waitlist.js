// Cloudflare Pages Function (Workers runtime), Ehriva waitlist endpoint.
// Endpoint: POST /api/waitlist  { email, org? }
//           GET  /api/waitlist  -> health + signup count (requires KV binding)
//
// Storage: a KV namespace bound as `WAITLIST` on the Pages project
// (Settings -> Functions -> KV namespace bindings). Without the binding the
// endpoint still responds OK but does not persist, set it up to collect leads.

export async function onRequestPost(context) {
  const { request, env } = context;
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
    return json({ ok: true, message: "You're on the list, thank you!" });
  } catch (err) {
    return json({ ok: false, error: "Something went wrong. Please try again." }, 500);
  }
}

export async function onRequestGet(context) {
  const { env } = context;
  let count = null;
  if (env.WAITLIST) {
    const list = await env.WAITLIST.list({ prefix: "waitlist:" });
    count = list.keys.length;
  }
  return json({ ok: true, service: "ehriva-waitlist", signups: count });
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": "*",
    },
  });
}
