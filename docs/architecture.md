# JQ.AI Architecture

JQ.AI is a self‑hosted, open‑source legal intelligence platform designed for the African continent. This document describes the system architecture, module boundaries, and data flow.

---

## System Overview

JQ.AI is composed of six core services, all running inside a Docker Compose stack:

| Service | Role |
|---------|------|
| **Proxy** | Reverse proxy and rate limiting (Caddy) |
| **Web** | Chat UI and skill browser (Next.js / OpenWebUI fork) |
| **API** | Core backend: auth, projects, skills, audit logs (FastAPI) |
| **Gateway** | Single audited egress for LLM inference (FastAPI) |
| **Ingest** | Document ingestion and parsing pipeline (Python) |
| **Arq Worker** | Background task processor (Redis queue) |

Supporting infrastructure:

| Component | Role |
|-----------|------|
| **PostgreSQL** | Primary database with pgvector for vector search |
| **Redis** | Session storage and task queues |
| **MinIO** | S3‑compatible file storage for documents and skills |

---

## Data Flow

1. **User submits a prompt** via the Web UI.
2. **The Web UI** sends the request to the **API**.
3. **The API** authenticates the user, applies project context, and forwards the request to the **Gateway**.
4. **The Gateway** applies anonymization (if enabled), enforces the tier floor, and routes the request to the chosen LLM provider.
5. **The LLM provider** returns a response.
6. **The Gateway** rehydrates anonymized data, logs the transaction, and returns the response to the API.
7. **The API** stores the chat history and returns the response to the Web UI.

---

## Module Boundaries

### Web (`web/`)
- **Responsibility:** User interface, chat sessions, skill browsing, project scoping.
- **Tech:** Next.js 14, TypeScript, Tailwind CSS, React.
- **Key Files:**
  - `app/page.tsx` — Main chat interface
  - `app/skills/` — Skill browser and viewer
  - `app/projects/` — Project management

### API (`api/`)
- **Responsibility:** Authentication, projects, skills, audit logs, file management.
- **Tech:** FastAPI, SQLAlchemy, AsyncPG, Pydantic.
- **Key Files:**
  - `app/main.py` — Application entry point
  - `app/projects/` — Project CRUD
  - `app/skills/` — Skill management
  - `app/audit.py` — Audit log writer

### Gateway (`gateway/`)
- **Responsibility:** Single audited egress for LLM requests. Tier enforcement, anonymization, logging.
- **Tech:** FastAPI, Pydantic, Presidio, spaCy.
- **Key Files:**
  - `app/main.py` — Application entry point
  - `app/tiers/` — Inference tier logic
  - `app/anonymization/` — Anonymization layer
  - `app/citation/` — Citation verification engine

### Ingest (`ingest/`)
- **Responsibility:** Parsing PDFs, extracting text and character offsets, storing documents in MinIO and pgvector.
- **Tech:** Python, Docling, PyMuPDF, pgvector.
- **Key Files:**
  - `app/worker.py` — Background worker
  - `app/parser/` — Document parsing logic

### Proxy (`proxy/`)
- **Responsibility:** SSL termination, rate limiting, request routing.
- **Tech:** Caddy (Go).
- **Key Files:**
  - `Caddyfile` — Routing configuration

---

## Tech Stack Summary

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Backend | FastAPI, Python 3.11 |
| Agent Runtime | LangGraph |
| Database | PostgreSQL 16, pgvector |
| Cache / Queue | Redis 7 |
| File Storage | MinIO (S3‑compatible) |
| Document Parsing | Docling, PyMuPDF |
| Inference Gateway | Custom FastAPI (Python) |
| LLM Providers | Anthropic, OpenAI, Azure OpenAI, Ollama |
| Observability | OpenTelemetry, Langfuse |
| Deployment | Docker Compose, Terraform (AWS) |
| CI/CD | GitHub Actions |

---

## Security Boundaries

- The **Gateway** is the only component that makes outbound calls to LLM providers.
- The **API** never has access to the provider keys — they are stored only in the Gateway.
- The **Anonymization Layer** runs inside the Gateway before any data leaves the deployment.
- The **Audit Log** is append‑only and cannot be modified after writing.

---

## Development Workflow

```bash
# Clone and set up
git clone --recurse-submodules https://github.com/juriquants/jq-ai.git
cd jq-ai
cp .env.example .env

# Start the stack
make up

# Run tests
make test

# Stop and clean
make clean
```

---

## Production Deployment (AWS)

JQ.AI can be deployed to AWS using the provided Terraform configuration.

```bash
cd deploy/terraform
terraform init
terraform apply
```

This provisions a VPC, public subnet, security group, and an EC2 instance with Docker and JQ.AI pre‑installed.

---

## Contributing

See [CONTRIBUTING.md](/CONTRIBUTING.md) for detailed contribution guidelines.

---

## License

[Apache 2.0](/LICENSE)
