# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## What this is

**Lattice** is an AI-native venture intelligence platform — a full-stack monorepo combining a Next.js 15 frontend, a FastAPI backend, Neo4j graph database, Weaviate vector memory, and 5 AI agents built on Anthropic Claude + OpenAI.

---

## Commands

### Environment setup (first time)

```bash
make env-setup          # copies .env.example → .env / .env.local for both apps
make docker-up          # starts PostgreSQL, Redis, Neo4j, Weaviate
make install            # pnpm install (frontend) + pip install -e ".[dev]" (backend)
make migrate            # alembic upgrade head
make seed               # POST /api/v1/graph/seed — loads demo venture graph
```

### Development

```bash
make dev                # all services in parallel (frontend + backend)
make dev-web            # Next.js only → http://localhost:3000
make dev-api            # FastAPI only → http://localhost:8000 (with --reload)
```

### Testing

```bash
make test               # vitest (frontend) + pytest -x -v (backend)
make test-api           # pytest -x -v --cov=src --cov-report=term-missing
make test-e2e           # Playwright end-to-end
```

Run a single backend test file:
```bash
cd apps/api && pytest tests/test_health.py -v
```

Run a single test by name:
```bash
cd apps/api && pytest -k "test_health_check" -v
```

### Code quality

```bash
make lint               # next lint + ruff check src/
make format             # prettier + ruff format src/
make type-check         # tsc --noEmit + mypy src/
```

### Database migrations

```bash
make migrate                        # apply all pending migrations
make migrate-create MSG="add foo"   # generate new migration from model changes
```

---

## Architecture

### Monorepo layout

| Path | Purpose |
|---|---|
| `apps/web/` | Next.js 15 frontend |
| `apps/api/` | FastAPI backend |
| `packages/shared-types/` | TypeScript types shared across apps |
| `infrastructure/docker/docker-compose.yml` | Full local stack |
| `infrastructure/k8s/` | Kubernetes manifests |

Turborepo (`turbo.json`) orchestrates `build`, `dev`, `lint`, `type-check`, `test` across workspaces. `build` caches `.next/**` and `dist/**`. `dev` is persistent and non-cached.

---

### Frontend (`apps/web`)

**Next.js 15 App Router.** All authenticated pages live under the `(app)` route group.

Layout hierarchy:
```
src/app/layout.tsx           ← root: fonts, ThemeProvider, QueryClientProvider, Toaster
src/app/(app)/layout.tsx     ← wraps all pages in <AppShell> (sidebar + topbar)
src/app/(app)/dashboard/     ← Intelligence Hub
src/app/(app)/graph/         ← Relationship Graph Explorer (React Flow)
src/app/(app)/meetings/      ← AI Meeting Intelligence
src/app/(app)/pipeline/      ← Deal Pipeline (Kanban + table)
src/app/(app)/founders/      ← Founder profiles
src/app/(app)/signals/       ← Signal Feed
src/app/(app)/memory/        ← Institutional Memory Search
```

`Providers.tsx` configures React Query (staleTime 60s, retry 1) and next-themes (default dark).

API calls go through `src/lib/api.ts` — an Axios instance that proxies `/api/v1/*` to the backend. Use `streamAIResponse()` from the same file for SSE streaming endpoints.

---

### Backend (`apps/api`)

**FastAPI with async-first SQLAlchemy 2.0.**

Entry: `src/main.py` — lifespan handler (Sentry init), CORS, request-timing middleware, global exception handler, then `app.include_router(api_router)`.

Router chain: `src/api/v1/router.py` aggregates all sub-routers under `/api/v1`:

| Router | Prefix | Key endpoints |
|---|---|---|
| `intelligence.py` | `/intelligence` | `POST /meeting-brief`, `POST /extract-entities`, `POST /memory/search` |
| `graph.py` | `/graph` | `GET /`, `GET /entity/{id}`, `GET /path/{a}/{b}`, `POST /seed` |
| `signals.py` | `/signals` | `GET /`, `GET /summary` |
| `founders.py` | `/founders` | `GET /`, `GET /{id}` |

