# Sago Nexus — AI-Native Venture Intelligence Platform

> **Palantir for venture capital.** An institutional intelligence layer, relationship operating system, and graph-powered memory engine for modern VC firms.

---

## What is Sago Nexus?

Sago Nexus is a production-grade, AI-native platform that transforms how venture capital firms manage relationships, diligence, and institutional knowledge.

**The problem it solves:** VC firms lose enormous value because institutional memory disappears, partner insights stay trapped in emails, founder relationships are fragmented, and signals are disconnected.

**What it does:**
- Continuously learns from every meeting, email, and document
- Maps and traverses your entire venture relationship graph
- Generates contextual AI meeting briefs in seconds
- Proactively surfaces opportunities, dormant relationships, and market signals
- Makes institutional memory searchable and interconnected

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Sago Nexus Platform                      │
├──────────────┬──────────────┬──────────────┬────────────────────┤
│  Next.js 15  │  FastAPI     │  AI Agents   │  Graph Engine      │
│  Frontend    │  Backend API │  (6 agents)  │  (Neo4j)           │
│              │              │              │                    │
│  Dashboard   │  REST API    │  Entity Ext. │  Relationship Map  │
│  Graph View  │  Streaming   │  Meeting AI  │  Path Finding      │
│  Deal Flow   │  WebSockets  │  Signal Mon. │  Strength Scoring  │
│  Memory UI   │  OpenAPI     │  Memory Ret. │                    │
├──────────────┴──────────────┴──────────────┴────────────────────┤
│  PostgreSQL  │  Redis  │  Weaviate (Vector)  │  Celery Workers  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 15, TypeScript, TailwindCSS, shadcn/ui, React Flow, Recharts |
| **State** | TanStack Query, Zustand, Framer Motion |
| **Backend** | FastAPI, Python 3.12, Pydantic v2, SQLAlchemy 2.0 |
| **AI Layer** | Anthropic Claude, OpenAI, LangGraph, Instructor |
| **Graph DB** | Neo4j (relationship intelligence) |
| **Vector DB** | Weaviate (semantic memory) |
| **Cache** | Redis |
| **SQL DB** | PostgreSQL (via asyncpg) |
| **Workers** | Celery + Redis |
| **Auth** | Clerk (multi-tenant, RBAC) |
| **Observability** | OpenTelemetry, Sentry, Langfuse |
| **Infrastructure** | Docker Compose, Kubernetes-ready |

---

## Project Structure

```
sago-nexus/
├── apps/
│   ├── web/                    # Next.js 15 frontend
│   │   └── src/
│   │       ├── app/            # App Router pages
│   │       │   └── (app)/      # Protected app routes
│   │       ├── components/     # UI components
│   │       │   ├── intelligence/   # Core intelligence UI
│   │       │   ├── graph/          # Graph visualization
│   │       │   ├── layout/         # App shell, sidebar, topbar
│   │       │   ├── shared/         # Shared components
│   │       │   └── ui/             # Base UI components
│   │       ├── lib/            # Utilities, API client
│   │       └── store/          # Zustand state stores
│   │
│   └── api/                    # FastAPI backend
│       └── src/
│           ├── agents/         # AI agents
│           │   ├── entity_extraction.py
│           │   ├── meeting_intelligence.py
│           │   ├── signal_monitoring.py
│           │   ├── relationship_inference.py
│           │   └── memory_retrieval.py
│           ├── api/v1/routes/  # REST API routes
│           ├── core/           # Config, logging
│           ├── db/             # Database layer
│           ├── graph/          # Neo4j engine
│           ├── models/         # SQLAlchemy models
│           ├── schemas/        # Pydantic schemas
│           ├── services/       # Business logic
│           └── workers/        # Celery tasks
│
├── packages/
│   ├── shared-types/           # TypeScript types (shared)
│   ├── ui/                     # Shared UI components
│   ├── ai-agents/              # Agent SDK wrappers
│   ├── graph-engine/           # Graph utilities
│   ├── memory-engine/          # Vector memory utilities
│   └── integrations/           # External integrations
│
├── infrastructure/
│   ├── docker/
│   │   └── docker-compose.yml  # Full local stack
│   ├── k8s/                    # Kubernetes manifests
│   └── scripts/                # Setup scripts
│
├── Makefile                    # Developer commands
├── turbo.json                  # Turborepo config
└── package.json                # Monorepo root
```

---

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+
- Python 3.12+
- Docker & Docker Compose

### 1. Clone and Install

```bash
git clone https://github.com/Archit1706/sago-nexus
cd sago-nexus

# Install dependencies
make install
# or manually:
pnpm install
cd apps/api && pip install -e ".[dev]"
```

### 2. Configure Environment

```bash
# Copy example env files
make env-setup

# Edit the .env files with your API keys:
# apps/web/.env.local
# apps/api/.env
```

### Required API Keys

