# Dashboard Informativo


## Descripción General

El Dashboard es la pantalla principal de la aplicación que proporciona una vista centralizada del progreso del usuario, métricas nutricionales diarias y alertas importantes. Presenta información relevante para el seguimiento de objetivos de fitness y nutrición.
## Funcionalidades Principales
### Contador de Tiempo
- 

**Tiempo Restante**: Muestra días y horas hasta el pesaje oficial
- 

Formato: `X DÍAS XH`
- 

Tarjeta destacada en color rojo coral para alta visibilidad
- 

Actualización en tiempo real
### Indicador de Fase Actual
- 

**Fase de Entrenamiento**: Indica la fase actual del programa
- 

Ejemplo: “FASE: CORTE INTENSIVO”
- 

Descripción breve del enfoque de la fase
- 

Ejemplo: “Restricción de sodio y carbohidratos activa”
- 

Tarjeta con borde dorado para diferenciación visual
### Progreso de Peso
#### Visualización de Peso
- 

**Peso Actual**: Muestra el peso actual del usuario
- 

**Peso Objetivo**: Meta de peso a alcanzar
- 

**Diferencia**: Cantidad de peso faltante para alcanzar objetivo
- 

**Barra de Progreso**: Indicador visual del porcentaje completado
- 

Color verde brillante
- 

Porcentaje numérico (ej: 60%)
#### Cálculo Automático
- 

Progreso calculado como: `(peso_inicial - peso_actual) / (peso_inicial - peso_objetivo) * 100`
- 

Actualización basada en registros de peso del usuario
### Métricas Nutricionales Diarias
#### Sodio Consumido
- 

**Valor Actual**: Cantidad de sodio consumida en el día (mg)
- 

**Límite Diario**: Máximo permitido según el plan (mg/día)
- 

**Indicador de Estado**:
- 

✓ Verde: Dentro del límite
- 

Color del texto adapta según proximidad al límite
#### Hidratación
- 

**Volumen Consumido**: Litros de agua ingeridos
- 

**Estado de Registro**: Indica si ha sido registrada
- 

Recomendación implícita de ingesta diaria
### Alertas Críticas
#### Sistema de Alertas
- 

Tarjeta destacada en rojo para máxima visibilidad
- 

Prefijo “⚠ ALERTA CRÍTICA”
- 

Mensajes específicos según métricas
- 

Ejemplo: “Reduce sodio desde HOY. Máximo 300mg/día”
- 

Aparece solo cuando se detectan métricas fuera de rango saludable
### Navegación a Subdashboards

El dashboard principal permite acceder a tres vistas especializadas mediante navegación táctil:
#### Vista 1: Planificación Nutricional
- 

Distribución de macronutrientes
- 

Plan de comidas diario
- 

Recomendaciones nutricionales específicas
#### Vista 2: Seguimiento Detallado
- 

Historial de peso y medidas
- 

Gráficos de progreso temporal
- 

Registro de consumo de nutrientes
#### Vista 3: Análisis de Rendimiento
- 

Métricas de entrenamiento
- 

Correlación entre nutrición y desempeño
- 

Recomendaciones de ajuste
## Flujo de Uso
1. 

**Acceso Inicial**
- 

Usuario ingresa tras autenticación exitosa
- 

Sistema carga datos del perfil y métricas actuales
1. 

**Visualización de Métricas**
- 

Información se presenta en orden de prioridad (top-down)
- 

Elementos críticos en parte superior
- 

Scroll vertical para acceder a más detalles
1. 

**Interacción con Tarjetas**
- 

Tarjetas son elementos visuales informativos
- 

Algunas tarjetas permiten navegación a subdashboards
- 

Gestos táctiles para explorar información adicional
1. 

**Actualización de Datos**
- 

Pull-to-refresh para sincronizar con servidor
- 

Actualización automática periódica en segundo plano
- 

Indicadores visuales durante carga
## Componentes Visuales
### Paleta de Colores
- 

