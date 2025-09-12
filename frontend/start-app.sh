#!/bin/bash

# Script para iniciar NutriCombat evitando problemas de EMFILE en macOS

echo "🚀 Iniciando NutriCombat..."

# Limpia procesos anteriores
killall -q node expo metro || true

# Configura límites de archivos
ulimit -S -n 8192
export NODE_OPTIONS="--max-old-space-size=4096"
export EXPO_USE_FAST_RESOLVER=1
export METRO_CACHE_KEY="nutricombat-$(date +%s)"

# Limpia caché
rm -rf .expo .metro-cache node_modules/.cache || true

echo "📱 Iniciando servidor..."
echo "Una vez que veas el QR, escanéalo con Expo Go en tu teléfono"

# Inicia con configuración optimizada para macOS
npx expo start --clear --non-interactive --port 19000