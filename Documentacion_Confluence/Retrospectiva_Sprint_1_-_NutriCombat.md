# Retrospectiva Sprint 1 - NutriCombat



**Sprint**: Sprint 1 - Foundación (10-24 Septiembre 2025)
**Fecha retrospectiva**: 16 de Octubre 2025
**Equipo**: Fabián Muñoz, Vicente Chacón
**Dinámica**: Start, Stop, Continue
## Contexto del Sprint

El Sprint 1 se enfocó en establecer las bases del proyecto: autenticación, perfil de usuario, y conexión backend-frontend. Durante el sprint, el tercer integrante del equipo (Ignacio Carrasco) decidió retirarse, por lo que continuamos como dupla.

**Resultado**: Logramos completar los objetivos principales del sprint con la arquitectura serverless funcionando.
## Lo que hicimos
### Backend (Vicente)
- 

Configuramos tabla `profiles` en Supabase con todos los campos necesarios
- 

Desarrollamos Lambda `nutricombat-update-profile` con GET/POST
- 

Configuramos API Gateway con endpoints `/profile`
- 

Resolvimos error de upsert agregando `onConflict` para email
- 

Solucionamos problema de dependencias incluyendo `node_modules` en deployment
### Frontend (Fabián)
- 

Implementamos pantallas de registro y login con AWS Cognito
- 

Conectamos perfil con API `/profile` para lectura y escritura
- 

Agregamos títulos descriptivos a campos de entrada
- 

Cambiamos nivel de actividad y objetivos a dropdowns (mejor UX)
- 

Limpiamos dashboard eliminando símbolos extraños
## Start, Stop, Continue
### START (Empezar a hacer)
1. 

**Actualizar el Jira diariamente** Las tareas estuvieron días en "In Progress" sin cambios. Necesitamos actualizar el estado al terminar cada día.
1. 

**Comentar las tareas mientras trabajamos** Nos faltó documentar qué hicimos en cada tarea. Debemos agregar comentarios explicando el trabajo realizado y problemas encontrados.
1. 

**Pull requests obligatorios** Código se subió directo sin revisión. Implementar PRs con aprobación del compañero antes de merge.
1. 

**Buffer en estimaciones de infra** Setup de Supabase y Lambda tomó más tiempo del esperado. Agregar 30% extra en tareas de configuración.
### STOP (Dejar de hacer)
1. 

**Documentar al final del sprint** Comentarios en Jira los hicimos todos al final. Es mejor documentar mientras desarrollamos para no perder contexto.
1. 

**Trabajar en paralelo sin sincronizar** Frontend y backend avanzaron separados. Necesitamos más puntos de contacto durante el desarrollo.
1. 

**Subestimar complejidad de integración** Los problemas de CORS y deployment nos tomaron más tiempo del planeado. Considerar esto en próximas estimaciones.
### CONTINUE (Seguir haciendo)
1. 

**Resolver problemas técnicos proactivamente** Vicente resolvió los 3 bugs críticos de integración sin escalar. Esto mantuvo el momentum del sprint.
1. 

**Priorizar funcionalidad core** Nos enfocamos en autenticación y perfil primero, dejando features secundarias para después. Fue la decisión correcta.
1. 

**Integración temprana** Conectamos API con frontend desde la primera semana. Esto nos permitió encontrar problemas rápido.
1. 

**Mejoras de UX no planeadas** Fabián implementó dropdowns en lugar de texto libre, mejorando la experiencia sin que estuviera en el scope original.
## Bloqueadores principales
1. 

**Salida del tercer integrante** Ignacio se retiró al inicio del sprint. Redistribuimos las tareas entre nosotros dos y ajustamos expectativas con el profesor.
1. 

**Error de upsert en Lambda** La API no guardaba correctamente los perfiles por 2 días. Lo resolvimos agregando manejo de conflictos con `onConflict`.
1. 

**Node modules faltantes en deployment** Lambda funcionaba local pero fallaba en producción por dependencias. Solucionado incluyendo `node_modules` en el package.
## Aprendizajes

**Técnicos:**
- 

Serverless fue la decisión correcta vs K3S (más simple, más rápido)
- 

Supabase tiene muy buena integración y documentación
- 

CORS debe configurarse desde el inicio para evitar problemas después

**De equipo:**
- 

Dos personas comprometidas > tres personas con compromiso desigual
- 

Comunicación frecuente previene sorpresas de integración
- 

Documentar mientras trabajas > documentar al final
## Acciones para Sprint 2

**Debe hacerse:**
- 

Actualizar Jira al final de cada día (Ambos)
- 

Agregar comentarios en tareas mientras trabajamos (Ambos)

**Sería bueno:**
- 

Documentar proceso de deployment de Lambda (Vicente)
- 

Implementar testing básico en frontend (Fabián)
## Métricas
- 

**Story Points completados**: 13/13 (100%)
- 

**Satisfacción del equipo**: 4/5
- 

**Confianza en el producto**: 5/5