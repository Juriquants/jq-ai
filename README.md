# JQ.AI

Self-hosted, open-source legal intelligence for the African continent.

Bring your own keys. Run it where you want. Own your data.

**License:** Apache 2.0  
**Project Status:** Active development (M1 Foundation in progress)  
**Community:** [JuriQuants](https://juriquants.vercel.app)

---

## What is JQ.AI?

JQ.AI is a self-hosted AI platform purpose-built for African legal teams. It delivers conversational chat with persistent history, matter-scoped projects, character-verifiable citations against source documents, and reusable workflow skills authored in the open agentskills.io format.

It runs on a laptop, an internal server, or a cloud VM, against your choice of model (Anthropic, OpenAI, Azure OpenAI, or local Ollama), with zero license fees.

---

## Why this project exists

Commercial in-house legal AI products treat their prompt engineering as a proprietary moat. The skills, playbooks, citation logic, and verification heuristics that shape what the user sees are hidden inside closed-source applications.

JQ.AI inverts this. Every artifact that shapes the user's experience is visible work product. The skills are open source. The playbooks are open source. The citation engine's verification logic is open source.

---

## Quick Start

```bash
git clone --recurse-submodules https://github.com/juriquants/jq-ai.git
cd jq-ai
cp .env.example .env
docker compose up -d
