import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useUser } from '../context/UserContext';
import { COLORS } from '../constants/colors';
import { STRINGS } from '../constants/strings';
import { weightCutCalculations } from '../utils/calculations';
import Button from '../components/Button';
import Input from '../components/Input';
import Picker from '../components/Picker';
import Card from '../components/Card';
import ProfileService from '../services/profileService';

export default function PerfilScreen({ navigation }) {
  const { user, saveUserProfile, isLoggedIn } = useUser();
  
  const [formData, setFormData] = useState({
    nombre: '',
    disciplina: '',
    pesoActual: '',
    pesoObjetivo: '',
    fechaCompetencia: '',
    experiencia: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || '',
        disciplina: user.disciplina || '',
        pesoActual: user.pesoActual?.toString() || '',
        pesoObjetivo: user.pesoObjetivo?.toString() || '',
        fechaCompetencia: user.fechaCompetencia || '',
        experiencia: user.experiencia || '',
      });
    }
  }, [user]);

  const disciplineOptions = STRINGS.profile.disciplines.map(discipline => ({
    label: discipline,
    value: discipline,
  }));

  const experienceOptions = STRINGS.profile.experiences.map(experience => ({
    label: experience,
    value: experience,
  }));

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.disciplina) {
      newErrors.disciplina = 'Selecciona una disciplina';
    }

    if (!formData.pesoActual || isNaN(parseFloat(formData.pesoActual))) {
      newErrors.pesoActual = 'Ingresa un peso válido';
    } else {
      const peso = parseFloat(formData.pesoActual);
      if (peso < 40 || peso > 200) {
        newErrors.pesoActual = 'Peso debe estar entre 40 y 200 kg';
      }
    }

    if (!formData.pesoObjetivo || isNaN(parseFloat(formData.pesoObjetivo))) {
      newErrors.pesoObjetivo = 'Ingresa un peso objetivo válido';
    } else {
      const pesoObjetivo = parseFloat(formData.pesoObjetivo);
      const pesoActual = parseFloat(formData.pesoActual);
      
      if (pesoObjetivo < 40 || pesoObjetivo > 200) {
        newErrors.pesoObjetivo = 'Peso objetivo debe estar entre 40 y 200 kg';
      } else if (pesoObjetivo >= pesoActual) {
        newErrors.pesoObjetivo = 'El peso objetivo debe ser menor al actual';
      } else if (!weightCutCalculations.isSafeCut(pesoActual, pesoObjetivo)) {
        newErrors.pesoObjetivo = 'Corte de peso excede el límite seguro del 8%';
      }
    }

    if (!formData.fechaCompetencia) {
      newErrors.fechaCompetencia = 'Ingresa la fecha de competencia';
    } else {
      const today = new Date();
      const competitionDate = new Date(formData.fechaCompetencia);
      if (competitionDate <= today) {
        newErrors.fechaCompetencia = 'La fecha debe ser futura';
      }
    }

    if (!formData.experiencia) {
      newErrors.experiencia = 'Selecciona tu nivel de experiencia';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const profileData = {
      nombre: formData.nombre.trim(),
      disciplina: formData.disciplina,
      pesoActual: parseFloat(formData.pesoActual),
      pesoObjetivo: parseFloat(formData.pesoObjetivo),
      fechaCompetencia: formData.fechaCompetencia,
      experiencia: formData.experiencia,
      fechaCreacion: user?.fechaCreacion || new Date().toISOString(),
    };

    // Try backend first, fallback to local storage
    let result = await ProfileService.createProfile(profileData);
    
    if (!result.success) {
      // Fallback to local storage
      const success = await saveUserProfile(profileData);
      result = { success };
    } else {
      // Also save to local storage for offline access
      await saveUserProfile(profileData);
    }
    
    if (result.success) {
      Alert.alert(
        'Perfil Guardado',
        'Tu perfil de peleador ha sido guardado exitosamente.',
        [{ text: 'OK', onPress: () => {
          if (!isLoggedIn) {
            // If coming from registration, this will trigger login
          }
        }}]
      );
    } else {
      Alert.alert(
        'Error',
        result.error || 'No se pudo guardar el perfil. Intenta nuevamente.',
        [{ text: 'OK' }]
      );
    }

    setLoading(false);
  };

  const calculateDaysRemaining = () => {
    if (!formData.fechaCompetencia) return null;
    return weightCutCalculations.getDaysRemaining(formData.fechaCompetencia);
  };

  const daysRemaining = calculateDaysRemaining();

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
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Card style={styles.card}>
              <Text style={styles.title}>{STRINGS.profile.title}</Text>

              <Input
                label={STRINGS.profile.name}
                value={formData.nombre}
                onChangeText={(text) => setFormData(prev => ({ ...prev, nombre: text }))}
                placeholder="Nombre completo"
                error={errors.nombre}
              />

              <Picker
                label={STRINGS.profile.discipline}
                value={formData.disciplina}
                items={disciplineOptions}
                onSelect={(value) => setFormData(prev => ({ ...prev, disciplina: value }))}
                placeholder="Selecciona tu disciplina"
              />
              {errors.disciplina && (
                <Text style={styles.errorText}>{errors.disciplina}</Text>
              )}

              <Input
                label={STRINGS.profile.current_weight}
                value={formData.pesoActual}
                onChangeText={(text) => setFormData(prev => ({ ...prev, pesoActual: text }))}
                placeholder="75.5"
                keyboardType="numeric"
                error={errors.pesoActual}
              />

              <Input
                label={STRINGS.profile.target_weight}
                value={formData.pesoObjetivo}
                onChangeText={(text) => setFormData(prev => ({ ...prev, pesoObjetivo: text }))}
                placeholder="70.0"
                keyboardType="numeric"
                error={errors.pesoObjetivo}
              />

              <Input
                label={STRINGS.profile.competition_date}
                value={formData.fechaCompetencia}
                onChangeText={(text) => setFormData(prev => ({ ...prev, fechaCompetencia: text }))}
                placeholder="2025-12-15"
                error={errors.fechaCompetencia}
              />

              <Picker
                label={STRINGS.profile.experience}
                value={formData.experiencia}
                items={experienceOptions}
                onSelect={(value) => setFormData(prev => ({ ...prev, experiencia: value }))}
                placeholder="Selecciona tu experiencia"
              />
              {errors.experiencia && (
                <Text style={styles.errorText}>{errors.experiencia}</Text>
              )}

              {daysRemaining !== null && (
                <View style={styles.daysContainer}>
                  <Text style={styles.daysText}>
                    {daysRemaining} {STRINGS.dashboard.days_remaining}
                  </Text>
                </View>
              )}

              <Button
                title={STRINGS.profile.save}
                onPress={handleSave}
                disabled={loading}
                style={styles.saveButton}
              />
            </Card>
          </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  card: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.secondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  errorText: {
    color: COLORS.alert,
    fontSize: 14,
    marginTop: -5,
    marginBottom: 10,
    marginLeft: 5,
  },
  daysContainer: {
    backgroundColor: COLORS.primary + '20',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
  },
  daysText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  saveButton: {
    marginTop: 20,
  },
});