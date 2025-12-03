# Retrospectiva Sprint 3 - NutriCombat



**Sprint:** Sprint 3 - Consolidación del Sistema (7-18 Octubre 2025)  
**Fecha retrospectiva:** 3 de Diciembre 2025  
**Equipo:** Fabián Muñoz, Vicente Chacón  
**Dinámica:** Start, Stop, Continue
## Contexto del Sprint

El Sprint 3 se enfocó en consolidar las funcionalidades core existentes, completar la integración de autenticación y perfil, y mejorar la arquitectura del sistema. Sprint marcado por refinamiento y estabilización más que por nuevas features.

**Resultado:** Logramos cerrar la deuda técnica del Sprint 2, completar la integración de perfil y autenticación, y establecer bases sólidas para features avanzadas.
## Lo que hicimos
### Backend (Vicente)
- 

Refinamiento de endpoints de perfil con validaciones mejoradas
- 

Optimización de queries a Supabase para reducir latencia
- 

Implementación de logs estructurados en Lambdas
- 

Configuración de monitoring básico en CloudWatch
- 

Documentación de arquitectura serverless
### Frontend (Fabián)
- 

Refinamiento de flujo de autenticación con mejor manejo de estados
- 

Mejoras de UX en formularios de perfil
- 

Implementación de validaciones en tiempo real
- 

Optimización de navegación entre pantallas
- 

Testing manual exhaustivo en dispositivos físicos
## Start, Stop, Continue
### START (Empezar a hacer)
1. 

**Escribir tests unitarios básicos**  
Llegamos al Sprint 3 sin tests automatizados. Necesitamos al menos tests para funciones críticas de backend.
1. 

**Planning más detallado con dependencias explícitas**  
Varios issues dependían de otros sin estar marcados. Debemos mapear dependencias en planning.
1. 

**Retrospectivas al cerrar cada sprint**  
Estamos haciendo retrospectivas retroactivas. Deben hacerse inmediatamente al cerrar el sprint.
### STOP (Dejar de hacer)
1. 

**Carry-over sin reevaluación de alcance**  
Issues de Sprint 1 y 2 siguieron arrastrándose. Si algo lleva 3 sprints, hay que replantearlo.
1. 

**Commits directos a main sin PR**  
Seguimos haciendo commits directos en casos "urgentes". Esto debe eliminarse completamente.
1. 

**Documentar solo al final**  
La documentación de arquitectura se hizo toda al final del sprint. Debe ir en paralelo al desarrollo.
### CONTINUE (Seguir haciendo)
1. 

**Refinamiento iterativo de UX** ⭐  
Las mejoras incrementales en formularios mejoraron significativamente la experiencia. Mantener este approach.
1. 

**Optimización proactiva de performance** 🚀  
Las optimizaciones de queries mejoraron tiempos de respuesta en 40%. Continuar monitoreando y optimizando.
1. 

**Testing manual exhaustivo** 💪  
Fabián probó en 5 dispositivos diferentes. Esto previno varios bugs críticos antes de producción.
1. 

**Comunicación diaria efectiva** 📝  
Los dailys por WhatsApp funcionaron bien. Mantener esta cadencia y formato.
## Bloqueadores principales
1. 

**Deuda técnica de sprints anteriores**  
Varios issues arrastrándose desde Sprint 1 y 2. **Decisión:** Cerrar formalmente y crear nuevos si es necesario.
1. 

**Falta de ambiente de staging**  
Probamos directo en producción. **Acción:** Configurar ambiente de staging en próximo sprint.
1. 

**Documentación desactualizada**  
Varios cambios de arquitectura no reflejados en docs. **Solución:** Actualización completa realizada al final del sprint.
## Aprendizajes

**Técnicos:**
- 

Validaciones en tiempo real mejoran UX sin costo de performance
- 

CloudWatch es suficiente para monitoring básico
- 

Testing en dispositivos reales detecta issues que simuladores no muestran

**De equipo:**
- 

Sprint de consolidación fue necesario después de 2 sprints intensos
- 

Cerrar deuda técnica libera capacidad mental para nuevas features
- 

Documentación actualizada facilita onboarding y troubleshooting
- 

Retrospectivas tardías pierden contexto y detalles importantes
## Acciones para Sprint 4

**Debe hacerse:**
- 

Implementar tests unitarios para endpoints críticos (Vicente)
- 

Establecer política de PRs obligatorios (Ambos)
- 

Hacer retrospectiva al cerrar el sprint (Ambos)

**Sería bueno:**
- 

Automatizar deployment a lambda (Vicente)
- 

Implementar testing básico en frontend (Fabián)
## Métricas
- 

**Satisfacción del equipo:** 4/5
- 

**Confianza en el producto:** 5/5
- 

**Deuda técnica reducida:** 70%