**Config:** `src/core/config.py` uses pydantic-settings with `@lru_cache` — one `Settings` instance per process. `ALLOWED_ORIGINS` is stored as a plain `str` (comma-separated) and exposed as the `cors_origins` list property to avoid pydantic-settings JSON-decoding issues. Access settings with `get_settings()`.

**Database layer:** `src/db/base.py` — async engine + `AsyncSessionLocal`. The `get_db()` async generator is the FastAPI dependency for SQL sessions.

**Models** (`src/models/entities.py`): `Founder`, `Company`, `Signal`, `Meeting`, `Memo` — all use `TimestampMixin` for `created_at`/`updated_at`. UUIDs as primary keys via `UUID(as_uuid=True)`.

**Migrations:** Alembic with async engine (`alembic/env.py`). Import new models in `alembic/env.py` so they're included in autogenerate.

---

### AI Agents (`apps/api/src/agents/`)

All agents follow the same pattern: standalone class, instantiated directly in the route handler (no DI container), using `instructor` + Anthropic Claude for structured outputs.

| Agent | File | Primary method |
|---|---|---|
| Entity Extraction | `entity_extraction.py` | `extract(text, source_type)` → `ExtractionResult` |
| Meeting Intelligence | `meeting_intelligence.py` | `generate_brief(founder, company, context, ...)` → `MeetingBriefOutput` |
| Signal Monitoring | `signal_monitoring.py` | `classify_signal(text, source)` / `process_batch(signals)` |
| Relationship Inference | `relationship_inference.py` | `infer_relationships(entities, context)` / `analyze_network(target, network)` |
| Memory Retrieval | `memory_retrieval.py` | `search(query, limit, filters)` — falls back to mock data if Weaviate is unconfigured |

All AI outputs are **Pydantic models** with confidence scores. Agents use `instructor.from_anthropic(AsyncAnthropic(...))` and return structured model instances via `response_model=`.

---

### Graph Engine (`apps/api/src/graph/`)

`GraphEngine` wraps a Neo4j `AsyncDriver`. A new instance is created per request via `get_graph_engine()` in route handlers (the driver itself reconnects). Key methods:

- `upsert_node(type, id, props)` — MERGE by id
- `upsert_relationship(src_type, src_id, tgt_type, tgt_id, rel_type, props)` — MERGE relationship
- `get_entity_graph(id, depth)` — subgraph up to N hops
- `find_shortest_path(src_id, tgt_id)` — Neo4j `shortestPath()`
- `seed_demo_data()` — loads demo founders/companies/investors

`src/graph/seed.py` contains static fallback graph data returned when Neo4j is unavailable.

---

### Vector Memory (`apps/api/src/agents/memory_retrieval.py`)

`MemoryRetrievalAgent` wraps Weaviate. Collection name: `InstitutionalMemory`. If `weaviate_client` is `None` (not configured), `search()` returns hardcoded mock results. Index new documents with `index_document(doc_id, doc_type, title, content, entities, metadata)`.

---

### Background Workers (`apps/api/src/workers/`)

Celery app configured in `celery_app.py`. Tasks in `tasks.py`:

- `extract_entities` → `intelligence` queue, 3 retries
- `monitor_signals` → runs hourly via beat schedule
- `enrich_company` → `enrichment` queue, 2 retries

`run_async(coro)` bridges async agent code into sync Celery tasks.

---

## Key constraints

- `ALLOWED_ORIGINS` in `.env` must be a **comma-separated string**, not JSON array. The `cors_origins` property on `Settings` handles splitting.
- Agents are instantiated per-request — if they become expensive to init, move to module-level singletons or FastAPI `Depends`.
- Neo4j graph routes return `src/graph/seed.py` fallback data silently when Neo4j is unreachable, so the frontend always has data to display.
- The `alembic/env.py` imports `from src.models import entities` — add imports here when new model files are created.
