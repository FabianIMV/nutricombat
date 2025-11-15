# Documentación de Funcionalidades

none
## Descripción General

Esta sección contiene la documentación técnica detallada de las funcionalidades implementadas en la aplicación NutriCombat. Cada documento describe flujos de uso, validaciones, integraciones backend, estructura de datos y tecnologías utilizadas.
## Contenido

Esta documentación está organizada por funcionalidad específica de la aplicación:
### Funcionalidades de Usuario
- 

[**Inicio de Sesión**](url): Sistema de autenticación con AWS Cognito, recuperación de contraseña y persistencia de sesión
- 

[**Perfil de Usuario**](url): Gestión completa de información personal, datos antropométricos y foto de perfil con Supabase Storage
- 

[**Dashboard Informativo**](url): Pantalla principal con métricas nutricionales, progreso de peso, alertas críticas y navegación a subdashboards
## Propósito

Esta documentación técnica está diseñada para:
- 

**Desarrolladores**: Entender la implementación completa de cada funcionalidad
- 

**QA/Testing**: Conocer validaciones, flujos de uso y casos de error
- 

**Product Owners**: Comprender el alcance técnico de cada feature
- 

**Nuevos miembros del equipo**: Onboarding rápido a las funcionalidades existentes
## Estructura de Documentos

Cada documento de funcionalidad incluye:
1. 

**Descripción General**: Resumen de la funcionalidad
1. 

**Funcionalidades Principales**: Detalle de características específicas
1. 

**Flujo de Uso**: Pasos del usuario y del sistema
1. 

**Validaciones**: Reglas de negocio y validaciones técnicas
1. 

**Tecnologías Utilizadas**: Stack tecnológico específico
1. 

**Integración Backend**: Endpoints, estructura de datos y servicios
1. 

**Seguridad**: Consideraciones de seguridad implementadas
1. 

**Manejo de Errores**: Casos de error y respuestas del sistema
## Stack Tecnológico General

Todas las funcionalidades documentadas utilizan el siguiente stack base:
### Frontend
- 

React Native con Expo
- 

React Navigation
- 

AsyncStorage para persistencia local
### Backend
- 

AWS Lambda para lógica de negocio
- 

API Gateway para endpoints REST
- 

AWS Cognito para autenticación
### Base de Datos
- 

PostgreSQL en Supabase
- 

Supabase Storage para archivos multimedia
## Convenciones
- 

Los endpoints se documentan en formato: `MÉTODO /ruta?parametros`
- 

Las estructuras de datos se muestran en formato JSON
- 

Los flujos de uso están numerados secuencialmente
- 

Los errores se documentan con su causa y respuesta del sistema
## Actualización

Esta documentación se actualiza cuando:
- 

Se implementa una nueva funcionalidad
- 

Se modifica significativamente una funcionalidad existente
- 

Se agregan nuevas validaciones o integraciones
- 

Se identifican casos de uso no documentados