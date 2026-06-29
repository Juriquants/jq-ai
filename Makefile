# JQ.AI Makefile
# One-stop commands for development, testing, and operations.

.PHONY: up down logs test lint clean restart build

# Start the full stack in detached mode
up:
	docker compose up -d

# Stop the full stack
down:
	docker compose down

# View logs for all services (follow mode)
logs:
	docker compose logs -f

# Run the backend test suite (pytest)
test:
	docker compose exec api pytest

# Run the Python linter (ruff)
lint:
	docker compose exec api ruff check .

# Restart the full stack
restart: down up

# Build all images without cache
build:
	docker compose build --no-cache

# Hard reset: stop, remove volumes, and clean up
clean:
	docker compose down -v --remove-orphans
	docker system prune -f

# Open a shell inside the API container
shell-api:
	docker compose exec api /bin/bash

# Open a shell inside the Gateway container
shell-gateway:
	docker compose exec gateway /bin/bash

# Run a one-off migration (if needed)
migrate:
	docker compose exec api python -m app.migrations
