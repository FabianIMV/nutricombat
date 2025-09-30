import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../styles/colors';
import { authService } from '../services/auth';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberSession, setRememberSession] = useState(false);
  const { login } = useAuth();

  // Cargar credenciales guardadas al iniciar
  useEffect(() => {
    loadSavedCredentials();
  }, []);

  const loadSavedCredentials = async () => {
    try {
      const rememberSessionSaved = await AsyncStorage.getItem('rememberSession');
      const savedCredentials = await AsyncStorage.getItem('userCredentials');

      if (rememberSessionSaved === 'true' && savedCredentials) {
        const { email, password } = JSON.parse(savedCredentials);
        setEmail(email);
        setPassword(password);
        setRememberSession(true);
      }
    } catch (error) {
      console.log('Error loading saved credentials:', error);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await authService.login(email, password);

      if (error) {
        Alert.alert('Error de inicio', error.message);
      } else {
        // Guardar usuario en contexto
        await login(data.user, {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          idToken: data.idToken
        });

        // Guardar preferencia de recordar sesión
        if (rememberSession) {
          await AsyncStorage.setItem('rememberSession', 'true');
          await AsyncStorage.setItem('userCredentials', JSON.stringify({ email, password }));
        } else {
          await AsyncStorage.removeItem('rememberSession');
          await AsyncStorage.removeItem('userCredentials');
        }

        Alert.alert('Éxito', 'Inicio de sesión exitoso', [
          { text: 'OK', onPress: () => navigation.navigate('Main') }
        ]);
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NutriCombat</Text>
      <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo"
        placeholderTextColor={COLORS.textSecondary}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor={COLORS.textSecondary}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.rememberContainer}
        onPress={() => {
          const newValue = !rememberSession;
          setRememberSession(newValue);
          if (!newValue) {
            // Si se desmarca, limpiar credenciales guardadas
            AsyncStorage.removeItem('rememberSession');
            AsyncStorage.removeItem('userCredentials');
          }
        }}
      >
        <View style={[styles.checkbox, rememberSession && styles.checkboxActive]}>
          {rememberSession && <Text style={styles.checkmarkText}>✓</Text>}
        </View>
        <Text style={styles.rememberText}>Recordar sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.loginButton, loading && styles.disabledButton]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.primary} />
        ) : (
          <Text style={styles.loginButtonText}>Entrar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.forgotPasswordLink}
        onPress={() => navigation.navigate('ForgotPassword')}
      >
        <Text style={styles.forgotPasswordText}>Olvidaste tu contrasena?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.registerLink}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.registerLinkText}>
No tienes cuenta? Registrate aqui
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    backgroundColor: COLORS.accent,
    color: COLORS.text,
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPasswordLink: {
    marginTop: 15,
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: COLORS.secondary,
    fontSize: 14,
  },
  registerLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerLinkText: {
    color: COLORS.secondary,
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.6,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: COLORS.textSecondary,
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
  },
  rememberText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  checkmarkText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
});