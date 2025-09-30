import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { COLORS } from '../styles/colors';
import { authService } from '../services/auth';

export default function ForgotPasswordScreen({ navigation }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    if (!email) {
      Alert.alert('Error', 'Ingresa tu correo electronico');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await authService.forgotPassword(email);

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Exito', 'Codigo de recuperacion enviado a tu correo');
        setStep(2);
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrio un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!code || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Las contrasenas no coinciden');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('Error', 'La contrasena debe tener al menos 8 caracteres');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await authService.confirmForgotPassword(email, code, newPassword);

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Exito', 'Contrasena restablecida correctamente', [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]);
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrio un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar Contrasena</Text>

      {step === 1 ? (
        <>
          <Text style={styles.subtitle}>
            Ingresa tu correo electronico y te enviaremos un codigo de recuperacion
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Correo electronico"
            placeholderTextColor={COLORS.textSecondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.disabledButton]}
            onPress={handleSendCode}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.primary} />
            ) : (
              <Text style={styles.buttonText}>Enviar Codigo</Text>
            )}
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.subtitle}>
            Ingresa el codigo que recibiste en tu correo y tu nueva contrasena
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Codigo de verificacion"
            placeholderTextColor={COLORS.textSecondary}
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
          />

          <TextInput
            style={styles.input}
            placeholder="Nueva contrasena"
            placeholderTextColor={COLORS.textSecondary}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />

          <TextInput
            style={styles.input}
            placeholder="Confirmar contrasena"
            placeholderTextColor={COLORS.textSecondary}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.disabledButton]}
            onPress={handleResetPassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.primary} />
            ) : (
              <Text style={styles.buttonText}>Restablecer Contrasena</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resendButton}
            onPress={handleSendCode}
            disabled={loading}
          >
            <Text style={styles.resendText}>Reenviar codigo</Text>
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity
        style={styles.backLink}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.backLinkText}>Volver al inicio de sesion</Text>
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
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
  },
  input: {
    backgroundColor: COLORS.accent,
    color: COLORS.text,
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: COLORS.secondary,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.6,
  },
  resendButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  resendText: {
    color: COLORS.secondary,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  backLink: {
    marginTop: 30,
    alignItems: 'center',
  },
  backLinkText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
});
