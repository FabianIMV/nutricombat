import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useUser } from '../context/UserContext';
import { COLORS } from '../constants/colors';
import { STRINGS } from '../constants/strings';
import Button from '../components/Button';
import Input from '../components/Input';
import AuthService from '../services/authService';

export default function LoginScreen({ navigation }) {
  const { login } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      alert('Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    
    try {
      const result = await AuthService.login(email, password);
      
      if (result.success) {
        console.log('Login successful, setting user data:', result.user);
        await login(result.user);
        setLoading(false);
      } else {
        alert(result.error || 'Error de autenticación');
        setLoading(false);
      }
    } catch (error) {
      alert('Error de conexión. Verifica tu internet.');
      setLoading(false);
    }
  };

  const handleCreateAccount = () => {
    navigation.navigate('Register');
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
            {/* Logo Section */}
            <View style={styles.logoSection}>
              <View style={styles.logoPlaceholder}>
                <Text style={styles.logoText}>🥊</Text>
              </View>
              <Text style={styles.appName}>{STRINGS.app_name}</Text>
              <Text style={styles.tagline}>Corte de Peso Profesional</Text>
            </View>

            {/* Form Section */}
            <View style={styles.formSection}>
              <Input
                label={STRINGS.login.email}
                value={email}
                onChangeText={setEmail}
                placeholder="ejemplo@email.com"
                keyboardType="email-address"
                style={styles.input}
              />

              <Input
                label={STRINGS.login.password}
                value={password}
                onChangeText={setPassword}
                placeholder="Contraseña"
                secureTextEntry
                style={styles.input}
              />

              <Button
                title={STRINGS.login.login_button}
                onPress={handleLogin}
                disabled={loading}
                style={styles.loginButton}
              />
            </View>

            {/* Create Account Section */}
            <View style={styles.createAccountSection}>
              <Text style={styles.createAccountText}>¿Eres nuevo?</Text>
              <TouchableOpacity onPress={handleCreateAccount}>
                <Text style={styles.createAccountLink}>
                  Crear Cuenta
                </Text>
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
  logoSection: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 40,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: COLORS.primary,
    textAlign: 'center',
  },
  formSection: {
    marginBottom: 40,
  },
  input: {
    marginBottom: 16,
  },
  loginButton: {
    marginTop: 20,
  },
  createAccountSection: {
    alignItems: 'center',
  },
  createAccountText: {
    color: COLORS.white,
    fontSize: 16,
    marginBottom: 8,
  },
  createAccountLink: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});