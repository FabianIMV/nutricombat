import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Animated,
  Platform,
  Modal,
  FlatList
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { COLORS } from '../styles/colors';

export default function WeightCutCalculatorScreen({ navigation }) {
  const [formData, setFormData] = useState({
    currentWeightKg: '',
    targetWeightKg: '',
    daysToCut: '',
    experienceLevel: 'amateur',
    combatSport: 'boxeo',
    trainingSessionsPerWeek: '',
    trainingSessionsPerDay: '',
    model: 'gemini-2.5-flash'
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [spinValue] = useState(new Animated.Value(0));
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [showSportModal, setShowSportModal] = useState(false);
  const [showModelModal, setShowModelModal] = useState(false);

  useEffect(() => {
    if (isLoading) {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ).start();
    } else {
      spinValue.setValue(0);
    }
  }, [isLoading]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const validateForm = () => {
    const newErrors = {};
    const { currentWeightKg, targetWeightKg, daysToCut, trainingSessionsPerWeek, trainingSessionsPerDay } = formData;

    // Current Weight validation
    if (!currentWeightKg || parseFloat(currentWeightKg) < 30) {
      newErrors.currentWeightKg = 'El peso actual debe ser mínimo 30 kg';
    }

    // Target Weight validation
    if (!targetWeightKg || parseFloat(targetWeightKg) < 30) {
      newErrors.targetWeightKg = 'El peso objetivo debe ser mínimo 30 kg';
    } else if (parseFloat(targetWeightKg) >= parseFloat(currentWeightKg)) {
      newErrors.targetWeightKg = 'El peso objetivo debe ser menor al peso actual';
    }

    // Days to cut validation
    if (!daysToCut || parseInt(daysToCut) < 1) {
      newErrors.daysToCut = 'Los días de corte deben ser mínimo 1';
    }

    // Training sessions validation
    if (!trainingSessionsPerWeek || parseInt(trainingSessionsPerWeek) < 1 || parseInt(trainingSessionsPerWeek) > 7) {
      newErrors.trainingSessionsPerWeek = 'Entre 1 y 7 sesiones por semana';
    }

    if (!trainingSessionsPerDay || parseInt(trainingSessionsPerDay) < 1 || parseInt(trainingSessionsPerDay) > 3) {
      newErrors.trainingSessionsPerDay = 'Entre 1 y 3 sesiones por día';
    }

    setErrors(newErrors);
    const valid = Object.keys(newErrors).length === 0;
    setIsFormValid(valid);
    return valid;
  };

  useEffect(() => {
    validateForm();
  }, [formData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const experienceOptions = [
    { label: 'Principiante', value: 'principiante' },
    { label: 'Amateur', value: 'amateur' },
    { label: 'Profesional', value: 'profesional' }
  ];

  const sportOptions = [
    { label: 'Boxeo', value: 'boxeo' },
    { label: 'MMA', value: 'mma' },
    { label: 'Muay Thai', value: 'muay-thai' },
    { label: 'Judo', value: 'judo' },
    { label: 'BJJ', value: 'bjj' },
    { label: 'Kickboxing', value: 'kickboxing' }
  ];

  const modelOptions = [
    { label: 'Gemini 2.5 Flash (Rápido)', value: 'gemini-2.5-flash' },
    { label: 'Gemini 2.5 Pro (Detallado)', value: 'gemini-2.5-pro' }
  ];

  const IOSSelector = ({ options, selectedValue, onSelect, placeholder, modalVisible, setModalVisible }) => {
    const selectedOption = options.find(opt => opt.value === selectedValue);

    return (
      <>
        <TouchableOpacity
          style={styles.iosSelectorButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.iosSelectorText}>
            {selectedOption ? selectedOption.label : placeholder}
          </Text>
          <Text style={styles.iosSelectorArrow}>▼</Text>
        </TouchableOpacity>

        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Seleccionar opción</Text>
              <FlatList
                data={options}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.optionItem,
                      item.value === selectedValue && styles.selectedOption
                    ]}
                    onPress={() => {
                      onSelect(item.value);
                      setModalVisible(false);
                    }}
                  >
                    <Text style={[
                      styles.optionText,
                      item.value === selectedValue && styles.selectedOptionText
                    ]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </>
    );
  };

  const handleAnalyze = async () => {
    if (!validateForm()) {
      Alert.alert('Error', 'Por favor corrige los errores en el formulario');
      return;
    }

    setIsLoading(true);

    try {
      const requestBody = {
        currentWeightKg: parseFloat(formData.currentWeightKg),
        targetWeightKg: parseFloat(formData.targetWeightKg),
        daysToCut: parseInt(formData.daysToCut),
        experienceLevel: formData.experienceLevel,
        combatSport: formData.combatSport,
        trainingSessionsPerWeek: parseInt(formData.trainingSessionsPerWeek),
        trainingSessionsPerDay: parseInt(formData.trainingSessionsPerDay),
        model: formData.model
      };

      console.log('Sending request:', requestBody);

      const response = await fetch(
        'https://c5uudu6dzvn66jblbxrzne5nx40ljner.lambda-url.us-east-1.on.aws/api/v1/weight-cut/analyze',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorData}`);
      }

      const result = await response.json();
      console.log('API Response:', result);

      // Navigate to results screen
      navigation.navigate('WeightCutResults', {
        analysisResult: result,
        formData: formData
      });

    } catch (error) {
      console.error('Error analyzing weight cut:', error);
      Alert.alert(
        'Error de análisis',
        error.message.includes('400') ?
          'Datos inválidos. Verifica que el peso objetivo sea menor al actual.' :
          'No se pudo analizar el plan de corte. Intenta nuevamente.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Animated.View style={[styles.loader, { transform: [{ rotate: spin }] }]}>
          <ActivityIndicator size="large" color={COLORS.secondary} />
        </Animated.View>
        <Text style={styles.loadingText}>Analizando datos con IA...</Text>
        <Text style={styles.loadingSubtext}>Generando plan personalizado de corte de peso</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Calculadora de Corte de Peso</Text>
        <Text style={styles.subtitle}>Genera un plan personalizado con IA</Text>

        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Básica</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Peso Actual (kg) *</Text>
            <TextInput
              style={[styles.input, errors.currentWeightKg && styles.inputError]}
              placeholder="Ej: 70"
              placeholderTextColor={COLORS.textSecondary}
              value={formData.currentWeightKg}
              onChangeText={(value) => handleInputChange('currentWeightKg', value)}
              keyboardType="numeric"
            />
            {errors.currentWeightKg && <Text style={styles.errorText}>{errors.currentWeightKg}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Peso Objetivo (kg) *</Text>
            <TextInput
              style={[styles.input, errors.targetWeightKg && styles.inputError]}
              placeholder="Ej: 66"
              placeholderTextColor={COLORS.textSecondary}
              value={formData.targetWeightKg}
              onChangeText={(value) => handleInputChange('targetWeightKg', value)}
              keyboardType="numeric"
            />
            {errors.targetWeightKg && <Text style={styles.errorText}>{errors.targetWeightKg}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Días para el Corte *</Text>
            <TextInput
              style={[styles.input, errors.daysToCut && styles.inputError]}
              placeholder="Ej: 7"
              placeholderTextColor={COLORS.textSecondary}
              value={formData.daysToCut}
              onChangeText={(value) => handleInputChange('daysToCut', value)}
              keyboardType="numeric"
            />
            {errors.daysToCut && <Text style={styles.errorText}>{errors.daysToCut}</Text>}
          </View>
        </View>

        {/* Sport Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Deportiva</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nivel de Experiencia *</Text>
            {Platform.OS === 'ios' ? (
              <IOSSelector
                options={experienceOptions}
                selectedValue={formData.experienceLevel}
                onSelect={(value) => handleInputChange('experienceLevel', value)}
                placeholder="Seleccionar nivel"
                modalVisible={showExperienceModal}
                setModalVisible={setShowExperienceModal}
              />
            ) : (
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.experienceLevel}
                  style={styles.picker}
                  onValueChange={(value) => handleInputChange('experienceLevel', value)}
                  dropdownIconColor={COLORS.secondary}
                >
                  <Picker.Item label="Principiante" value="principiante" />
                  <Picker.Item label="Amateur" value="amateur" />
                  <Picker.Item label="Profesional" value="profesional" />
                </Picker>
              </View>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Deporte de Combate *</Text>
            {Platform.OS === 'ios' ? (
              <IOSSelector
                options={sportOptions}
                selectedValue={formData.combatSport}
                onSelect={(value) => handleInputChange('combatSport', value)}
                placeholder="Seleccionar deporte"
                modalVisible={showSportModal}
                setModalVisible={setShowSportModal}
              />
            ) : (
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.combatSport}
                  style={styles.picker}
                  onValueChange={(value) => handleInputChange('combatSport', value)}
                  dropdownIconColor={COLORS.secondary}
                >
                  <Picker.Item label="Boxeo" value="boxeo" />
                  <Picker.Item label="MMA" value="mma" />
                  <Picker.Item label="Muay Thai" value="muay-thai" />
                  <Picker.Item label="Judo" value="judo" />
                  <Picker.Item label="BJJ" value="bjj" />
                  <Picker.Item label="Kickboxing" value="kickboxing" />
                </Picker>
              </View>
            )}
          </View>
        </View>

        {/* Training Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Entrenamiento</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Sesiones por Semana (1-7) *</Text>
            <TextInput
              style={[styles.input, errors.trainingSessionsPerWeek && styles.inputError]}
              placeholder="Ej: 5"
              placeholderTextColor={COLORS.textSecondary}
              value={formData.trainingSessionsPerWeek}
              onChangeText={(value) => handleInputChange('trainingSessionsPerWeek', value)}
              keyboardType="numeric"
            />
            {errors.trainingSessionsPerWeek && <Text style={styles.errorText}>{errors.trainingSessionsPerWeek}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Sesiones por Día (1-3) *</Text>
            <TextInput
              style={[styles.input, errors.trainingSessionsPerDay && styles.inputError]}
              placeholder="Ej: 1"
              placeholderTextColor={COLORS.textSecondary}
              value={formData.trainingSessionsPerDay}
              onChangeText={(value) => handleInputChange('trainingSessionsPerDay', value)}
              keyboardType="numeric"
            />
            {errors.trainingSessionsPerDay && <Text style={styles.errorText}>{errors.trainingSessionsPerDay}</Text>}
          </View>
        </View>

        {/* Advanced Configuration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configuración Avanzada</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Modelo de IA</Text>
            {Platform.OS === 'ios' ? (
              <IOSSelector
                options={modelOptions}
                selectedValue={formData.model}
                onSelect={(value) => handleInputChange('model', value)}
                placeholder="Seleccionar modelo"
                modalVisible={showModelModal}
                setModalVisible={setShowModelModal}
              />
            ) : (
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.model}
                  style={styles.picker}
                  onValueChange={(value) => handleInputChange('model', value)}
                  dropdownIconColor={COLORS.secondary}
                >
                  <Picker.Item label="Gemini 2.5 Flash (Rápido)" value="gemini-2.5-flash" />
                  <Picker.Item label="Gemini 2.5 Pro (Detallado)" value="gemini-2.5-pro" />
                </Picker>
              </View>
            )}
          </View>
        </View>

        <Text style={styles.requiredNote}>* Campos obligatorios</Text>

        <TouchableOpacity
          style={[styles.analyzeButton, !isFormValid && styles.disabledButton]}
          onPress={handleAnalyze}
          disabled={!isFormValid}
        >
          <Text style={styles.analyzeButtonText}>Analizar Corte de Peso</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          Este análisis no reemplaza la supervisión médica profesional.
          Consulta con profesionales de la salud antes de iniciar cualquier plan de corte de peso.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
  },
  section: {
    marginBottom: 25,
    backgroundColor: COLORS.accent,
    borderRadius: 15,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.primary,
    color: COLORS.text,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: COLORS.error,
    borderWidth: 2,
  },
  pickerContainer: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  picker: {
    color: COLORS.text,
    height: 50,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    marginTop: 4,
  },
  requiredNote: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  analyzeButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: 15,
    padding: 18,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  analyzeButtonText: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: COLORS.textSecondary,
    opacity: 0.6,
  },
  disclaimer: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loader: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loadingText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  loadingSubtext: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
  // iOS-specific selector styles
  iosSelectorButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 50,
  },
  iosSelectorText: {
    color: COLORS.text,
    fontSize: 16,
    flex: 1,
  },
  iosSelectorArrow: {
    color: COLORS.secondary,
    fontSize: 12,
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.accent,
    borderRadius: 15,
    padding: 20,
    width: '100%',
    maxWidth: 300,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  optionItem: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 5,
    backgroundColor: COLORS.primary,
  },
  selectedOption: {
    backgroundColor: COLORS.secondary,
  },
  optionText: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
  },
  selectedOptionText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 15,
    padding: 15,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: '500',
  },
});