**Fondo**: Azul oscuro (#1A1F3A)
- 

**Tarjetas**: Fondo oscuro con bordes definidos
- 

**Acentos**:
- 

Verde azulado (#00D9C0): Elementos interactivos, progreso
- 

Rojo coral (#FF6B82): Alertas, tiempo restante
- 

Dorado (#FFB800): Fase actual
- 

Verde (#00D98A): Indicadores positivos
### Tipografía
- 

**Títulos**: Bold, tamaño grande para jerarquía visual
- 

**Valores Numéricos**: Bold, destacados en color claro
- 

**Descripciones**: Regular, color gris claro para legibilidad
### Iconografía
- 

Íconos simples y reconocibles
- 

Barra de navegación inferior con íconos para:
- 

Calculadoras
- 

Dashboard
- 

Escáner
- 

Perfil
## Datos Calculados y Actualizados
### Métricas en Tiempo Real
- 

Contador de tiempo hasta pesaje
- 

Porcentaje de progreso de peso
- 

Consumo diario de sodio e hidratación
### Datos Persistentes
- 

Fase actual del programa
- 

Peso objetivo
- 

Límites nutricionales configurados
### Sincronización
- 

Los datos se obtienen desde:
- 

API Gateway + Lambda para métricas de usuario
- 

Base de datos PostgreSQL para registros históricos
- 

Cálculos locales para métricas derivadas
## Tecnologías Utilizadas
- 

**Frontend**: React Native con Expo
- 

**Navegación**: React Navigation Bottom Tabs
- 

**Gestión de Estado**: React Hooks (useState, useEffect)
- 

**Visualización**: Componentes nativos de React Native
- 

View, Text, ScrollView
- 

Tarjetas personalizadas con StyleSheet
- 

**Backend**:
- 

AWS Lambda para lógica de negocio
- 

API Gateway para endpoints REST
- 

Base de datos PostgreSQL en Supabase
## Estructura de Datos
### Respuesta del APIwide760
## Validaciones y Lógica de Negocio
### Alertas Críticas
- 

Se activan cuando:
- 

Sodio consumido > 90% del límite diario
- 

Hidratación < 1.5L y > 50% del día transcurrido
- 

Peso actual > peso objetivo + margen de tolerancia
- 

Tiempo restante < 48 horas y objetivo no alcanzado
### Cálculo de Progreso
- 

Validación de peso inicial > peso actual > peso objetivo
- 

Manejo de casos donde el usuario supera su objetivo
- 

Porcentaje limitado a rango 0-100%
### Actualización de Datos
- 

Frecuencia: Cada vez que se navega al dashboard
- 

Pull-to-refresh manual disponible
- 

Cache local para experiencia sin conexión
## Manejo de Errores
- 

**Error de Carga**: Muestra mensaje de error y botón de reintento
- 

**Datos Incompletos**: Muestra valores por defecto o solicita completar perfil
- 

**Timeout de Red**: Usa datos en cache y marca como desactualizados
- 

**Errores de Cálculo**: Validaciones para evitar divisiones por cero o valores negativos
## Rendimiento y Optimización
- 

Lazy loading de subdashboards
- 

Imágenes y gráficos optimizados
- 

Minimización de re-renders mediante React.memo
- 

Debouncing en actualizaciones de métricas en tiempo real
- 

Cache de datos estáticos (fase, límites)
## Funcionalidad: Información del Plan Activo

Se crea función Lambda `getDashboardAnalytics` para procesar y calcular métricas del plan de corte activo del usuario. La función recibe el userId y peso actual del perfil, consulta el plan activo desde la Lambda de weight-cut, y ejecuta cálculos de:
- 

**Tiempo restante**: Días y horas hasta fecha de pesaje
- 

**Progreso de peso**: Peso perdido, faltante y porcentaje de avance
- 

**Fase actual**: Determina fase según días restantes (INITIAL, FINAL_WEEK, WATER_CUT, WEIGH_IN, COMPLETE)
- 

**Métricas nutricionales**: Límites de sodio, hidratación y calorías ajustados por fase
- 

**Alertas críticas**: Genera alertas según fase actual
### Endpointwide760

**Request Body:**wide760

**Response:**wide760
### Configuración Lambda
- 

**Nombre**: `nutricombat-dev-getDashboardAnalytics`
- 

**Runtime**: Node.js 18.x
- 

**Handler**: `dashboard-analytics.handler`
- 

**Timeout**: 30s
- 

**Memoria**: 128MB
- 

**API Gateway**: Integración AWS_PROXY con CORS habilitado

**Nota**: Funcionalidad base para visualización de plan activo. Próximas iteraciones incluirán tracking de métricas diarias, historial de progreso y análisis de rendimiento.