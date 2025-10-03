import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchAndSaveUserId } from '../services/userService';

export default function ProfileLoadingScreen({ navigation }) {
  const { user, setUserIdInSession } = useAuth();

  useEffect(() => {
    checkAndLoadProfile();
  }, []);

  const checkAndLoadProfile = async () => {
    if (user && user.email) {
      try {
        const response = await fetch(
          'https://3f8q0vhfcf.execute-api.us-east-1.amazonaws.com/dev/profile?email=' + user.email
        );

        if (response.ok) {
          const data = await response.json();

          // Esperar al menos 1.5 segundos para que se vean los mensajes dinámicos
          await new Promise(resolve => setTimeout(resolve, 1500));

          if (data.data && data.data.length > 0) {
            const profile = data.data[0];

            // Intentar obtener user_id del perfil o mediante Edge Function
            let userId = profile.user_id;

            if (!userId) {
              console.warn('⚠️ user_id no encontrado en perfil, intentando con Edge Function...');
              // Intentar obtener user_id mediante Edge Function
              userId = await fetchAndSaveUserId(user.email, setUserIdInSession);
            } else {
              // Si ya existe en el perfil, guardarlo directamente
              await setUserIdInSession(userId);
              console.log('✅ User ID guardado en sesión:', userId);
            }

            // Toast de debugging
            if (userId) {
              Alert.alert(
                '🐛 Debug - User ID',
                `User ID obtenido y guardado:\n${userId}\n\nEmail: ${user.email}\n\nFuente: ${profile.user_id ? 'Perfil' : 'Edge Function'}`,
                [{ text: 'OK' }]
              );
            } else {
              Alert.alert(
                '⚠️ Debug - User ID',
                'No se pudo obtener el user_id\n\nVerifica:\n1. Tabla profiles tiene campo user_id\n2. Edge Function está desplegada\n3. Configuración en userService.js',
                [{ text: 'OK' }]
              );
            }

            // Verificar si el perfil está incompleto
            const isIncomplete = !profile.weight || !profile.height || !profile.age || !profile.name;

            if (isIncomplete) {
              // Perfil incompleto - ir a EditProfile con datos precargados
              navigation.replace('EditProfile', {
                isProfileIncomplete: true,
                preloadedProfile: profile
              });
            } else {
              // Perfil completo - ir a Main con datos precargados
              navigation.replace('Main', {
                preloadedProfile: profile
              });
            }
          } else {
            // No hay perfil - ir a EditProfile sin datos precargados
            navigation.replace('EditProfile', {
              isProfileIncomplete: true,
              preloadedProfile: null
            });
          }
        } else {
          // Error al cargar perfil - ir a Main de todos modos
          navigation.replace('Main');
        }
      } catch (error) {
        console.error('Error checking profile:', error);
        // En caso de error, ir a Main de todos modos
        navigation.replace('Main');
      }
    } else {
      // No hay usuario - regresar a login
      navigation.replace('Login');
    }
  };

  return (
    <LoadingSpinner
      useDynamicMessages={true}
      subtitle="Cargando información del peleador"
      messageInterval={2000}
    />
  );
}
