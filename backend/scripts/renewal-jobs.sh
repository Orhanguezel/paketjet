#!/usr/bin/env bash
set -euo pipefail
umask 077
cd /var/www/paketjet-current/backend
mkdir -p /var/log/paketjet-renewal
case "${1:-}" in
 health) node scripts/renewal-monitor.mjs >> /var/log/paketjet-renewal/health.jsonl 2>&1 || { logger -p daemon.err -t paketjet 'Public health check failed; inspect renewal health log'; exit 1; } ;;
 maintenance) bun scripts/renewal-maintenance.ts --apply >> /var/log/paketjet-renewal/maintenance.jsonl 2>&1 ;;
 backup) node scripts/renewal-backup.mjs >> /var/log/paketjet-renewal/backup.jsonl 2>&1 ;;
 weekly) node scripts/renewal-backup.mjs --weekly >> /var/log/paketjet-renewal/backup.jsonl 2>&1 ;;
 checkpoint) { node scripts/renewal-monitor.mjs; bun scripts/renewal-maintenance.ts; df -P /var/www; pm2 list --no-color; } >> "/var/log/paketjet-renewal/checkpoint-${2:?checkpoint_name}.log" 2>&1 ;;
 *) exit 2 ;;
esac
