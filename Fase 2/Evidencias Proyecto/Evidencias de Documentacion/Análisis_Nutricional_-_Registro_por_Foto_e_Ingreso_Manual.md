# Análisis Nutricional - Registro por Foto e Ingreso Manual

none
## Descripción General

Sistema de análisis nutricional que permite a los usuarios registrar sus comidas mediante dos métodos: fotografía con detección automática o ingreso manual con descripción textual. Ambos métodos utilizan inteligencia artificial (Gemini) para calcular calorías y macronutrientes.
## Métodos de Registro
### 1. Registro por Fotografía

**Pantalla:** ScannerScreen

**Endpoint:** `POST /nutrition/analyze-nutrition`

**Modelo IA:** Gemini Pro 2.5 (visión)

**Flujo:**
1. 

Usuario captura foto o selecciona desde galería
1. 

Imagen se convierte a base64 (<20MB)
1. 

Backend analiza con IA de visión
1. 

Retorna: calorías, macros, ingredientes detectados, peso estimado, confianza del análisis

**Características:**
- 

Detección automática de ingredientes
- 

Estimación de peso en gramos
- 

Porcentaje de confianza del análisis
- 

Soporte para múltiples alimentos en una foto
### 2. Registro Manual

**Pantalla:** ManualFoodEntryScreen

**Endpoint:** `POST /nutrition/analyze-manual`

**Modelo IA:** Gemini Flash 2.5 (texto)

**Flujo:**
1. 

Usuario ingresa nombre del alimento
1. 

Selecciona tipo: comida, bebida, snack o postre
1. 

Selecciona porción: pequeña (100-150g), mediana (200-300g), grande (400-500g) o gramos personalizados
1. 

Backend analiza con IA de texto
1. 

Retorna: calorías, macros, nombre normalizado

**Casos de uso:**
- 

Cámara no disponible
- 

Servicio de visión saturado (error 500)
- 

Usuario prefiere describir en lugar de fotografiar
- 

Alimentos sin acceso visual inmediato
## Estructura de Respuesta

Ambos métodos retornan JSON idéntico:wide760
## Visualización de Resultados

**NutritionResultsScreen:**
- 

Nombre del alimento
- 

Badge de calorías destacado
- 

Cuadrícula de macronutrientes
- 

Peso estimado y confianza
- 

Lista de ingredientes (si aplica)
- 

Botón para guardar en progreso diario

**NutritionTrackingScreen:**
- 

Header con hora de registro (ícono + timestamp)
- 

Badge de calorías con ancho fijo (80px)
- 

Detalles: peso y confianza en negrita
- 

Macros visualizados en barra horizontal
- 

Orden cronológico inverso (más reciente primero)
## Manejo de Errores

**Error 500 - Modelo Saturado:**wide760

**Alternativa automática:** Si análisis por foto falla, app sugiere usar registro manual.
## Endpoints Backend

| Endpoint | Método | Payload | Propósito |

|----------|--------|---------|-----------|

| `/nutrition/analyze-nutrition` | POST | `{imageBase64, model}` | Análisis por foto |

| `/nutrition/analyze-manual` | POST | `{foodName, foodType, portionType, portionGrams?}` | Análisis manual |
## Validaciones Frontend
- 

**Foto:** Tamaño máximo 20MB, formato jpg/png
- 

**Manual:** Nombre de alimento requerido (mínimo 3 caracteres)
- 

**Manual:** Tipo de comida requerido
- 

**Manual:** Tipo de porción requerido
- 

**Manual:** Gramos personalizados solo si se selecciona porción “Gramos”
## Integración con Progreso Diario

Ambos métodos guardan en `day_progress` con estructura:wide760
## Mejoras de UI/UX
- 

**Badge de calorías:** Fondo cyan (#00ffc8), ancho fijo, previene corte en iOS
- 

**Orden cronológico:** `.reverse()` en array para mostrar última comida primero
- 

**Header de tiempo:** Línea divisoria con ícono de reloj para cada comida
- 

**Labels en negrita:** “Peso:” y “Confianza:” destacados visualmente
- 

**Navegación fluida:** Post-guardado redirige automáticamente a Dashboard
## Tecnologías
- 

**Frontend:** React Native + Expo
- 

**Backend:** NestJS Lambda (AWS)
- 

**IA:** Google Gemini (Pro 2.5 para visión, Flash 2.5 para texto)
- 

**Despliegue:** GitHub Actions → AWS Lambda
- 

**API Gateway:** `https://vgx997rty0.execute-api.us-east-1.amazonaws.com/prod/api/`