| Service | Key | Where to Get |
|---------|-----|-------------|
| **Anthropic** | `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com/settings/keys) |
| **OpenAI** | `OPENAI_API_KEY` | [platform.openai.com](https://platform.openai.com/api-keys) |
| **Clerk (Auth)** | `CLERK_PUBLISHABLE_KEY` + `CLERK_SECRET_KEY` | [dashboard.clerk.com](https://dashboard.clerk.com) |
| **Sentry (optional)** | `SENTRY_DSN` | [sentry.io](https://sentry.io) |
| **Langfuse (optional)** | `LANGFUSE_*` | [langfuse.com](https://langfuse.com) |

### 3. Start Infrastructure

```bash
# Start PostgreSQL, Redis, Neo4j, Weaviate
make docker-up

# Wait ~30 seconds for services to be ready
```

### 4. Database Setup

```bash
# Run migrations
make migrate

# Seed demo data
make seed
```

### 5. Start Development

```bash
# Start everything (frontend + backend)
make dev

# Or individually:
make dev-web   # http://localhost:3000
make dev-api   # http://localhost:8000
```

---

## Core Features

### 1. Intelligence Dashboard
Real-time overview of pipeline, signals, relationships, and AI-surfaced opportunities.

### 2. Relationship Graph Explorer
Interactive graph visualization powered by React Flow and Neo4j. Traverse founder→company→investor→LP relationships. Find warm intro paths in seconds.

### 3. AI Meeting Intelligence
Enter founder name + company → get a comprehensive AI brief:
- Founder background analysis
- Prior interaction history
- Mutual connections and warm intro paths
- Portfolio overlap analysis
- 5 sharp diligence questions
- Risk signals and mitigation strategies
- Recent market signals

### 4. Signal Feed
Real-time monitoring of funding events, hiring spikes, executive changes, partnerships, and market movements — all scored by relevance to your thesis.

### 5. Institutional Memory Search
Semantic search across all meetings, memos, emails, and notes. Ask natural language questions like *"What did Sarah Chen say about inference costs?"*

### 6. Deal Pipeline
Kanban + table view of active deals with AI-scored thesis fit, last contact tracking, and assignee management.

### 7. Founder Profiles
Enriched founder database with relationship strength, graph connections, thesis fit scores, and interaction history.

---

## AI Agents

| Agent | Purpose |
|-------|---------|
| **Entity Extraction** | Extracts founders, companies, investors, technologies from any text |
| **Meeting Intelligence** | Generates comprehensive pre-meeting AI briefs |
| **Signal Monitoring** | Classifies and scores venture-relevant signals |
| **Relationship Inference** | Infers hidden relationships and warm intro paths |
| **Memory Retrieval** | Semantic search across institutional memory |

All agents use:
- **Structured outputs** via Instructor + Anthropic Claude
- **Confidence scoring** on all extractions
- **Async-first** patterns throughout

---

## API Documentation

Once running, visit:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

### Key Endpoints

```
POST /api/v1/intelligence/meeting-brief      # Generate meeting prep
POST /api/v1/intelligence/extract-entities   # Extract entities from text
POST /api/v1/intelligence/memory/search      # Semantic memory search
GET  /api/v1/graph/                          # Full venture graph
GET  /api/v1/graph/entity/{id}              # Entity subgraph
GET  /api/v1/graph/path/{a}/{b}             # Shortest relationship path
GET  /api/v1/signals/                        # Signal feed
GET  /api/v1/founders/                       # Founder list
```

---

## Development Commands

```bash
make help           # Show all commands
make dev            # Start dev environment
make docker-up      # Start databases
make docker-down    # Stop databases
make seed           # Seed demo data
make test           # Run all tests
make lint           # Lint all code
make format         # Format all code
make type-check     # TypeScript + mypy
make migrate        # Run DB migrations
make clean          # Clean build artifacts
```

---

## Deployment

### Frontend → Vercel
```bash
cd apps/web
vercel deploy
```

### Backend → Railway / Render / Fly.io
```bash
# Set environment variables on your platform
# Deploy the apps/api directory
# Set start command: uvicorn src.main:app --host 0.0.0.0 --port $PORT
```

### Databases
- **PostgreSQL:** Neon, Supabase, Railway
- **Redis:** Redis Cloud (free tier available)
- **Neo4j:** Neo4j AuraDB (free tier: 1 instance)
- **Weaviate:** Weaviate Cloud (free sandbox)

---

## Testing

```bash
# Frontend unit tests (Vitest)
cd apps/web && pnpm test

# Backend tests (pytest)
cd apps/api && pytest -v --cov=src

# E2E tests (Playwright)
cd apps/web && pnpm run test:e2e
```

---

## Contributing

1. Branch from `main`
2. Run `make lint` before committing
3. Keep commits short and precise
4. Open a PR with clear description

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

*Built for institutional-grade venture intelligence.*
