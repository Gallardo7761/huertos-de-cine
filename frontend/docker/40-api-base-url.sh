#!/bin/sh
# Permite apuntar el frontend a otra API sin recompilar (por ej en local)
# Si API_BASE_URL no está definida se mantiene la URL de settings.prod.json
set -e

SETTINGS=/usr/share/nginx/html/config/settings.prod.json
NGINX_CONF=/etc/nginx/conf.d/default.conf

if [ -n "$API_BASE_URL" ]; then
    sed -i -E "s#\"baseUrl\"[[:space:]]*:[[:space:]]*\"[^\"]*\"#\"baseUrl\": \"${API_BASE_URL}\"#" "$SETTINGS"
    echo "API base URL -> ${API_BASE_URL}"
fi

BASE_URL=$(sed -n -E 's#.*"baseUrl"[[:space:]]*:[[:space:]]*"([^"]*)".*#\1#p' "$SETTINGS" | head -n 1)
API_ORIGIN=$(echo "$BASE_URL" | sed -E 's#^(https?://[^/]+).*#\1#')
sed -i "s#__API_ORIGIN__#${API_ORIGIN}#g" "$NGINX_CONF"
echo "CSP connect-src -> ${API_ORIGIN}"
