# Retrospectiva Sprint 2 - Nutricombat



**Sprint:** Sprint 2 - Evolución del Core (24 Sept - 6 Oct 2025)
**Fecha retrospectiva:** 16 de Octubre 2025
**Equipo:** Fabián Muñoz, Vicente Chacón
**Dinámica:** Start, Stop, Continue
## **Contexto del Sprint**

El Sprint 2 se enfocó en evolucionar las funcionalidades core: Dashboard dinámico con datos reales, Calculadora Inteligente de Corte de Peso con IA, y módulo de Registro de Agua.

**Resultado:** Logramos completar los objetivos principales del sprint con la arquitectura completa de corte de peso funcionando, dashboard integrado con datos reales, y frontend del módulo de agua completo (backend pendiente).
## **Lo que hicimos**
### **Backend (Vicente)**
- 

Implementado endpoint completo `/api/v1/weight-cut/analyze` con IA (Gemini) y fallback algorítmico para análisis de corte de peso
- 

Integración con LangChain Hub para gestión de prompts de IA
- 

Integración con Supabase para persistencia de análisis y planes de corte
- 

Sistema completo de timeline diario con generación día por día usando IA
- 

Tabla `daily_timelines` para gestión de planes activos/inactivos
- 

8 endpoints implementados para gestión completa de planes de corte de peso
### **Frontend (Fabián)**
- 

Dashboard evolucionado en 5 iteraciones: desde mockup estático hasta sistema dinámico con datos reales
- 

Integración del dashboard con endpoints de weight cuts y perfil de usuario
- 

ActivePlanDetailsScreen con tabs para visualizar plan completo
- 

Módulo de Registro de Agua completado en frontend:
- 

WaterIntakeModal con botones predefinidos y valores personalizados
- 

WaterHistoryScreen con visualización de consumo diario y semanal
- 

Integración en DashboardScreen
- 

Centralización de configuración de URLs en config/api.js
## **Start, Stop, Continue**
### **START (Empezar a hacer)**
1. 

**Definir Story Points en Planning**
Necesitamos estimar complejidad de tareas para medir velocity con precisión.
1. 

**Sincronizar dependencias Backend-Frontend temprano**
El módulo de agua mostró que debemos identificar dependencias en daily standups.
1. 

**Documentar APIs mientras se desarrollan**
No esperar al final del sprint para documentar en Confluence.
### **STOP (Dejar de hacer)**
1. 

**Arrastrar tareas sin reevaluación**
Hacer Sprint Review formal para decidir qué realmente va al siguiente sprint.
1. 

**Actualizar Jira días después**
Actualizar estados inmediatamente al cambiar de tarea.
1. 

**Adelantarse sin validar con el equipo**
Validar en daily antes de trabajar en features del próximo sprint.
### **CONTINUE (Seguir haciendo)**
1. 

**Trabajo iterativo en features complejas** ⭐
El dashboard evolucionó exitosamente en 5 iteraciones. Mantener este approach.
1. 

**Integración profunda de IA y servicios externos** 🚀
LangChain Hub, Gemini y Supabase se integraron exitosamente con sistema de fallback robusto.
1. 

**Arquitectura escalable desde el inicio** 💪
El sistema de timeline tiene arquitectura sólida que facilita agregar features sin refactorizar.
1. 

**Comentarios técnicos detallados en Jira** 📝
Facilitan troubleshooting y onboarding. Mantener este nivel.
## **Bloqueadores principales**
1. 

**Limitación de plan gratuito de LangSmith**
Límite de tokens insuficiente para imágenes. **Solución:** Usar Gemini API directamente para análisis nutricional.
1. 

**Backend de Registro de Agua pendiente**
Frontend completo esperando backend. **Prioridad Alta para Sprint 3.**
## **Aprendizajes**
### **Técnicos:**
- 

Iteración incremental funciona mejor que big bang
- 

Arquitectura primero ahorra refactoring después
- 

Sistema de fallback es obligatorio para features con IA
- 

Gemini directo cuando LangChain limita por payload
### **De equipo:**
- 

Adelantarse está bien, pero comunicar primero
- 

Jira debe actualizarse en tiempo real
- 

Dependencias deben identificarse temprano en dailys
## **Acciones para Sprint 3**
### **Debe hacerse:**
- 

Implementar backend de Registro de Agua (Vicente)
- 

Sprint Planning con Story Points
- 

Sprint Review formal antes de cerrar
### **Sería bueno:**
- 

Documentar APIs en Confluence mientras se desarrollan
- 

Testing básico en endpoints críticos
- 

Actualizar Jira en tiempo real
## **Métricas**
- 

**Story Points completados:** <corregir  porfavor>
- 

**Satisfacción del equipo:** 4.5/5
- 

**Confianza en el producto:** 5/5