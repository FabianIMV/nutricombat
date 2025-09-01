# 🥊 NutriCombat
![React Native](https://img.shields.io/badge/React%20Native-0.72+-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-18.0+-green.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)
![Contributors](https://img.shields.io/badge/contributors-2-orange.svg)

**Combate tus objetivos nutricionales con inteligencia y diseño**

NutriCombat es una aplicación móvil innovadora que gamifica la experiencia nutricional, convirtiendo el seguimiento de tu dieta en un desafío motivador. Con análisis inteligente de alimentos y recomendaciones personalizadas, ayuda a los usuarios a "combatir" sus malos hábitos alimenticios y alcanzar sus metas de salud.

## 📱 Mockups de la Aplicación

<div align="center">
<img width="827" height="291" alt="Captura de pantalla 2025-09-01 a la(s) 6 55 36 p m" src="https://github.com/user-attachments/assets/22823e56-bc3c-4880-b121-7d323f63bf9a" />

</div>

> **Nota**: Los mockups están disponibles como archivos SVG en la carpeta `/assets/mockups/` y pueden importarse directamente a Figma para prototipado.

### 🎨 Pantallas Principales

| Pantalla | Descripción | Funcionalidades Clave |
|----------|-------------|------------------------|
| 🏠 **Dashboard** | Vista principal con métricas diarias | Stats, macronutrientes, comidas recientes |
| 🔐 **Login** | Autenticación segura | Social login, recuperación de contraseña |
| 📸 **Scanner** | Reconocimiento IA de alimentos | Escaneo, búsqueda manual, historial |
| 🏆 **Logros** | Sistema de gamificación | Niveles, XP, achievements desbloqueables |
| 📊 **Analytics** | Análisis y progreso semanal | Gráficos, insights IA, recomendaciones |

## ✨ Características Principales

- **🎮 Gamificación Nutricional**: Sistema de puntos, niveles y logros
- **📸 Reconocimiento de Alimentos**: IA para identificar comidas por foto
- **📊 Dashboard Inteligente**: Análisis detallado de macros y micros
- **🎯 Objetivos Personalizados**: Planes adaptados a tu estilo de vida
- **👥 Comunidad**: Desafíos grupales y rankings
- **💡 Recomendaciones IA**: Sugerencias basadas en tus hábitos

## 🚀 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/nutricombat.git

# Instalar dependencias
cd nutricombat
npm install

# Configurar variables de entorno
cp .env.example .env

# Ejecutar en desarrollo
npm run dev
```

## 📱 Tecnologías

### Stack Principal
| Categoría | Tecnología | Versión | Descripción |
|-----------|------------|---------|-------------|
| **Frontend** | React Native + Expo | 0.72+ | Desarrollo móvil multiplataforma |
| **Backend** | Node.js + Express | 18.0+ | API REST y servicios |
| **Base de Datos** | MongoDB | 6.0+ | Base de datos NoSQL |
| **IA/ML** | TensorFlow.js | 4.0+ | Reconocimiento de imágenes |
| **Autenticación** | Firebase Auth | 9.0+ | Gestión de usuarios |
| **Storage** | Firebase Storage | 9.0+ | Almacenamiento de archivos |
| **APIs** | Edamam, Nutritionix | - | Datos nutricionales |

### Herramientas de Desarrollo
- **Testing**: Jest, Detox
- **Linting**: ESLint, Prettier
- **CI/CD**: GitHub Actions
- **Design**: Figma, SVG mockups
- **Analytics**: Firebase Analytics

## 🏗️ Arquitectura del Proyecto

```
nutricombat/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── common/
│   │   ├── forms/
│   │   └── charts/
│   ├── screens/            # Pantallas principales
│   │   ├── auth/
│   │   ├── home/
│   │   ├── nutrition/
│   │   └── profile/
│   ├── services/           # Lógica de negocio
│   │   ├── api/
│   │   ├── auth/
│   │   └── nutrition/
│   ├── utils/              # Utilidades y helpers
│   ├── hooks/              # Custom hooks
│   └── navigation/         # Configuración de navegación
├── assets/                 # Imágenes, iconos, fuentes
├── docs/                   # Documentación
└── tests/                  # Pruebas unitarias e integración
```

## 🎯 Funcionalidades Core

### Módulo de Seguimiento
- Registro rápido de alimentos
- Escaneo de códigos de barras
- Seguimiento de agua y suplementos

### Módulo de Gamificación  
- Sistema de XP y niveles
- Achievements desbloqueables
- Desafíos diarios y semanales

### Módulo Social
- Perfiles de usuario
- Feed de actividades
- Competencias entre amigos

### Módulo de Análisis
- Reportes semanales/mensuales
- Predicción de tendencias
- Alertas nutricionales

## 🔧 Scripts Disponibles

```bash
npm run dev          # Ejecutar en desarrollo
npm run build        # Build para producción
npm run test         # Ejecutar pruebas
npm run lint         # Linter de código
npm run android      # Ejecutar en Android
npm run ios          # Ejecutar en iOS
```

## 🚀 Roadmap

### v1.0 - MVP (Actual)
- [x] Registro de usuarios
- [x] Seguimiento básico de alimentos
- [x] Dashboard principal
- [ ] Sistema de gamificación

### v1.1 - Social Features
- [ ] Perfiles de usuario
- [ ] Sistema de amigos
- [ ] Desafíos grupales

### v2.0 - AI Enhancement
- [ ] Reconocimiento de alimentos por IA
- [ ] Recomendaciones personalizadas
- [ ] Predicción de hábitos

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Equipo

- **Fabian Munoz** - Lead Developer
- **Vicente Chacón** - Lead Developer
- 
---

**NutriCombat** - *Transforma tu nutrición en una aventura* 🚀
