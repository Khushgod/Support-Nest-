#!/usr/bin/env bash
set -euo pipefail

DOMAIN="supportnest.io"
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DATA_DIR="/var/lib/supportnest/data"

echo "==> Support Nest deployment"

# ── 1. Validate secrets ──────────────────────────────────────────────────────
if [[ ! -f "$APP_DIR/.env.production" ]]; then
  echo "ERROR: .env.production not found. Copy it and fill in the secrets first."
  exit 1
fi

source "$APP_DIR/.env.production"

if [[ -z "${GROQ_API_KEY:-}" ]]; then
  echo "ERROR: GROQ_API_KEY is empty in .env.production"
  exit 1
fi
if [[ -z "${SUPPORTNEST_DATA_KEY:-}" ]]; then
  echo "ERROR: SUPPORTNEST_DATA_KEY is empty — generate with: openssl rand -base64 32"
  exit 1
fi
if [[ -z "${SUPPORTNEST_SESSION_SECRET:-}" ]]; then
  echo "ERROR: SUPPORTNEST_SESSION_SECRET is empty — generate with: openssl rand -base64 48"
  exit 1
fi

# ── 2. Persistent data directory ─────────────────────────────────────────────
echo "==> Creating data directory at $DATA_DIR"
sudo mkdir -p "$DATA_DIR/vault"
sudo chown -R 1001:1001 "$DATA_DIR"   # matches nextjs uid in Dockerfile

# Copy existing .data if present and target is empty
if [[ -d "$APP_DIR/.data" && ! -f "$DATA_DIR/sagenest.db" ]]; then
  echo "==> Migrating existing .data to $DATA_DIR"
  sudo cp -r "$APP_DIR/.data/." "$DATA_DIR/"
  sudo chown -R 1001:1001 "$DATA_DIR"
fi

# ── 3. Certbot ACME webroot dir ──────────────────────────────────────────────
sudo mkdir -p /var/www/certbot

# ── 4. Enable nginx site ─────────────────────────────────────────────────────
echo "==> Enabling nginx site"
sudo ln -sf /etc/nginx/sites-available/supportnest.io \
            /etc/nginx/sites-enabled/supportnest.io

# Temporarily serve HTTP only (comment out SSL block) if certs don't exist yet
if [[ ! -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]]; then
  echo "==> No certificate yet — activating HTTP-only config for certbot"
  sudo tee /etc/nginx/sites-available/supportnest.io-bootstrap > /dev/null << HTTPONLY
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN;
    location /.well-known/acme-challenge/ { root /var/www/certbot; }
    location / { return 200 'Support Nest coming soon'; add_header Content-Type text/plain; }
}
HTTPONLY
  sudo ln -sf /etc/nginx/sites-available/supportnest.io-bootstrap \
              /etc/nginx/sites-enabled/supportnest.io-bootstrap
  sudo nginx -t && sudo systemctl reload nginx

  echo "==> Obtaining SSL certificate via certbot"
  sudo certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" \
    --non-interactive --agree-tos \
    --email "suryanshu@nyaayai.com" \
    --redirect

  sudo rm -f /etc/nginx/sites-enabled/supportnest.io-bootstrap
  sudo rm -f /etc/nginx/sites-available/supportnest.io-bootstrap
fi

# ── 5. Test & reload nginx with full HTTPS config ────────────────────────────
echo "==> Reloading nginx with HTTPS config"
sudo nginx -t && sudo systemctl reload nginx

# ── 6. Build and start Docker container ──────────────────────────────────────
echo "==> Building Docker image"
cd "$APP_DIR"
docker compose build --pull

echo "==> Starting container"
docker compose up -d

echo "==> Waiting for app to become healthy"
for i in {1..20}; do
  if curl -sf http://127.0.0.1:3009/ > /dev/null 2>&1; then
    echo "==> App is up!"
    break
  fi
  echo "   attempt $i/20 …"
  sleep 5
done

echo ""
echo "Support Nest is live at https://$DOMAIN"
echo ""
echo "Useful commands:"
echo "  docker compose logs -f          — view app logs"
echo "  docker compose restart          — restart the container"
echo "  docker compose pull && docker compose up -d  — deploy an update"
