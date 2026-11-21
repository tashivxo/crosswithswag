#!/usr/bin/env bash
# One-time Hetzner VPS setup. Run as root after SSH key login works.
set -euo pipefail
export DEBIAN_FRONTEND=noninteractive

if ! command -v docker >/dev/null 2>&1; then
	curl -fsSL https://get.docker.com | sh
fi

if ! docker compose version >/dev/null 2>&1; then
	apt-get update
	apt-get install -y docker-compose-plugin
fi

if command -v ufw >/dev/null 2>&1; then
	ufw default deny incoming
	ufw default allow outgoing
	ufw allow 22/tcp
	ufw allow 80/tcp
	ufw allow 443/tcp
	ufw --force enable
fi

echo "Docker ready. Clone the repo, create deploy/api.env, then:"
echo "  docker compose --env-file deploy/api.env -f docker-compose.prod.yml up -d --build"