# 🥊 NutriCombat

**Combate tus objetivos nutricionales con inteligencia y diseño**

NutriCombat es una aplicación móvil innovadora que gamifica la experiencia nutricional, convirtiendo el seguimiento de tu dieta en un desafío motivador. Con análisis inteligente de alimentos y recomendaciones personalizadas, ayuda a los usuarios a "combatir" sus malos hábitos alimenticios y alcanzar sus metas de salud.

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

- **Frontend**: React Native / Expo
- **Backend**: Node.js + Express
- **Base de Datos**: MongoDB
- **IA/ML**: TensorFlow.js para reconocimiento de imágenes
- **Autenticación**: Firebase Auth
- **Almacenamiento**: Firebase Storage
- **APIs**: Edamam Food Database, Nutritionix

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
- **[Tu equipo]** - Contributors

## 📞 Contacto

- Email: fabi.munozv@duocuc.cl
- LinkedIn: [tu-linkedin]
- Proyecto: [GitHub Repository]

---

**NutriCombat** - *Transforma tu nutrición en una aventura* 🚀
