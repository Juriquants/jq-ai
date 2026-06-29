# JQ.AI Web UI

This is the web interface for JQ.AI — a customized fork of OpenWebUI, tailored specifically for legal engineering workflows.

---

## Overview

The JQ.AI Web UI provides:

- **Conversational chat interface** with persistent history and project scoping.
- **Skill browser** with built-in and community skills.
- **Citation visualization** (green / yellow / red verification states).
- **Project management** for matter-scoped containers.
- **Inference tier awareness** (Tier 1–5 badge in the UI).

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Components | Shadcn/ui |
| State | React Context + SWR |
| Icons | Lucide React |

---

## Development

To run the web UI in development mode:

```bash
cd web
npm install
npm run dev
```

The UI will be available at `http://localhost:3000`.

---

## Customizations

JQ.AI Web UI includes the following customizations over the upstream OpenWebUI:

- Dark mode by default — Ebony/gold/cream theme matching the JQ.AI brand.
- Citation rendering — Green/yellow/red badges for verified citations.
- Jurisdiction selector — Dropdown for OHADA, ECOWAS, EAC, CEMAC, SADC.
- Skill fork button — One-click forking of any built-in or community skill.

---

## Environment Variables

**Variable Description**

- `NEXT_PUBLIC_API_URL` Backend API endpoint
- `NEXT_PUBLIC_GATEWAY_URL` Inference Gateway endpoint

---

## Building for Production

To build the production bundle:

```bash
cd web
npm run build
```

The output will be in the `out/` directory.

---

## License

This project is a fork of OpenWebUI, which is licensed under the [MIT License](MIT_License). The JQ.AI customizations are licensed under the [Apache 2.0 License](/LICENSE).
