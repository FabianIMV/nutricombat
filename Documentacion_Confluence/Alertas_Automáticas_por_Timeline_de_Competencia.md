# Alertas Automáticas por Timeline de Competencia

none
## Descripción General

Sistema de alertas inteligentes que monitorea en tiempo real el progreso del atleta durante su timeline de weight cutting y genera notificaciones automáticas cuando se detectan desviaciones de las metas establecidas. Las alertas aparecen en el Dashboard (Avances) debajo de las métricas heroicas y se actualizan dinámicamente con cada refresh.
## Funcionalidades Principales
### Tipos de Alertas Generadas

**Alertas de Peso**
- 

Peso por Encima de Meta (Critical/Warning): Alerta cuando el peso actual supera la meta del día
- 

Peso en Meta (Success): Confirma cumplimiento del objetivo
- 

Peso Bajo (Warning): Indica pérdida demasiado rápida
- 

Aumento de Peso (Critical): Detecta ganancia de peso desde el día anterior
- 

Pérdida Acelerada (Warning): Alerta si se pierde >1.5kg en un día

**Alertas de Calorías**
- 

Calorías Excedidas (Warning): Consumo >110% de la meta diaria
- 

Calorías en Rango (Success): Consumo entre 85%-110% de la meta
- 

Calorías Bajas (Info): Consumo <85% de la meta

**Alertas de Hidratación**
- 

Hidratación Crítica (Critical): Consumo <50% de la meta de agua
- 

Aumentar Hidratación (Warning): Consumo entre 50%-80% de la meta
- 

Meta de Hidratación (Success): Meta de agua cumplida (100%+)

**Alertas de Tiempo**
- 

Tiempo Crítico (Critical): ≤2 días restantes y >2kg por perder
- 

Tiempo Limitado (Warning): ≤5 días restantes y >1kg por perder

**Alertas de Fase**
- 

Fase Final (Info): Notifica que se está en la última fase del timeline
### Priorización y Visualización

**Niveles de Severidad:**
- 

**Critical** (Rojo): Requiere acción inmediata - Iconos: ⚠️🚨
- 

**Warning** (Naranja): Ajustes necesarios - Icono: ⚡
- 

**Success** (Verde): Progreso correcto - Icono: ✅
- 

**Info** (Azul): Información útil - Iconos: ℹ️🏁

**Reglas de Visualización:**
- 

Se muestran máximo 3 alertas simultáneas
- 

Orden de prioridad: Critical > Warning > Success > Info
- 

Cada alerta tiene ID único basado en su condición
- 

Actualización automática con pull-to-refresh
### Interacción del Usuario

**Cerrar Alertas:**
- 

Botón X (close-circle) en esquina superior derecha de cada alerta
- 

Al cerrar, la alerta se guarda en AsyncStorage
- 

Las alertas cerradas no vuelven a aparecer
- 

Solo aparecen alertas nuevas o con diferente condición

**Ejemplo de Persistencia:**

Si cierras “Calorías Bajas” (1000/2000 cal) y luego registras más llegando a “Calorías Excedidas” (2500/2000 cal), SÍ verás la nueva alerta porque tiene un ID diferente.
## Flujo de Uso
### Visualización
1. 

Usuario accede al Dashboard (Avances)
1. 

Sistema carga datos de progreso actual desde API
1. 

Se generan alertas comparando progreso vs metas del timeline
1. 

Se muestran las 3 alertas más importantes bajo las métricas heroicas
### Interacción con Alertas
1. 

Usuario lee la alerta (título, mensaje, acción sugerida)
1. 

Usuario puede cerrar la alerta presionando el botón X
1. 

La alerta desaparece y se guarda su ID en AsyncStorage
1. 

Al hacer refresh, la alerta cerrada no reaparece
1. 

Si cambian las condiciones, aparecen nuevas alertas con diferentes IDs
### Actualización de Alertas
1. 

Usuario registra agua/calorías/peso en el dashboard
1. 

Usuario hace pull-to-refresh o recarga la pantalla
1. 

Sistema recalcula alertas con los nuevos datos
1. 

Se muestran alertas actualizadas (excepto las cerradas previamente)
## Validaciones
### Condiciones para Generar Alertas
- 

Timeline activo: Debe existir un timeline en progreso
- 

Datos de progreso: Debe haber datos registrados (calorías, agua, peso)
- 

Día válido: El día actual debe estar dentro del rango del timeline
### Lógica de Alertas
- 

**Peso:** Comparación entre peso actual y meta del día (tolerancia ±0.3kg)
- 

**Calorías:** Porcentaje de consumo vs meta (rangos: <85%, 85-110%, >110%)
- 

**Agua:** Porcentaje de consumo vs meta (rangos: <50%, 50-80%, 80-100%, 100%+)
- 

**Tiempo:** Días restantes vs kg por perder (umbrales: 2 días/2kg, 5 días/1kg)
## Tecnologías Utilizadas

**Frontend:** React Native con Expo

**Servicios:**
- 

`alertsService.js`: Generación y filtrado de alertas
- 

`DashboardScreen.js`: Integración y visualización

**Persistencia:** AsyncStorage para alertas cerradas

**Backend:** No requiere cambios - consume datos existentes de:
- 

Daily Progress API (calorías, agua, peso)
- 

Timeline API (metas diarias, fase)
- 

Weight Cut API (parámetros del plan)
## Integración Backend
### Datos Consumidoswide760
### Endpoints Utilizados
- 

`GET /daily-progress`: Obtiene progreso diario (calorías, agua, peso)
- 

`GET /timeline`: Obtiene metas y fase actual del timeline
- 

`GET /weight-cut`: Obtiene parámetros del plan activo
## IDs de Alertas (Tracking)wide760
## Ejemplos de Mensajes

**Peso Alto (Critical):**wide760

**Calorías Excedidas (Warning):**wide760

**Hidratación Completa (Success):**wide760
## Manejo de Errores
- 

**Sin timeline activo:** No se muestran alertas
- 

**Sin datos de progreso:** Solo se muestran alertas de meta del día
- 

**Error de AsyncStorage:** Las alertas cerradas no persisten entre sesiones
- 

**Datos inválidos:** Se manejan valores nulos/undefined con defaults
## Seguridad
- 

Las alertas solo se generan con datos del usuario autenticado
- 

IDs de alertas cerradas se almacenan localmente (no en backend)
- 

No se expone información sensible en mensajes de alerta
- 

Validación de datos antes de generar alertas
- 

