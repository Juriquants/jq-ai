# Contributing to JQ.AI

Thank you for your interest in contributing to JQ.AI. 

We welcome contributions from lawyers, software engineers, legal-ops professionals, and anyone who believes that legal AI should be open, auditable, and sovereign.

This document outlines how to contribute effectively.

---

## 1. How to Contribute

### 1.1 Reporting Bugs

If you find a bug, please open a GitHub issue with the following template:

- **Summary:** A clear one‑line description of the bug.
- **Steps to reproduce:** Exact steps to trigger the bug.
- **Expected behavior:** What should have happened.
- **Actual behavior:** What actually happened.
- **Environment:** OS, browser, JQ.AI version.

### 1.2 Submitting a Skill

Skills are the heart of JQ.AI. If you are a lawyer or legal engineer, you can contribute a skill in the `agentskills.io` format.

1. Fork the repository.
2. Create a new skill under `skills/community/`.
3. Ensure the skill includes a `SKILL.md` file with YAML frontmatter.
4. Open a pull request.

Skills that contain legal substance must be reviewed by at least one practicing attorney and one engineer before merging.

### 1.3 Submitting Code

If you are an engineer, you can contribute code to the `api/`, `gateway/`, or `web/` modules.

1. Fork the repository.
2. Create a feature branch (`feat/your-feature-name`).
3. Write tests for your changes.
4. Run the test suite (`make test`).
5. Open a pull request with a clear description.

---

## 2. Code Standards

### 2.1 Python

We use Python 3.11+ for all backend services (`api/`, `gateway/`, `ingest/`).

- **Linter:** `ruff` (configuration in `ruff.toml`).
- **Formatter:** `ruff format`.
- **Type checking:** `mypy` (strict mode).
- **Testing:** `pytest` with coverage target 80%.

### 2.2 JavaScript / TypeScript

We use TypeScript for the `web/` UI (forked from OpenWebUI).

- **Linter:** `ESLint`.
- **Formatter:** `Prettier`.
- **Testing:** `Jest` or `Cypress` for E2E.

### 2.3 Commit Messages

We follow the **Conventional Commits** specification:

- `feat:` — A new feature.
- `fix:` — A bug fix.
- `docs:` — Documentation changes.
- `style:` — Code style changes (formatting, etc.).
- `refactor:` — Code refactoring (no functional change).
- `test:` — Adding or updating tests.

---

## 3. Pull Request Process

1. Ensure your PR passes all CI checks (lint, type check, test).
2. Update the `README.md` or `docs/` if your changes affect user-facing behavior.
3. Request a review from at least one maintainer.
4. Once approved, a maintainer will merge your PR.

All PRs must include a **Developer Certificate of Origin (DCO)** sign-off. This is automatically enforced by the GitHub bot.

---

## 4. Development Setup

To set up JQ.AI for local development:

```bash
git clone --recurse-submodules https://github.com/juriquants/jq-ai.git
cd jq-ai
cp .env.example .env
docker compose up -d
```

The stack starts eight services: postgres, redis, minio, gateway, api, ingest-worker, arq-worker, web.

Wait 60 seconds for healthchecks, then access the UI at `http://localhost:3000`.

---

## 5. Testing

We take testing seriously. Before opening a PR, you must:

1. Run the backend test suite:
   ```bash
   make test
   ```
2. Run the linter:
   ```bash
   make lint
   ```
3. Ensure all tests pass and coverage remains above 80%.

---

## 6. Documentation

If you add a new feature, you must update the relevant documentation:
- `docs/PRD.md` — Product Requirements Document.
- `docs/skill-authoring-guide.md` — Skill authoring guide.
- `docs/deployment-cookbook.md` — Deployment recipes.

Documentation is the face of the project. Please write clearly and thoroughly.

---

## 7. Licensing and Attribution

JQ.AI is licensed under Apache 2.0. Your contributions are licensed under the same terms.

You will be credited in the `CONTRIBUTORS.md` file and in the release notes for your contributions.

---

## 8. Conduct

We are committed to providing a welcoming and inclusive environment.

Please read our Code of Conduct before contributing. We will not tolerate harassment, discrimination, or disrespectful behavior.

---

## 9. Questions?

If you have any questions, open a GitHub Discussion or reach out to the community on Discord.

We are here to help you build.
