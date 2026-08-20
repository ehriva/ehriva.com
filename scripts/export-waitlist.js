#!/usr/bin/env node
// Export the WAITLIST KV namespace to CSV + JSON.
//
// Usage:
//   node export-waitlist.js
//   # or with an explicit token:
//   CLOUDFLARE_API_TOKEN=<token> node export-waitlist.js
//
// Token source: CLOUDFLARE_API_TOKEN env var, or the wrangler OAuth token
// (falls back to the `wrangler login` session on this machine).
//
// Output: exports/waitlist-export-YYYY-MM-DD.{csv,json}

const fs = require("fs");
const os = require("os");
const path = require("path");

const ACCOUNT_ID = "c241f697fdb2be72f9effb4699613569"; // Ahmet.kaplan.phd@gmail.com's Account
const NAMESPACE_ID = "8bbcb84baa0f4f54871378a052727d17"; // WAITLIST

async function getToken() {
  if (process.env.CLOUDFLARE_API_TOKEN) return process.env.CLOUDFLARE_API_TOKEN;
  const p = path.join(os.homedir(), ".wrangler", "config", "default.toml");
  const toml = fs.readFileSync(p, "utf8");
  const m = toml.match(/oauth_token\s*=\s*"([^"]+)"/);
  if (!m) throw new Error("No Cloudflare token found. Set CLOUDFLARE_API_TOKEN or run `wrangler login`.");
  return m[1];
}

async function apiJson(token, url) {
  const res = await fetch("https://api.cloudflare.com/client/v4" + url, {
    headers: { Authorization: "Bearer " + token },
  });
  const data = await res.json();
  if (!data.success) throw new Error("API error: " + JSON.stringify(data.errors));
  return data;
}

async function main() {
  const token = await getToken();

  // 1. paginate all keys with the waitlist: prefix
  const keys = [];
  let cursor = null;
  do {
    const q = cursor ? `?cursor=${encodeURIComponent(cursor)}&limit=1000` : "?limit=1000";
    const res = await apiJson(token, `/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${NAMESPACE_ID}/keys${q}`);
    for (const k of res.result || []) keys.push(k.name);
    cursor = (res.result_info && res.result_info.cursor) || null;
  } while (cursor);

  // 2. fetch each value (values endpoint returns the raw value as text)
  const rows = [];
  for (const name of keys) {
    const enc = encodeURIComponent(name);
    const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${NAMESPACE_ID}/values/${enc}`, {
      headers: { Authorization: "Bearer " + token },
    });
    const text = await res.text();
    let obj = {};
    try { obj = JSON.parse(text); } catch { obj = { raw: text }; }
    rows.push({ key: name, email: obj.email || "", org: obj.org || "", ts: obj.ts || "" });
  }
  rows.sort((a, b) => (a.ts || "").localeCompare(b.ts || ""));

  // 3. write CSV + JSON (never commit these - they contain emails)
  const outDir = path.join(__dirname, "..", "exports");
  fs.mkdirSync(outDir, { recursive: true });
  const stamp = new Date().toISOString().slice(0, 10);
  const csvPath = path.join(outDir, `waitlist-export-${stamp}.csv`);
  const jsonPath = path.join(outDir, `waitlist-export-${stamp}.json`);
  const csv = ["email,org,timestamp,key"].concat(
    rows.map((r) => [r.email, r.org, r.ts, r.key].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
  ).join("\n") + "\n";
  fs.writeFileSync(csvPath, csv);
  fs.writeFileSync(jsonPath, JSON.stringify(rows, null, 2) + "\n");

  console.log(`Exported ${rows.length} signup(s):`);
  console.log("  CSV :", csvPath);
  console.log("  JSON:", jsonPath);
  console.log("---");
  console.log(csv);
}

main().catch((e) => { console.error(e.message || e); process.exit(1); });
