#!/bin/bash

# Solución final para EMFILE en macOS con Expo

echo "🛠️  Configurando entorno final para NutriCombat..."

# Para todos los procesos
pkill -f "expo\|metro" 2>/dev/null || true
sleep 3

# Máxima configuración para macOS
export NODE_OPTIONS="--max-old-space-size=8192 --max-semi-space-size=1024"
export EXPO_USE_FAST_RESOLVER=1
export METRO_CACHE_KEY="nutricombat-final-$(date +%s)"
export WATCHMAN_DISABLE_CI=1
export CI=1

# Límites extremos
ulimit -S -n 32768 2>/dev/null || ulimit -S -n 16384 2>/dev/null || ulimit -S -n 8192

# Limpiar absolutamente todo
echo "🧹 Limpiando cachés completamente..."
rm -rf .expo .metro-cache node_modules/.cache .watchman-* tmp/* 2>/dev/null || true

# Verificar límite aplicado
echo "📊 Límite de archivos: $(ulimit -n)"

echo "🚀 Iniciando con configuración máxima..."
echo "⚡ Una vez que veas el QR, escanéalo INMEDIATAMENTE"

# Comando final con todas las optimizaciones
exec npx expo start --dev-client --port 8081 --clear