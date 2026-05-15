.PHONY: help dev build test lint clean docker-up docker-down seed install

SHELL := /bin/bash

# Colors
BOLD := \033[1m
RESET := \033[0m
GREEN := \033[32m
YELLOW := \033[33m
BLUE := \033[34m

help: ## Show this help
	@echo "$(BOLD)Sago Nexus — AI Venture Intelligence Platform$(RESET)"
	@echo ""
	@echo "$(BOLD)Usage:$(RESET)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-20s$(RESET) %s\n", $$1, $$2}'
	@echo ""

install: ## Install all dependencies
	@echo "$(BLUE)Installing frontend dependencies...$(RESET)"
	pnpm install
	@echo "$(BLUE)Installing backend dependencies...$(RESET)"
	cd apps/api && pip install -e ".[dev]"

dev: ## Start all services in development mode
	@echo "$(GREEN)Starting Sago Nexus in development mode...$(RESET)"
	pnpm run dev

dev-web: ## Start frontend only
	cd apps/web && pnpm run dev

dev-api: ## Start backend API only
	cd apps/api && uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload

docker-up: ## Start all infrastructure services (databases)
	@echo "$(GREEN)Starting infrastructure services...$(RESET)"
	docker compose -f infrastructure/docker/docker-compose.yml up -d postgres redis neo4j weaviate
	@echo "$(GREEN)Infrastructure ready!$(RESET)"
	@echo "  PostgreSQL: localhost:5432"
	@echo "  Redis:      localhost:6379"
	@echo "  Neo4j:      localhost:7474 (browser) / localhost:7687 (bolt)"
	@echo "  Weaviate:   localhost:8080"

docker-down: ## Stop all infrastructure services
	docker compose -f infrastructure/docker/docker-compose.yml down

docker-full: ## Start full stack including API
	docker compose -f infrastructure/docker/docker-compose.yml up -d
	@echo "$(GREEN)Full stack running!$(RESET)"

docker-logs: ## Tail all service logs
	docker compose -f infrastructure/docker/docker-compose.yml logs -f

seed: ## Seed demo data (graph + memory)
	@echo "$(BLUE)Seeding venture graph...$(RESET)"
	curl -X POST http://localhost:8000/api/v1/graph/seed
	@echo "\n$(GREEN)Demo data seeded!$(RESET)"

migrate: ## Run database migrations
	cd apps/api && alembic upgrade head

migrate-create: ## Create a new migration (use: make migrate-create MSG="your message")
	cd apps/api && alembic revision --autogenerate -m "$(MSG)"

test: ## Run all tests
	@echo "$(BLUE)Running frontend tests...$(RESET)"
	cd apps/web && pnpm run test
	@echo "$(BLUE)Running backend tests...$(RESET)"
	cd apps/api && pytest -x -v

test-api: ## Run backend tests only
	cd apps/api && pytest -x -v --cov=src --cov-report=term-missing

test-e2e: ## Run end-to-end tests
	cd apps/web && pnpm run test:e2e

lint: ## Lint all code
	pnpm run lint
	cd apps/api && ruff check src/

format: ## Format all code
	pnpm run format
	cd apps/api && ruff format src/

type-check: ## Run type checks
	pnpm run type-check
	cd apps/api && mypy src/

clean: ## Clean build artifacts
	pnpm run clean
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	find . -name "*.pyc" -delete 2>/dev/null || true

env-setup: ## Copy .env.example files to .env
	@[ -f apps/web/.env.local ] || cp apps/web/.env.example apps/web/.env.local
	@[ -f apps/api/.env ] || cp apps/api/.env.example apps/api/.env
	@echo "$(GREEN).env files created! Update with your API keys.$(RESET)"
	@echo "$(YELLOW)Required:$(RESET)"
	@echo "  - OPENAI_API_KEY"
	@echo "  - ANTHROPIC_API_KEY"
	@echo "  - NEO4J_PASSWORD"
	@echo "  - CLERK_PUBLISHABLE_KEY + CLERK_SECRET_KEY"
