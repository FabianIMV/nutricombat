import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { COLORS } from '../styles/colors';
import { authService } from '../services/auth';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

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
        style={styles.registerLink}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.registerLinkText}>
¿No tienes cuenta? Regístrate aquí
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
});