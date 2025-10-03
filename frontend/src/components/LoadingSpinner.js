import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { COLORS } from '../styles/colors';

// Pool de mensajes dinámicos con temática de deportes de contacto
const COMBAT_MESSAGES = [
  'Calentando...',
  'Golpeando Thai pads...',
  'Haciendo sombra...',
  'Ajustando vendas...',
  'Preparando tu esquina...',
  'Revisando tu guardia...',
  'Perfeccionando técnica...',
  'Entrenando cardio...',
  'Trabajando el clinch...',
  'Practicando combinaciones...',
  'Fortaleciendo core...',
  'Mejorando footwork...',
  'Puliendo defensa...',
  'Afilando reflejos...',
  'Calibrando potencia...',
];

/**
 * Componente de animación de carga reutilizable
 * @param {Object} props
 * @param {string} props.message - Mensaje a mostrar debajo del spinner (opcional)
 * @param {string} props.subtitle - Subtítulo adicional (opcional)
 * @param {boolean} props.showTitle - Mostrar el título "NutriCombat" (default: true)
 * @param {boolean} props.useDynamicMessages - Usar mensajes dinámicos del pool (default: false)
 * @param {number} props.messageInterval - Intervalo de cambio de mensajes en ms (default: 2000)
 * @param {number} props.size - Tamaño del spinner: 'small' (80), 'medium' (120), 'large' (160) (default: 'medium')
 */
export default function LoadingSpinner({
  message = '',
  subtitle = '',
  showTitle = true,
  useDynamicMessages = false,
  messageInterval = 2000,
  size = 'medium'
}) {
  const spinValue = useRef(new Animated.Value(0)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(0.8)).current;
  const messageFade = useRef(new Animated.Value(1)).current;

  const [currentMessage, setCurrentMessage] = useState(
    useDynamicMessages ? COMBAT_MESSAGES[0] : message
  );
  const [messageIndex, setMessageIndex] = useState(0);

  // Configuración de tamaños
  const sizeConfig = {
    small: { outer: 80, inner: 60, center: 20, fontSize: 14 },
    medium: { outer: 120, inner: 100, center: 30, fontSize: 16 },
    large: { outer: 160, inner: 140, center: 40, fontSize: 18 },
  };

  const config = sizeConfig[size] || sizeConfig.medium;

  useEffect(() => {
    // Animación de rotación continua
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Animación de fade in
    Animated.timing(fadeValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Animación de escala
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  // Efecto para mensajes dinámicos
  useEffect(() => {
    if (useDynamicMessages) {
      const interval = setInterval(() => {
        // Fade out
        Animated.timing(messageFade, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          // Cambiar mensaje
          setMessageIndex((prevIndex) => {
            const newIndex = (prevIndex + 1) % COMBAT_MESSAGES.length;
            setCurrentMessage(COMBAT_MESSAGES[newIndex]);
            return newIndex;
          });

          // Fade in
          Animated.timing(messageFade, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }).start();
        });
      }, messageInterval);

      return () => clearInterval(interval);
    }
  }, [useDynamicMessages, messageInterval]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeValue,
            transform: [{ scale: scaleValue }],
          },
        ]}
      >
        {/* Círculo exterior giratorio */}
        <Animated.View
          style={[
            styles.spinnerOuter,
            {
              width: config.outer,
              height: config.outer,
              transform: [{ rotate: spin }],
            },
          ]}
        >
          <View
            style={[
              styles.spinnerSegment1,
              {
                width: config.outer,
                height: config.outer,
                borderRadius: config.outer / 2,
              },
            ]}
          />
          <View
            style={[
              styles.spinnerSegment2,
              {
                width: config.inner,
                height: config.inner,
                borderRadius: config.inner / 2,
              },
            ]}
          />
        </Animated.View>

        {/* Círculo interior */}
        <View
          style={[
            styles.spinnerInner,
            {
              width: config.center,
              height: config.center,
              borderRadius: config.center / 2,
              top: (config.outer - config.center) / 2,
            },
          ]}
        />

        {showTitle && <Text style={styles.title}>NutriCombat</Text>}

        {(message || useDynamicMessages) && (
          <Animated.Text
            style={[
              styles.loadingText,
              {
                fontSize: config.fontSize,
                opacity: useDynamicMessages ? messageFade : 1
              }
            ]}
          >
            {useDynamicMessages ? currentMessage : message}
          </Animated.Text>
        )}

        {subtitle && (
          <Text style={[styles.subtitle, { fontSize: config.fontSize - 2 }]}>
            {subtitle}
          </Text>
        )}

        {/* Puntos animados */}
        {(message || useDynamicMessages) && (
          <View style={styles.dotsContainer}>
            <Animated.View
              style={[
                styles.dot,
                {
                  opacity: fadeValue,
                },
              ]}
            />
            <Animated.View
              style={[
                styles.dot,
                {
                  opacity: fadeValue,
                },
              ]}
            />
            <Animated.View
              style={[
                styles.dot,
                {
                  opacity: fadeValue,
                },
              ]}
            />
          </View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  spinnerOuter: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  spinnerSegment1: {
    position: 'absolute',
    borderWidth: 6,
    borderColor: 'transparent',
    borderTopColor: COLORS.secondary,
    borderRightColor: COLORS.secondary,
  },
  spinnerSegment2: {
    position: 'absolute',
    borderWidth: 6,
    borderColor: 'transparent',
    borderBottomColor: COLORS.secondary + '80',
    borderLeftColor: COLORS.secondary + '80',
  },
  spinnerInner: {
    position: 'absolute',
    backgroundColor: COLORS.secondary,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 20,
    marginBottom: 10,
  },
  loadingText: {
    color: COLORS.textSecondary,
    marginBottom: 10,
    fontWeight: '500',
  },
  subtitle: {
    color: COLORS.textSecondary + 'CC',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.secondary,
    marginHorizontal: 4,
  },
});
