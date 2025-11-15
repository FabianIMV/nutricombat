# Perfil de Usuario


## Descripción General

La sección de perfil permite a los usuarios visualizar y gestionar su información personal, datos antropométricos y objetivos de fitness. Incluye funcionalidad completa de gestión de foto de perfil mediante Supabase Storage.
## Funcionalidades Principales
### Visualización de Perfil
#### Perfil General
- 

**Foto de Perfil**:
- 

Imagen circular del usuario (si está cargada)
- 

Avatar con inicial del nombre como alternativa
- 

Borde decorativo con color secundario
- 

**Nombre del Usuario**: Muestra el nombre completo registrado
#### Información Personal
- 

**Nombre**: Nombre completo del usuario
- 

**Edad**: Edad actual en años
- 

**Altura**: Medida en centímetros
- 

**Peso**: Medida en kilogramos
#### Salud y Fitness
- 

**Nivel de Actividad**: Indica el nivel de actividad física
- 

Sedentario
- 

Moderado
- 

Activo
- 

Muy Activo
- 

**Objetivos**: Meta nutricional del usuario
- 

Pérdida de peso
- 

Ganancia muscular
- 

Mantener peso
- 

Corte de peso
- 

Rendimiento
### Gestión de Foto de Perfil
#### Subida de Imagen
- 

Selector de galería mediante `expo-image-picker`
- 

Editor de recorte cuadrado (ratio 1:1)
- 

Compresión automática al 70% de calidad para optimizar almacenamiento
- 

Validación de formatos: JPG, JPEG, PNG, WEBP
#### Actualización de Imagen
- 

Botón “Cambiar foto” cuando ya existe una imagen
- 

Eliminación automática de la foto anterior al subir una nueva
- 

Validación de subida exitosa antes de actualizar interfaz
#### Eliminación de Imagen
- 

Botón “Eliminar” para remover la foto actual
- 

Diálogo de confirmación antes de eliminar
- 

Reversión al avatar con inicial tras eliminación
### Configuración
#### Modificar Perfil
- 

Botón que dirige a la pantalla de edición de perfil
- 

Permite actualizar toda la información personal y de fitness
#### Cerrar Sesión
- 

Botón destacado en rojo para cerrar sesión
- 

Limpia tokens y credenciales almacenadas
- 

Redirige a la pantalla de inicio de sesión
### Actualización de Datos

La pantalla cuenta con funcionalidad de “pull to refresh” que permite:
- 

Actualizar información del perfil desde el servidor
- 

Indicador visual de carga durante actualización
- 

Sincronización de cambios recientes
## Flujo de Uso
### Visualización
1. 

Usuario accede desde el menú de navegación inferior
1. 

Se carga información desde API Gateway/Lambda
1. 

Se muestra foto de perfil desde Supabase Storage (si existe)
1. 

Se despliega información personal y de fitness
### Edición de Perfil
1. 

Usuario presiona “Modificar mi perfil”
1. 

Sistema redirige a pantalla de edición
1. 

Pantalla scrollable con todos los campos editables:
- 

Foto de perfil (cambiar/eliminar)
- 

Nombre completo
- 

Peso actual (kg)
- 

Altura (cm)
- 

Edad
- 

Nivel de actividad (selector)
- 

Objetivos (selector)
1. 

Validación de campos obligatorios antes de guardar
1. 

Botón “Guardar Perfil” actualiza información
### Gestión de Foto
1. 

En pantalla de edición, usuario presiona “Subir foto” o “Cambiar foto”
1. 

Sistema solicita permisos de galería
1. 

Usuario selecciona imagen y edita en formato cuadrado
1. 

Sistema comprime y sube a Supabase Storage
1. 

URL de imagen se guarda en base de datos PostgreSQL
1. 

Foto se muestra inmediatamente en interfaz
## Validaciones
### Campos Obligatorios
- 

Nombre completo
- 

Peso actual
- 

Altura
- 

Edad
### Campos Opcionales
- 

Nivel de actividad
- 

Objetivos
- 

Foto de perfil
### Formato de Datos
- 

Peso: Número decimal positivo
- 

Altura: Número entero positivo
- 

Edad: Número entero positivo
- 

Foto: Formatos de imagen válidos (JPG, PNG, WEBP)
## Tecnologías Utilizadas
- 

**Frontend**: React Native con Expo
- 

**Navegación**: React Navigation (Stack + Bottom Tabs)
- 

**Gestión de Imágenes**:
- 

`expo-image-picker`: Selección y edición de fotos
- 

`expo-file-system`: Lectura de archivos locales
- 

**Almacenamiento de Imágenes**: Supabase Storage con bucket público
- 

**Base de Datos**: PostgreSQL en Supabase
- 

**Backend**:
- 

AWS Lambda (`nutricombat-update-profile`)
- 

API Gateway para endpoints REST
- 

**Persistencia**: AsyncStorage para datos de sesión
## Integración Backend
### Endpoints Utilizados
- 

**GET** `/profile?email={email}`: Obtiene datos del perfil
- 

**POST** `/profile`: Actualiza o crea perfil (upsert)
### Estructura de Datoswide760
### Supabase Storage
- 

**Bucket**: `profile-pictures` (público)
- 

**Políticas RLS**: Configuradas para permitir INSERT, SELECT, UPDATE, DELETE
- 

**Nomenclatura**: `{email}-{timestamp}.{extension}`
- 

**URL Pública**: Generada automáticamente por Supabase
## Seguridad
- 

Fotos almacenadas en bucket público con URLs no predecibles
- 

Validación de tipos de archivo permitidos
- 

Límite de tamaño mediante compresión automática
- 

Políticas de Row-Level Security en Supabase
- 

Autenticación requerida para modificar datos de perfil
- 

Service Role Key utilizada solo en backend (Lambda)
## Manejo de Errores
- 

**Error de permisos**: Solicita acceso a galería si no está otorgado
- 

**Error de subida**: Muestra mensaje específico del error
- 

**Error de red**: Indica problema de conexión
- 

**Error de validación**: Alerta sobre campos incompletos o inválidos
- 

**Timeout**: Manejo de timeouts en subida de imágenes grandes