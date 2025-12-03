# Retrospectiva Sprint 5 - NutriCombat



**Sprint:** Sprint 5 - IA Avanzada y Sistema de Alertas (5-16 Noviembre 2025)
**Fecha retrospectiva:** 3 de Diciembre 2025
**Equipo:** Fabián Muñoz, Vicente Chacón
**Dinámica:** Start, Stop, Continue
## Contexto del Sprint

El Sprint 5 fue el sprint final del proyecto, enfocado en funcionalidades avanzadas de IA: Recomendaciones Personalizadas con IA y Alertas Automáticas por Timeline de Competencia. Este sprint consolidó el diferencial competitivo de NutriCombat con features que no existen en apps genéricas.

**Resultado:** Sistema de alertas inteligentes operativo en Dashboard, Feedback nutricional con IA funcional, calculadora de corte de peso completada, y cierre exitoso del MVP de NutriCombat.
## Lo que hicimos
### Backend (Vicente)
- 

Lambda getDashboardAnalytics para análisis de planes activos
- 

Endpoint /nutrition-feedback con integración a AWS Bedrock (Claude 3.5 Sonnet)
- 

Sistema de generación de alertas basadas en progreso vs timeline
- 

Lógica de priorización de alertas (Critical > Warning > Success > Info)
- 

Refinamiento final de calculadora de corte de peso
- 

Optimización de queries para reducir latencia en dashboard
### Frontend (Fabián)
- 

AlertsService.js con 15+ tipos de alertas diferentes
- 

Integración de alertas en DashboardScreen bajo métricas heroicas
- 

NutritionFeedbackScreen con visualización de análisis de IA
- 

Sistema de persistencia de alertas cerradas (AsyncStorage)
- 

Botón flotante para solicitar análisis nutricional
- 

FeedbackCard component reutilizable para resultados
## Start, Stop, Continue
### START (Empezar a hacer)
1. 

**Definir KPIs de precisión para features de IA**
Las alertas y feedback son subjetivos. Necesitamos métricas para validar si están funcionando bien.
1. 

**User testing con atletas reales**
Necesitamos feedback de usuarios objetivo para validar utilidad de alertas y recomendaciones.
1. 

**Monitoreo de uso de features**
¿Cuántos usuarios solicitan análisis de IA? ¿Cierran alertas o las leen? Necesitamos estos datos.
### STOP (Dejar de hacer)
1. 

**Arrastrar features complejas por múltiples sprints**
Calculadora de corte de peso tomó 3 sprints. Si algo es tan complejo, hay que partir en issues más pequeños.
1. 

**Diseñar UX sin validar con datos reales**
Tuvimos que iterar visualización de alertas 3 veces. Mockups con datos reales desde el inicio.
1. 

**Implementar lógica de negocio compleja en frontend**
AlertsService tiene 500+ líneas. Parte de esta lógica debería estar en backend.
### CONTINUE (Seguir haciendo)
1. 

**Sistema de priorización inteligente de información** 🚀
Las alertas priorizadas por severidad mejoraron significativamente UX. Aplicar este principio a más features.
1. 

**Componentes altamente reutilizables** 💪
FeedbackCard se usa en múltiples pantallas. Seguir creando componentes genéricos y configurables.
1. 

**Persistencia inteligente de estado de UI** 📝
El sistema de alertas cerradas mejora UX sin molestar al usuario. Aplicar a más features.
## Bloqueadores principales
1. 

**Complejidad de lógica de alertas**
15+ tipos de alertas con diferentes condiciones. **Solución:** Documentación exhaustiva y tests manuales extensivos.
1. 

**Balance entre alertas útiles vs spam**
Primeras versiones generaban demasiadas alertas. **Solución:** Límite de 3 alertas simultáneas y priorización estricta.
## Aprendizajes

**Técnicos:**
- 

Sistema de priorización previene sobrecarga de información al usuario
- 

Persistencia local de preferencias de UI mejora significativamente experiencia
- 

Cold starts de Lambda con modelos de IA son inevitables, hay que diseñar UX considerándolos
- 

Features complejas necesitan iteración con datos reales desde el inicio

**De equipo:**
- 

Validación con datos reales debe ser paso obligatorio antes de implementar UX compleja
- 

Features que toman >2 sprints deben replantearse o partirse
- 

Documentar lógica de negocio compleja mientras se desarrolla es crítico
- 

User testing temprano previene retrabajos costosos

**De producto:**
- 

Sistema de alertas es el feature más valorado según feedback informal
- 

Análisis nutricional con IA diferencia significativamente NutriCombat de competencia
- 

Balance entre automatización y control del usuario es crucial
## Cierre del Proyecto

Con el Sprint 5 se completa el desarrollo del MVP de NutriCombat. Todas las funcionalidades core han sido implementadas exitosamente:

✅ Sistema de autenticación y gestión de usuarios
✅ Calculadora inteligente de corte de peso
✅ Dashboard con métricas en tiempo real
✅ Análisis de alimentos con IA (Google Gemini)
✅ Sistema de alertas inteligentes por timeline de competencia
✅ Recomendaciones nutricionales personalizadas

El producto está listo para presentación final del capstone y potencial lanzamiento a usuarios beta.
## Métricas Finales
- 

**Features de IA completados:** 2/2 (100%)
- 

**Satisfacción del equipo:** 4.5/5
- 

**Confianza en el producto:** 5/5
- 

**Complejidad del sprint:** Alta (features más complejas hasta ahora)
- 

**Estado del MVP:** ✅ Completado