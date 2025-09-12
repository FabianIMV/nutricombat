import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useUser } from '../context/UserContext';
import { COLORS } from '../constants/colors';
import { STRINGS } from '../constants/strings';
import Button from '../components/Button';
import Input from '../components/Input';
import AuthService from '../services/authService';

export default function RegisterScreen({ navigation }) {
  const { login } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu email');
      return false;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Por favor ingresa un email válido');
      return false;
    }

    if (!password.trim()) {
      Alert.alert('Error', 'Por favor ingresa una contraseña');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = await AuthService.register(email.trim().toLowerCase(), password);
      
      if (result.success) {
        // Auto-login after successful registration with actual user data
        console.log('Registration successful, auto-logging in with user:', result.user);
        await login(result.user);
        
        Alert.alert(
          'Registro Exitoso',
          'Tu cuenta ha sido creada. Ahora completa tu perfil de peleador.',
          [
            {
              text: 'Continuar',
              onPress: () => {
                // Navigate to profile screen
                navigation.navigate('Perfil');
              }
            }
          ]
        );
      } else {
        Alert.alert('Error de Registro', result.error || 'No se pudo crear la cuenta');
      }
    } catch (error) {
      Alert.alert('Error', 'Error de conexión. Verifica tu internet.');
    }

    setLoading(false);
  };

  const handleBackToLogin = () => {
    navigation.goBack();
  };

  return (
    <LinearGradient
      colors={[COLORS.background, COLORS.secondary]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardContainer}
        >
          <View style={styles.content}>
            {/* Header Section */}
            <View style={styles.headerSection}>
              <View style={styles.logoPlaceholder}>
                <Text style={styles.logoText}>🥊</Text>
              </View>
              <Text style={styles.title}>Crear Cuenta</Text>
              <Text style={styles.subtitle}>Únete a {STRINGS.app_name}</Text>
            </View>

            {/* Form Section */}
            <View style={styles.formSection}>
              <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="ejemplo@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />

              <Input
                label="Contraseña"
                value={password}
                onChangeText={setPassword}
                placeholder="Mínimo 6 caracteres"
                secureTextEntry
                style={styles.input}
              />

              <Input
                label="Confirmar Contraseña"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Repite tu contraseña"
                secureTextEntry
                style={styles.input}
              />

              <Button
                title="Crear Cuenta"
                onPress={handleRegister}
                disabled={loading}
                style={styles.registerButton}
              />
            </View>

            {/* Back to Login Section */}
            <View style={styles.loginSection}>
              <Text style={styles.loginText}>¿Ya tienes cuenta?</Text>
              <TouchableOpacity onPress={handleBackToLogin}>
                <Text style={styles.loginLink}>Inicia Sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.primary,
    textAlign: 'center',
  },
  formSection: {
    marginBottom: 30,
  },
  input: {
    marginBottom: 16,
  },
  registerButton: {
    marginTop: 20,
  },
  loginSection: {
    alignItems: 'center',
  },
  loginText: {
    color: COLORS.white,
    fontSize: 16,
    marginBottom: 8,
  },
  loginLink: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});