---
name: "NDA Review"
description: "A comprehensive, risk-calibrated review of any Non-Disclosure Agreement. Built for legal professionals who need clarity, not clutter."
version: 1.3.0
jurisdiction: "OHADA"
min_inference_tier: 3
author: "JQ.AI Core Team"
tags: ["contract review", "NDA", "OHADA", "commercial law"]
---

# NDA Review

The NDA Review skill surfaces what matters most: unusual provisions, missing clauses, and actionable risk insights. It adapts to your perspective — whether you are disclosing, receiving, or operating under a mutual agreement — and delivers a clear, executive-ready assessment.

---

## How the analysis works

The skill ingests the full text of an NDA and analyzes it against a curated set of legal dimensions.

1. **Intake.** You provide the NDA text and select your perspective (Discloser, Recipient, or Mutual).
2. **Review.** The skill scans the document for unusual clauses, missing provisions, and risk exposure.
3. **Output.** The skill returns a structured report with a summary, flagged risks, and ranked recommendations.

---

## What the skill looks for

**Unusual provisions.** Clauses that deviate from standard market practice in the jurisdiction. Non-compete obligations, overly broad indemnification, unilateral termination rights, and assignment restrictions without consent are flagged automatically.

**Missing provisions.** Clauses that are typically expected but absent from the document. Governing law, dispute resolution, return of confidential materials, and residual clauses are all reviewed.

**Risk exposure.** The skill assesses the sensitivity of the information, the duration of the confidentiality obligation, the scope of the definition of confidential information, and the remedies available in case of breach.

---

## Output structure

The skill returns a report with four distinct sections:

**Executive Summary**
A brief overview of the NDA, its governing law, and the overall risk level.

**Unusual Provisions**
A list of provisions that deviate from standard practice, each with a severity rating (Low, Medium, High).

**Missing Provisions**
A list of clauses that are expected but absent from the document, each with a severity rating.

**Recommendations**
Actionable next steps for the legal team, ranked by priority.

---

## Example output

The skill produces output in the following format:

```text
JQ.AI — NDA Review Report

Executive Summary
This is a mutual NDA governed by OHADA law. It includes a non-compete clause that is unusual for this type of agreement. The overall risk level is Medium.

Unusual Provisions
- Non-Compete Clause (Section 4.2). Restricts the recipient from working with competitors for 24 months. This is unusually long for a standard NDA. Severity: High.

Missing Provisions
- Governing Law Clause. The NDA does not explicitly state the governing law or jurisdiction. Severity: Medium.

Recommendations
1. Add a governing law clause specifying OHADA jurisdiction.
2. Add a dispute resolution clause specifying mediation before arbitration.
3. Remove the non-compete clause or shorten the term to 6 months.
