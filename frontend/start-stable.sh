#!/bin/bash

# Script estable para NutriCombat que evita crashes del servidor

echo "🛠️  Preparando NutriCombat para ejecución estable..."

# Para todos los procesos anteriores
pkill -f "expo\|metro\|node.*19000" 2>/dev/null || true

# Espera un momento para que los procesos terminen
sleep 2

# Configura el entorno
export NODE_OPTIONS="--max-old-space-size=8192"
export EXPO_USE_FAST_RESOLVER=1
export METRO_CACHE_KEY="nutricombat-stable"
export WATCHMAN_DISABLE_CI=1

# Aumenta límites
ulimit -S -n 16384

# Limpia cachés
echo "🧹 Limpiando cachés..."
rm -rf .expo .metro-cache node_modules/.cache 2>/dev/null || true

echo "🚀 Iniciando servidor estable en puerto 8081..."
echo "📱 Una vez que aparezca el QR, escanéalo inmediatamente con Expo Go"
echo ""

# Inicia con máxima estabilidad
npx expo start --port 8081 --clear --no-dev --minify