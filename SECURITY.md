# Security Policy

JQ.AI is a self‑hosted, open‑source legal intelligence platform. We take security seriously — not just in the code, but in the way we handle disclosures, dependencies, and supply chain integrity.

---

## Reporting a Vulnerability

If you believe you have found a security vulnerability in JQ.AI, **please do not open a public GitHub issue**.

Instead, disclose it responsibly by emailing us directly at:

**`security@juriquants.com`**

We will respond to your report within **72 hours** and provide an estimated timeline for resolution.

### What we ask from you
- Include a clear description of the vulnerability.
- Provide steps to reproduce it (if applicable).
- Share your GitHub username if you wish to be credited.

### What you can expect from us
- **Acknowledge receipt** within 72 hours.
- **Provide a fix timeline** within 7 days.
- **Credit you publicly** once the issue is resolved (if you wish).
- **Safe harbor** — we will not take legal action against good‑faith researchers.

---

## Safe Harbor Policy

We provide a safe harbor for security researchers who act in good faith.

If you:
- Report a vulnerability through the channels above.
- Do not exploit the vulnerability beyond what is necessary to demonstrate it.
- Do not disclose the vulnerability to the public before we have addressed it.

Then we will not pursue legal action against you, nor will we report you to your employer or law enforcement.

---

## Vulnerability Disclosure Process

1. **Report received** — Acknowledged within 72 hours.
2. **Triaged** — Assessed within 7 days.
3. **Fix developed** — Prioritised based on severity.
4. **Patch released** — Deployed to `main` and tagged in the next release.
5. **Researcher credited** — Public acknowledgment (if desired).

We use the following severity ratings:

| Severity | Description | Response Time |
|----------|-------------|---------------|
| **Critical** | Remote code execution, data leakage, authentication bypass | Within 7 days |
| **High** | Privilege escalation, denial of service | Within 14 days |
| **Medium** | Information disclosure, misconfiguration | Within 30 days |
| **Low** | Minor issues, cosmetic bugs | Within 60 days |

---

## Supply Chain Security

JQ.AI is built with supply chain security as a first‑class concern.

- **SLSA Level 3** — Build provenance and signed container images.
- **Sigstore / cosign** — Every release is signed and verifiable.
- **SBOM** — A Software Bill of Materials is generated with every release.
- **Dependency scanning** — We use `dependabot` and `snyk` to monitor dependencies.
- **No binary blobs** — All code is source‑visible and auditable.

---

## Dependency Management

We maintain a strict dependency policy:

- All Python dependencies are pinned to exact versions.
- All Node.js dependencies are pinned to exact versions.
- We audit dependencies monthly for known vulnerabilities.
- Critical dependencies are forked and audited manually if needed.

---

## Incident Response

If a security incident occurs, we will:

1. **Isolate** — Quarantine the affected component.
2. **Investigate** — Determine the root cause and impact.
3. **Remediate** — Deploy a fix and validate it.
4. **Document** — Write a post‑mortem and publish it (if appropriate).
5. **Notify** — Inform affected users via the JQ.AI Discord and GitHub.

---

## Contact

For security‑related inquiries, reach us at:

**Email:** `security@juriquants.com`  
**PGP Key:** Available upon request.

We believe that transparency breeds trust. We will never hide a security issue. We will never blame a researcher for doing the right thing.
