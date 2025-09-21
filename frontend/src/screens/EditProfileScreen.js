import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { COLORS } from '../styles/colors';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
  const [fullName, setFullName] = useState('');
  const [discipline, setDiscipline] = useState('');
  const [currentWeight, setCurrentWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (user) {
      setFullName(user.name || '');
    }
  };

  const handleSaveProfile = async () => {
    if (!user) {
      Alert.alert('Error', 'No hay usuario logueado');
      return;
    }

    if (!fullName || !discipline || !currentWeight || !targetWeight) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      // Por ahora solo simulamos guardar el perfil
      setTimeout(() => {
        Alert.alert('Éxito', 'Perfil guardado exitosamente');
        setLoading(false);
      }, 1000);

      // TODO: Conectar con backend para guardar en Supabase
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error inesperado');
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
      <Text style={styles.title}>Perfil del Peleador</Text>
      <Text style={styles.subtitle}>Configura tu perfil de peleador</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre completo"
        placeholderTextColor={COLORS.textSecondary}
        value={fullName}
        onChangeText={setFullName}
      />

      <TextInput
        style={styles.input}
        placeholder="Disciplina (MMA, Boxeo, etc.)"
        placeholderTextColor={COLORS.textSecondary}
        value={discipline}
        onChangeText={setDiscipline}
      />

      <TextInput
        style={styles.input}
        placeholder="Peso actual (kg)"
        placeholderTextColor={COLORS.textSecondary}
        value={currentWeight}
        onChangeText={setCurrentWeight}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Peso objetivo (kg)"
        placeholderTextColor={COLORS.textSecondary}
        value={targetWeight}
        onChangeText={setTargetWeight}
        keyboardType="numeric"
      />

      <TouchableOpacity
        style={[styles.saveButton, loading && styles.disabledButton]}
        onPress={handleSaveProfile}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.primary} />
        ) : (
          <Text style={styles.saveButtonText}>Guardar Perfil</Text>
        )}
      </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
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
  saveButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.6,
  },
});