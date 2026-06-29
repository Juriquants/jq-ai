# JQ.AI

**Self-hosted, open-source legal intelligence for the African continent.**

Bring your own keys. Run it where you want. Own your data.

**License:** Apache 2.0  
**Project Status:** Active development — M1 Foundation in progress  
**Community:** [JuriQuants](https://juriquants.vercel.app)

---

## What is JQ.AI?

JQ.AI is a self‑hosted AI platform purpose‑built for African legal teams. It delivers conversational chat with persistent history, matter‑scoped projects, character‑verifiable citations against source documents, and reusable workflow skills authored in the open `agentskills.io` format.

It runs on a laptop, an internal server, or a cloud VM, against your choice of model — Anthropic, OpenAI, Azure OpenAI, or local Ollama — with zero license fees.

**The reason JQ.AI exists is simple:** legal teams should not have to choose between AI assistance and data sovereignty. Every other capable tool in this category is a closed‑source SaaS that requires sending privileged information to a third‑party vendor. JQ.AI runs in your environment, with your keys, against your choice of model — including fully air‑gapped deployments using local inference.

---

## Why this project exists

Commercial in‑house legal AI products treat their prompt engineering as a proprietary moat. The skills, playbooks, citation logic, and verification heuristics that shape what the user sees are hidden inside closed‑source applications, presented as "AI" but functionally indistinguishable from a hidden system prompt. Customers pay significant per‑seat fees for software whose only real innovation is a hidden prompt — without any way to see, debug, or improve it.

JQ.AI inverts this. Every artifact that shapes the user's experience is visible work product. The skills are open source. The playbooks are open source. The citation engine's verification logic is open source.

When a user clicks "view this skill" on any active skill, they see the actual skill definition and supporting files, formatted for human reading, with provenance and the ability to fork.

The position implied by all of this is uncomfortable for the rest of the legal‑AI category, and that is intentional. Customers who have been paying for software whose only real innovation is a hidden system prompt are entitled to see what they have actually been buying. When the curtain is pulled back, some products will hold up. Many will not. JQ.AI's bet is that an open, transparent product built on community‑curated skills is better than a closed, opaque product built on the assumption that the user cannot see what is happening — and that the resulting trust is worth more than the marketing.

---

## What it does

JQ.AI ships with a curated set of capabilities calibrated to African legal work.

### Conversational core with persistent history
Multi‑turn chat organized in a sidebar, with skills and files attached per chat. Search across all chat history. Streaming responses with markdown rendering. Export to Markdown, plain text, or DOCX.

### Projects (matter‑scoped containers)
A user‑curated container that scopes a set of chats, files, skills, and context around a single matter — a deal, a counterparty, a regulatory question, a policy refresh. Chats inside a Project automatically inherit the Project's attached files, skills, and context.

### Skill Library
Reusable structured prompt artifacts in the `agentskills.io` format — a folder containing a skill definition with YAML frontmatter and optional supporting files. Three tiers: built‑in skills (ship with the product), user skills (you create), and shared skills (your team or org shares). Every active skill is one click away from being readable, debuggable, and forkable.

### Citation Engine
Verifies every model‑emitted citation against the source document at character precision before rendering. Four‑stage cascade:
- **Exact match** — byte‑for‑byte equality at the source offsets.
- **Tolerant match** — normalized fuzzy match (smart‑quote folding, whitespace collapse) at a 95% similarity threshold.
- **Paraphrase judge** — an LLM judge call that returns yes / partial / no with high / medium / low confidence.
- **Ensemble verification** — opt‑in parallel dispatch across N judge models with strict (all‑agree) or majority (simple‑majority) aggregation.

The chat UI renders citations as four visual states: green (exact / tolerant match), yellow (paraphrase or ensemble judgment), red (unverified). Failed citations surface as "unverified" rather than as confident‑looking wrong text.

### Inference Tier Awareness
A persistent badge in the chat UI shows which Inference Tier (1–5) your current chat is running on — from local‑only inference (Tier 1) through enterprise managed inference with ZDR (Tier 3) to consumer/free endpoints (Tier 5). Click the badge for what the tier implies: where the data is going, what the provider's retention policy is, whether anonymization is on.

### Audit log
Append‑only audit log records every state‑changing action with first‑class columns for privilege marking, routed inference tier, and routed provider. Admin‑gated endpoint supports filtering by user, resource, action, privilege, tier, and timestamp range.

### Anonymization Layer
Pre‑processing step in the Inference Gateway that pseudonymizes sensitive entities (names, organizations, addresses, phone numbers, case numbers) before requests leave for the model provider; rehydrates pseudonyms back to originals on the response path. Built on Presidio + spaCy + custom legal recognizers.

---

## Quick Start

```bash
git clone --recurse-submodules https://github.com/juriquants/jq-ai.git
cd jq-ai
cp .env.example .env
docker compose up -d
```

The stack starts with eight services: postgres, redis, minio, gateway, api, ingest-worker, arq-worker, web. Wait ~60 seconds for healthchecks, then log in at http://localhost:3000.

---

## Documentation

· Product Requirements Document (docs/PRD.md) — The canonical specification (v0.2).
· Honest State Catalog (docs/HONEST-STATE.md) — Shipped vs deferred features with verification paths for every claim.
· Skill Authoring Guide (docs/skill-authoring-guide.md) — How to write a high‑quality skill.
· Deployment Cookbook (docs/deployment-cookbook.md) — Recipes for production deployments.
· Contributing Guide (CONTRIBUTING.md) — How to contribute to the project.

---

## Project status

M1 through M4 shipped. The PRD is at v0.2; ten starter skills are authored and shipping; the Citation Engine's four‑stage verification cascade is operational; the Anonymization Layer is wired end‑to‑end with custom legal recognizers and streaming‑aware rehydration. M3 shipped Playbooks and Tabular Review end‑to‑end. M4 shipped the opt‑in Autonomous Layer end‑to‑end.

The remaining roadmap items are listed with verification paths in HONEST-STATE.md.

---

## Contributing

Substantive contributions are welcome and credited. Skills, playbooks, jurisdictional adaptations, and verification heuristics contributed by practicing lawyers carry the same weight in the project as code contributed by engineers.

For the full picture of what's open, start with docs/ROADMAP.md — the live, ordered punch list across active milestone work, PRD‑committed deferrals, and forward‑looking M5+.

---

## License

Apache License 2.0 for the JQ.AI codebase. The patent‑grant clause is important given JuriQuants' broader ecosystem; the explicit trademark protection is enterprise‑friendly; the license is compatible with most other OSS licenses for ecosystem integration.

The OpenWebUI fork (the web component) inherits OpenWebUI's license.
