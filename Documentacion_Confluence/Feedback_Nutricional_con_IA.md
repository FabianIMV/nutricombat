# Feedback Nutricional con IA

none
## Descripción General

Sistema de análisis nutricional inteligente que evalúa el progreso alimenticio del atleta mediante IA y genera recomendaciones personalizadas. El análisis se realiza bajo demanda desde el Dashboard y proporciona insights accionables sobre la dieta durante el weight cutting.
## Funcionalidades Principales
### Análisis con IA
- 

**Trigger:** Botón flotante con icono de bombilla (💡) en el Dashboard
- 

**Proceso:** Envía historial de consumo de los últimos 7 días a servicio de IA
- 

**Resultado:** Análisis detallado con recomendaciones personalizadas
### Componentes del Análisis

**Resumen General**
- 

Evaluación del progreso nutricional
- 

Identificación de patrones alimenticios
- 

Cumplimiento de metas calóricas

**Puntos Fuertes**
- 

Lista de aspectos positivos detectados
- 

Hábitos que están funcionando bien
- 

Logros en el plan nutricional

**Áreas de Mejora**
- 

Oportunidades de optimización
- 

Ajustes recomendados
- 

Hábitos a corregir

**Recomendaciones**
- 

Acciones específicas y priorizadas
- 

Sugerencias de timing de comidas
- 

Ajustes de macronutrientes
## Flujo de Uso
### Solicitar Análisis
1. 

Usuario accede al Dashboard (Avances)
1. 

Presiona el botón flotante con icono de bombilla
1. 

Sistema recopila datos de consumo de últimos 7 días
1. 

Pantalla de carga muestra “Analizando tu alimentación…”
1. 

Se envía solicitud al backend con datos del usuario
1. 

IA procesa información y genera feedback
1. 

Usuario es redirigido a pantalla de resultados
### Visualizar Feedback
1. 

Pantalla muestra análisis completo organizado por secciones
1. 

Usuario puede leer cada sección con scroll
1. 

Feedback se guarda automáticamente en caché
1. 

Botón “Volver al Dashboard” para regresar
### Caché de Feedback
- 

El análisis más reciente se guarda localmente
- 

Usuario puede consultar último análisis sin regenerar
- 

Caché se actualiza cada vez que se solicita nuevo análisis
## Validaciones
### Requisitos para Análisis
- 

Usuario autenticado con timeline activo
- 

Mínimo 3 días de datos de consumo registrados
- 

Datos incluyen calorías, macronutrientes y timing
### Manejo de Casos Edge
- 

**Sin datos suficientes:** Mensaje informativo sugiriendo registrar más días
- 

**Error de IA:** Mensaje de error con opción de reintentar
- 

**Sin conexión:** Muestra último análisis en caché (si existe)
## Tecnologías Utilizadas

**Frontend:**
- 

React Native con Expo
- 

`NutritionFeedbackScreen.js`: Pantalla de resultados
- 

`FeedbackCard.js`: Componente de tarjetas por sección
- 

`LoadingSpinner.js`: Indicador de carga durante análisis

**Servicios:**
- 

`nutritionFeedbackService.js`: Comunicación con API de IA
- 

AsyncStorage: Persistencia de último feedback

**Backend:**
- 

AWS Lambda con Bedrock (Claude 3.5 Sonnet)
- 

API Gateway: Endpoint `/nutrition-feedback`
- 

Procesamiento de datos históricos de consumo
## Integración Backend
### Datos Enviadoswide760
### Respuesta de IAwide760
### Endpoint Utilizado
- 

`POST /nutrition-feedback`: Genera análisis con IA
## Pantallas Involucradas

**DashboardScreen.js**
- 

Botón flotante para activar análisis
- 

Navegación a NutritionFeedbackScreen

**NutritionFeedbackScreen.js**
- 

Visualización de resultados del análisis
- 

Gestión de caché de feedback
- 

Estados: loading, error, success

**FeedbackCard.js**
- 

Componente reutilizable para cada sección
- 

Renderiza título, contenido y lista de items
## Experiencia de Usuario
### Estados Visuales

**Cargando:**wide760

**Éxito:**wide760

**Error:**wide760

**Sin Datos:**wide760
## Manejo de Errores
- 

**Timeout de IA (>30s):** Mensaje de error con opción de reintentar
- 

**Datos insuficientes:** Información clara sobre requisitos mínimos
- 

**Error de red:** Muestra último análisis en caché si existe
- 

**Error de API:** Log de error y mensaje genérico al usuario
## Seguridad
- 

Datos enviados a IA son anónimos (solo métricas, no información personal)
- 

Feedback almacenado solo localmente en dispositivo
- 

Autenticación requerida para acceder al servicio
- 

Rate limiting en backend (máximo 10 análisis por día)
## Mejoras Futuras
- 

**Historial de análisis:** Ver feedbacks anteriores con fechas
- 

**Comparación temporal:** Evolución del feedback semana a semana
- 

**Notificaciones:** Recordatorio para solicitar análisis semanal
- 

**Exportar feedback:** Compartir análisis con nutricionista