# Inicio de Sesión


## Descripción General

La pantalla de inicio de sesión permite a los usuarios autenticarse en la aplicación NutriCombat utilizando sus credenciales registradas. Proporciona acceso al sistema mediante integración con AWS Cognito.
## Funcionalidades Principales
### Autenticación de Usuario
- 

Campo de entrada para correo electrónico
- 

Campo de entrada para contraseña (oculta con puntos)
- 

Validación de formato de credenciales
### Recordar Sesión
- 

Checkbox “Recordar sesión” que permite:
- 

Guardar credenciales localmente mediante AsyncStorage
- 

Carga automática de email y contraseña al abrir la aplicación
- 

Persistencia de sesión entre cierres de aplicación
### Recuperación de Contraseña
- 

Enlace “¿Olvidaste tu contraseña?” que dirige al flujo de recuperación
- 

Proceso de dos pasos:
1. 

Solicitud de código de verificación enviado por correo
1. 

Confirmación y establecimiento de nueva contraseña
### Registro de Nuevos Usuarios
- 

Enlace “No tienes cuenta? Regístrate aquí” que dirige a la pantalla de registro
## Flujo de Uso
1. 

**Ingreso de Credenciales**
- 

El usuario ingresa su correo electrónico registrado
- 

El usuario ingresa su contraseña
1. 

**Opciones de Sesión**
- 

Opcionalmente marca “Recordar sesión” para persistencia
1. 

**Autenticación**
- 

Al presionar “Entrar”, se validan las credenciales con AWS Cognito
- 

En caso de éxito, redirige al Dashboard principal
- 

En caso de error, muestra mensaje de credenciales inválidas
## Validaciones
- 

**Formato de Email**: Verifica que el correo tenga estructura válida
- 

**Campos Requeridos**: Ambos campos deben estar completos para habilitar el botón de entrada
- 

**Credenciales Válidas**: Valida contra AWS Cognito que las credenciales coincidan
## Tecnologías Utilizadas
- 

**Frontend**: React Native con Expo
- 

**Autenticación**: AWS Cognito
- 

**Almacenamiento Local**: AsyncStorage para persistencia de sesión
- 

**Backend**: Funciones Lambda en AWS para gestión de autenticación
## Manejo de Errores
- 

Credenciales incorrectas: Muestra alerta indicando email o contraseña inválidos
- 

Usuario no verificado: Redirige al flujo de verificación de email
- 

Errores de conexión: Muestra mensaje de error de red
## Seguridad
- 

Las contraseñas se transmiten de forma segura mediante HTTPS
- 

No se almacenan contraseñas en texto plano
- 

Uso de SECRET_HASH con HMAC-SHA256 para autenticación con Cognito
- 

Tokens de sesión manejados por AWS Cognito