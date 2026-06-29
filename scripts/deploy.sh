#!/bin/bash
# JQ.AI Deployment Helper
# Usage: ./scripts/deploy.sh [command]

set -e

ENV_FILE=".env"
COMPOSE_FILE="docker-compose.yml"

help() {
    echo "JQ.AI Deployment Script"
    echo ""
    echo "Usage: ./deploy.sh [command]"
    echo ""
    echo "Commands:"
    echo "  up          Start the full stack in detached mode"
    echo "  down        Stop the full stack"
    echo "  logs        View logs (follow mode)"
    echo "  test        Run the backend test suite"
    echo "  clean       Hard reset (remove volumes and orphan containers)"
    echo "  build       Rebuild all images without cache"
    echo "  help        Show this help message"
    echo ""
}

if [ ! -f "$ENV_FILE" ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "✅ .env created. Please edit it with your actual secrets."
    else
        echo "❌ .env.example not found. Please create .env manually."
        exit 1
    fi
fi

case "$1" in
    up)
        echo "🚀 Starting JQ.AI stack..."
        docker compose -f "$COMPOSE_FILE" up -d
        echo "✅ Stack started. Access web UI at http://localhost:3000"
        ;;
    down)
        echo "🛑 Stopping JQ.AI stack..."
        docker compose -f "$COMPOSE_FILE" down
        echo "✅ Stack stopped."
        ;;
    logs)
        echo "📜 Tailing logs..."
        docker compose -f "$COMPOSE_FILE" logs -f
        ;;
    test)
        echo "🧪 Running backend tests..."
        docker compose -f "$COMPOSE_FILE" exec api pytest
        ;;
    clean)
        echo "🧹 Performing hard reset..."
        docker compose -f "$COMPOSE_FILE" down -v --remove-orphans
        docker system prune -f
        echo "✅ Clean complete."
        ;;
    build)
        echo "🔨 Rebuilding all images..."
        docker compose -f "$COMPOSE_FILE" build --no-cache
        echo "✅ Build complete."
        ;;
    help|*)
        help
        ;;
esac
