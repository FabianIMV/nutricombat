# NutriCombat

**Aplicación de nutrición especializada para deportes de combate**

<img width="922" height="288" alt="image" src="https://github.com/user-attachments/assets/dcc97f21-7071-4a02-8b85-7ee899423f47" />

---

## Descripción del Proyecto

NutriCombat es una Progressive Web App diseñada para atletas de deportes de combate que necesitan realizar procesos de corte de peso para competencias oficiales. La aplicación utiliza inteligencia artificial para generar planes personalizados de nutrición y proporciona herramientas especializadas que no están disponibles en aplicaciones de nutrición convencionales.

### Problema que Resuelve

Los peleadores de boxing, MMA, judo, muay thai y otras disciplinas de combate enfrentan el desafío técnico del "corte de peso": perder peso de manera controlada en los 5-7 días previos al pesaje oficial y luego recuperar peso estratégicamente antes de la competencia. Este proceso requiere control de macronutrientes, hidratación y timing preciso que las aplicaciones genéricas no proporcionan.

### Diferencial Competitivo

- **Aplicaciones genéricas (MyFitnessPal):** "Quiero perder 5kg" - enfoque general  
- **NutriCombat:** "Necesito pesar exactamente 70kg el 15 de octubre para pesaje oficial de box" - enfoque especializado

La aplicación integra validaciones de seguridad médica y sistemas de alertas basados en el timeline de competencia.

---

## Características Principales

### Registro y cálculo de calorías (Integración con Gemini)
- Registro diario de alimentos y comidas
- Cálculo automático de calorías consumidas y macronutrientes
- Análisis de alimentos mediante fotografías
- Recomendaciones personalizadas según fase de corte
- Alertas específicas por consumo de sodio, carbohidratos y agua

### Sistema de Alertas Inteligentes
- Notificaciones basadas en timeline de competencia
- Alertas de seguridad médica automáticas
- Recordatorios específicos por fase de corte
- Protocolo de recuperación post-pesaje

### Tracking Especializado
- Registro de peso diario con contexto de corte
- Control de hidratación por fases
- Monitoreo de macronutrientes críticos
- Dashboard con métricas específicas para combat sports

---

## Arquitectura Técnica

### Frontend
- React Native con Expo (Android & iOS)
- JavaScript
- Llamadas a API Gateway para autenticación y registro de usuarios

### Backend
- AWS Lambda Functions para lógica de negocio serverless
- API Gateway para exposición de endpoints
- AWS Cognito para autenticación
- Supabase (PostgreSQL) para almacenamiento de datos
- AWS S3 como repositorio de imágenes

### Flujo de datos
- Autenticación: Frontend → API Gateway → Lambda Auth → Cognito
- Datos: Frontend → API Gateway → Lambda Business → Supabase
- Registro/calculo de calorías: Frontend → Gemini API → Supabase

### Servicios de IA
- **Google Gemini API** para análisis de alimentos y cálculo de calorías

---

## Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- Expo CLI
- Cuenta de AWS configurada
- API Key de Google Gemini
- Proyecto Supabase configurado

### Setup del Proyecto

```bash
# Clonar repositorio
git clone https://github.com/usuario/nutricombat
cd nutricombat/frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Iniciar desarrollo
npm start


### Variables de Entorno Necesarias

```env
SUPABASE_URL=tu_supabase_url
SUPABASE_ANON_KEY=tu_supabase_key
GEMINI_API_KEY=tu_gemini_api_key
AWS_ACCESS_KEY_ID=tu_aws_access_key
AWS_SECRET_ACCESS_KEY=tu_aws_secret_key
```

---

## Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── common/         # Componentes genéricos
│   └── specialized/    # Componentes específicos para corte de peso
├── screens/            # Pantallas principales
│   ├── auth/          # Autenticación
│   ├── dashboard/     # Dashboard principal
│   ├── weight-cut/    # Funcionalidades de corte
│   └── food/          # Registro y análisis de alimentos
├── services/          # Servicios externos
│   ├── api/           # Llamadas a APIs
│   ├── gemini/        # Integración con Gemini
│   └── supabase/      # Cliente de base de datos
├── utils/             # Utilidades y helpers
│   └── validators/    # Validaciones de seguridad

```

---

## Metodología de Desarrollo

### Framework Ágil
- Sprints de 2 semanas
- Daily standups virtuales
- Sprint planning con priorización de historias de usuario
- Retrospectivas para mejora continua

### Herramientas de Gestión
- **Jira** para gestión de backlog y sprints
- **GitHub** para control de versiones
- **Figma** para diseño y prototipos
- **WhatsApp** para comunicación del equipo

### Definición de Done
- Código revisado por al menos un compañero
- Tests unitarios implementados
- Funcionalidad probada en dispositivo físico
- Documentación actualizada

---

## Equipo de Desarrollo

**Fabián Muñoz** - Full Stack Developer (Frontend Focus)
- Desarrollo de interfaz móvil React Native
- Integración con APIs externas (Gemini)
- Diseño UI/UX e implementación de mockups

**Vicente Chacón** - Full Stack Developer (Backend Focus)  
- Arquitectura del sistema backend
- Configuración de servicios AWS
- Implementación de APIs REST

**Ignacio Carrasco** - Project Manager & QA Analyst
- Gestión de metodología Scrum
- Testing funcional y documentación
- Coordinación de sprints y validación del producto

---

## Estado Actual del Proyecto

### Sprint 1 (En Progreso)
- Setup inicial del proyecto React Native
- Configuración de base de datos Supabase
- Sistema básico de autenticación
- Pantallas base de navegación

### Roadmap General
- **MVP (Sprints 1-2):** Funcionalidades core de corte de peso
- **Funcionalidades Avanzadas (Sprints 3-4):** Dashboard especializado, análisis avanzado
- **Optimización (Sprints 5-6):** PWA, funcionalidades offline, pulido final

---

**Importante:** Esta aplicación no reemplaza la supervisión médica profesional. Los usuarios deben consultar con profesionales de la salud antes de iniciar cualquier plan de corte de peso.
