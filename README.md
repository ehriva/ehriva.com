# Ehriva

**From EHR data to agentic action.**

Ehriva is an AI platform that deploys agents across hospital workflows — clinical
procedure agents, EHR analytics agents, and hospital operations agents — built
evaluation-first, multilingual, and privacy-first (GDPR / KVKK).

- 🌐 **Website:** https://ehriva.com
- ✉️ **Contact:** hello@ehriva.com
- 🏥 **Status:** founding team — piloting with hospitals

## What we build

| Agent family | Product | What it does |
|---|---|---|
| **Clinical procedure agents** | CliniFlow | Documentation, smart order sets, protocol-adherence checks, decision support — embedded in the clinician's existing workflow |
| **EHR analytics agents** | Analytics | Cohort discovery, ICD-10 coding, readmission / deterioration / length-of-stay prediction that nudges the right care team at the right time |
| **Hospital operations agents** | Operations | "What-if" capacity, patient-flow and staffing simulation with monitored, re-simulated recommendations |

One data layer feeds all three families; every agent keeps a human in the loop.

## Why Ehriva

- **Evaluation-first** — every agent is gated on clinician-curated tasks before deployment
- **Multilingual** — clinical NLP core designed for multiple languages and terminologies
- **Privacy by design** — GDPR-aligned, KVKK-compliant, on-prem/private-cloud deployment
  option

## Founders

- **Ahmet Kaplan** — Co-founder, CEO & CTO. Big data analytics, data integrations, AI
  methods and applications; author of a published clinical text-to-SQL benchmark
  (MedipolSQL) with clinician-curated evaluation tasks. [LinkedIn](https://www.linkedin.com/in/ahmetkaplan/)
- **Suleyman Yıldırım** — Co-founder, Chief Medical Officer. Clinical methods,
  clinician relations, microbiotics; the bridge between AI capability and clinical
  trust. [LinkedIn](https://www.linkedin.com/in/slymnyldrm/)

## This repository

Source for the [ehriva.com](https://ehriva.com) landing page, hosted on **Cloudflare
Pages** (repo `ehriva/ehriva.com`).

- `index.html` — static single-file page, no build step
- `_redirects` — Pages redirect rules (www → apex)
- `functions/api/waitlist.js` — waitlist endpoint (Pages Function, KV-backed)

**Local preview:** `python3 -m http.server 8000`

**Deploy:** push to `main` → Cloudflare Pages auto-builds and deploys (framework preset:
*None*, output directory `/`). Full setup: see [DEPLOYMENT.md](DEPLOYMENT.md).

## Status

🚧 Founding stage — incorporating (Delaware C-Corp + local operating entities),
applying to the Google for Startups Accelerator (MENA & Turkey). Hospitals and
partners: join the pilot waitlist at [ehriva.com](https://ehriva.com).
