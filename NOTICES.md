# Third-Party License Notices

JQ.AI is built on the shoulders of several open-source projects. We are deeply grateful to their maintainers and contributors.

This document lists all third-party dependencies and their respective licenses. It is maintained to support enterprise procurement reviews and compliance audits.

---

## Core Dependencies

| Project | License | Used In |
|---------|---------|---------|
| OpenWebUI | MIT License | web/ (chat UI shell) |
| LangGraph | MIT License | api/app/agents/ (agent runtime) |
| FastAPI | MIT License | api/ and gateway/ (backend framework) |
| Docling | MIT License | ingest/ (document parsing) |
| PyMuPDF | GNU AGPL v3 | ingest/ (PDF processing) |
| pgvector | PostgreSQL License | api/app/kb/ (vector search) |
| Presidio | MIT License | gateway/app/anonymization/ (entity recognition) |
| spaCy | MIT License | gateway/app/anonymization/ (NLP pipeline) |
| Anthropic Claude Skills | Apache 2.0 | skills/ (skill format) |
| OpenTelemetry | Apache 2.0 | api/ and gateway/ (observability) |
| Langfuse | MIT License | api/ (LLM observability) |

---

## Full Dependency Tree

For a complete and up-to-date dependency tree, including transient dependencies, run the following command inside each service directory:

```bash
pip list --format=freeze > requirements.txt
```

For Node.js dependencies in the web/ directory:

```bash
npm list --depth=0
```

---

## License Compliance

JQ.AI is licensed under Apache License 2.0. Each dependency listed above carries its own license.

We have reviewed the licenses and confirmed that they are compatible with the Apache 2.0 license of JQ.AI. No dependency imposes restrictions that would prevent the use, modification, or redistribution of JQ.AI.

---

## AGPL Notice (PyMuPDF)

PyMuPDF is licensed under the GNU AGPL v3. This license applies to the ingest/ service, which processes PDFs using PyMuPDF.

The AGPL requirement applies only to the ingest/ service when it is distributed as part of a larger software stack. We comply by making the source code of the ingest/ service available and by providing clear instructions on how to obtain it.

---

## Attribution

We acknowledge and thank the maintainers of all the projects listed above. Open-source software is the foundation of JQ.AI, and we are committed to contributing back to the ecosystem.

If you are the maintainer of a project listed here and we have omitted or misrepresented your license, please open an issue and we will correct it immediately.
