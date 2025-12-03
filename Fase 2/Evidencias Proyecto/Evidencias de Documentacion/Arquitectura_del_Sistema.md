# Arquitectura del Sistema

none
## Visión General

NutriCombat utiliza una arquitectura serverless moderna que garantiza escalabilidad y reducción de costos operativos.
## Frontend

**Tecnología:** React Native con Expo
- 

Desarrollo multiplataforma (Android & iOS)
- 

JavaScript como lenguaje principal
- 

Llamadas a API Gateway para autenticación y registro de usuarios
## Backend

**Infraestructura serverless:**
- 

**AWS Lambda Functions** para lógica de negocio
- 

**API Gateway** para exposición de endpoints
- 

**AWS Cognito** para autenticación de usuarios
- 

**Supabase (PostgreSQL)** para almacenamiento de datos
- 

**AWS S3** como repositorio de imágenes
## Flujo de Datos
### Autenticación

Frontend → API Gateway → Lambda Auth → Cognito
### Gestión de Datos

Frontend → API Gateway → Lambda Business → Supabase
### Registro y Cálculo de Calorías

Frontend → Gemini API → Supabase
## Servicios de IA

**Google Gemini API** para análisis de alimentos y cálculo de calorías automatizado
## Consideraciones de Seguridad
- 

Validaciones médicas integradas
- 

Límites de seguridad en cortes de peso
- 

Encriptación de datos sensibles
- 

Autenticación multi-factor opcional