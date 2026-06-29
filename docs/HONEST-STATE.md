# Honest State Catalog

JQ.AI is built on a principle of radical transparency. This document lists what is currently shipped, what is deferred to future milestones, and where you can verify every claim.

If you find a discrepancy between this document and the code, the code is canonical. Please open an issue.

---

## Shipped (M1 – M4)

| Feature | Module | Verification Path |
|---------|--------|-------------------|
| M1 Foundation | api/, gateway/ | See api/app/ and gateway/app/ |
| 10 Starter Skills | skills/built-in/ | Browse skills/built-in/nda-review/ |
| Projects (Matter-Scoped) | api/app/projects/ | api/app/projects/models.py |
| Inference Tier Awareness | gateway/app/tiers/ | gateway/app/tiers/tier_map.py |
| Hybrid Retrieval (pgvector + FTS) | api/app/kb/ | api/app/kb/retrieval.py |
| Citation Engine (4-Stage) | gateway/app/citation/ | gateway/app/citation/verify.py |
| Anonymization Layer | gateway/app/anonymization/ | gateway/app/anonymization/presidio_wrapper.py |
| M3 Playbooks | api/app/playbooks/ | api/app/playbooks/executor.py |
| M3 Tabular Review | api/app/tabular/ | api/app/tabular/review.py |
| M4 Autonomous Layer | api/app/autonomous/ | api/app/autonomous/executor.py |

---

## Deferred (M5+)

| Feature | Target | Verification |
|---------|--------|--------------|
| Contract Repository Relationship Graph | M5 | PRD Section 8.5 |
| Word Add-In Full Surfaces (Tracked Changes) | Community-led | DE-287 |
| Slack/Teams Bridge Live Surface | Community-led | DE-288 |
| Google Vertex AI Adapter | M5 | DE-034 |
| AWS Bedrock Adapter | M5 | DE-035 |
| OCR for Scanned PDFs | M5 | DE-320 |

---

## How to Verify Any Claim

The trust model of JQ.AI is structural: every claim terminates in code you can read.

| Claim | Verification Path |
|-------|-------------------|
| Gateway is the only egress point | gateway/app/router.py |
| Citations are verified at character precision | gateway/app/citation/verify.py |
| Anonymization layer runs before cloud inference | gateway/app/anonymization/middleware.py |
| Audit log is append-only | api/app/audit.py |
| Skills are open source and forkable | skills/ directory |

If a claim is not verifiable in the code, it is not a claim. It is a placeholder. We list placeholders in the Deferred section, not as shipping features.

---

## Honest Roadmap

We do not over-promise. We do not hide gaps. This is our honest roadmap:

| Milestone | Theme | Status |
|-----------|-------|--------|
| M1 | Foundation (Chat, Projects, Skills, Tiers) | Shipped |
| M2 | Citation Engine and Anonymization | Shipped |
| M3 | Playbooks, Tabular Review, Word Add-In | Shipped |
| M4 | Autonomous Layer | Shipped |
| M5 | Contract Graph, OCR, Vertex/Bedrock | In Progress |
| M6+ | Full MCP integration, email/calendar agents | Planned |

---

## Transparency as a Design Principle

We publish this catalog because we believe that open-source legal AI must be held to the same standard as open-source infrastructure.

You are not relying on our marketing claims. You are relying on code you can read, fork, audit, and improve.

If you find something missing from this catalog, open a pull request. We welcome corrections, contributions, and honest critique.
