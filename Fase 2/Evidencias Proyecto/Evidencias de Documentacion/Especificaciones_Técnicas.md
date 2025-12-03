# Especificaciones Técnicas

none
## Prerrequisitos
### Entorno de Desarrollo
- 

Node.js 18+
- 

Expo CLI
- 

Cuenta de AWS configurada
- 

API Key de Google Gemini
- 

Proyecto Supabase configurado
### Variables de Entornowide760
## Estructura del Proyectowide760
## Instalación y Configuración
### Setup del Proyecto

bashwide760
## Base de Datos
### Tablas Principales

**users**
- 

user_id (UUID, PK)
- 

email (VARCHAR)
- 

profile_data (JSON)
- 

created_at (TIMESTAMP)

**weight_tracking**
- 

tracking_id (UUID, PK)
- 

user_id (UUID, FK)
- 

weight (DECIMAL)
- 

date (DATE)
- 

phase (ENUM: 'maintenance', 'cutting', 'recovery')

**food_entries**
- 

entry_id (UUID, PK)
- 

user_id (UUID, FK)
- 

food_data (JSON)
- 

calories (INTEGER)
- 

macros (JSON)
- 

timestamp (TIMESTAMP)

**competitions**
- 

competition_id (UUID, PK)
- 

user_id (UUID, FK)
- 

weight_goal (DECIMAL)
- 

competition_date (DATE)
- 

weigh_in_date (DATE)