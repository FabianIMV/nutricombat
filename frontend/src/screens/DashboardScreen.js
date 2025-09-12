import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { useUser } from '../context/UserContext';
import { COLORS } from '../constants/colors';
import { STRINGS } from '../constants/strings';
import { weightCutCalculations } from '../utils/calculations';
import Card from '../components/Card';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import Input from '../components/Input';

export default function DashboardScreen({ navigation }) {
  const { 
    user, 
    weightHistory, 
    todayWaterIntake, 
    addWeightEntry, 
    addWaterIntake,
    loadUserData 
  } = useUser();

  const [refreshing, setRefreshing] = useState(false);
  const [showWeightInput, setShowWeightInput] = useState(false);
  const [showWaterInput, setShowWaterInput] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [waterAmount, setWaterAmount] = useState('');

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await loadUserData();
    setRefreshing(false);
  }, []);

  if (!user || !user.pesoActual || !user.pesoObjetivo || !user.fechaCompetencia) {
    return (
      <LinearGradient
        colors={[COLORS.background, COLORS.secondary]}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.centered}>
            <Text style={styles.errorText}>
              {!user ? 'Inicia sesión para ver el dashboard' : 'Completa tu perfil para ver el dashboard'}
            </Text>
            {user && (
              <Button
                title="Ir al Perfil"
                onPress={() => navigation.navigate('Perfil')}
                style={{ marginTop: 20 }}
              />
            )}
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const daysRemaining = weightCutCalculations.getDaysRemaining(user.fechaCompetencia);
  const currentPhase = weightCutCalculations.getCurrentPhase(daysRemaining);
  const cutPlan = weightCutCalculations.calculateCutPlan(
    user.pesoActual, 
    user.pesoObjetivo, 
    daysRemaining
  );

  const currentWeight = weightHistory.length > 0 
    ? weightHistory[weightHistory.length - 1].weight 
    : user.pesoActual;

  const weightProgress = Math.max(0, Math.min(1, 
    (user.pesoActual - currentWeight) / (user.pesoActual - user.pesoObjetivo)
  ));

  const recommendedWater = weightCutCalculations.getWaterRecommendation(
    currentPhase, 
    currentWeight
  );

  const waterProgress = Math.min(1, todayWaterIntake / recommendedWater);

  const getPhaseDisplay = (phase) => {
    switch (phase) {
      case 'preparation':
        return STRINGS.dashboard.phases.preparation;
      case 'intensive':
        return STRINGS.dashboard.phases.intensive;
      case 'weigh_in':
        return STRINGS.dashboard.phases.weigh_in;
      default:
        return STRINGS.dashboard.phases.preparation;
    }
  };

  const getPhaseColor = (phase) => {
    switch (phase) {
      case 'preparation':
        return COLORS.success;
      case 'intensive':
        return '#FFA500'; // Orange
      case 'weigh_in':
        return COLORS.alert;
      default:
        return COLORS.success;
    }
  };

  const handleAddWeight = async () => {
    if (!newWeight || isNaN(parseFloat(newWeight))) {
      Alert.alert('Error', 'Ingresa un peso válido');
      return;
    }

    const weight = parseFloat(newWeight);
    const success = await addWeightEntry(weight);
    
    if (success) {
      setNewWeight('');
      setShowWeightInput(false);
      Alert.alert('Éxito', 'Peso registrado correctamente');
    } else {
      Alert.alert('Error', 'No se pudo registrar el peso');
    }
  };

  const handleAddWater = async () => {
    if (!waterAmount || isNaN(parseFloat(waterAmount))) {
      Alert.alert('Error', 'Ingresa una cantidad válida');
      return;
    }

    const amount = parseFloat(waterAmount);
    const success = await addWaterIntake(amount);
    
    if (success) {
      setWaterAmount('');
      setShowWaterInput(false);
    } else {
      Alert.alert('Error', 'No se pudo registrar el agua');
    }
  };

  const handleQuickWater = async (amount) => {
    await addWaterIntake(amount);
  };

  const checkForAlerts = useCallback(() => {
    // Ensure all required values are available
    if (typeof daysRemaining !== 'number' || typeof weightProgress !== 'number' || typeof waterProgress !== 'number') {
      return;
    }

    const alerts = [];
    
    if (daysRemaining <= 1 && weightProgress < 0.8) {
      alerts.push('Corte de peso atrasado - considera buscar asistencia profesional');
    }
    
    if (waterProgress < 0.3 && currentPhase !== 'weigh_in') {
      alerts.push('Hidratación insuficiente para la fase actual');
    }
    
    if (alerts.length > 0 && navigation?.navigate) {
      navigation.navigate('Alertas');
    }
  }, [daysRemaining, weightProgress, waterProgress, currentPhase, navigation]);

  useEffect(() => {
    // Only check for alerts if we have a valid user profile
    if (user && daysRemaining !== null) {
      checkForAlerts();
    }
  }, [checkForAlerts, user, daysRemaining]);

  return (
    <LinearGradient
      colors={[COLORS.background, COLORS.secondary]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.welcomeText}>¡Hola, {user.nombre}!</Text>
            <Text style={styles.disciplineText}>{user.disciplina}</Text>
          </View>

          {/* Countdown Card */}
          <Card style={styles.countdownCard}>
            <View style={styles.countdownContent}>
              <Text style={styles.countdownNumber}>{daysRemaining}</Text>
              <Text style={styles.countdownText}>
                {STRINGS.dashboard.days_remaining}
              </Text>
            </View>
          </Card>

          {/* Current Phase */}
          <Card>
            <View style={styles.phaseHeader}>
              <Text style={styles.sectionTitle}>
                {STRINGS.dashboard.current_phase}
              </Text>
              <View style={[
                styles.phaseIndicator,
                { backgroundColor: getPhaseColor(currentPhase) }
              ]}>
                <Text style={styles.phaseText}>
                  {getPhaseDisplay(currentPhase)}
                </Text>
              </View>
            </View>
          </Card>

          {/* Weight Progress */}
          <Card>
            <Text style={styles.sectionTitle}>
              {STRINGS.dashboard.weight_progress}
            </Text>
            <View style={styles.weightInfo}>
              <View style={styles.weightRow}>
                <Text style={styles.weightLabel}>Actual:</Text>
                <Text style={styles.weightValue}>{currentWeight.toFixed(1)} kg</Text>
              </View>
              <View style={styles.weightRow}>
                <Text style={styles.weightLabel}>Objetivo:</Text>
                <Text style={styles.weightValue}>{user.pesoObjetivo.toFixed(1)} kg</Text>
              </View>
              <View style={styles.weightRow}>
                <Text style={styles.weightLabel}>Restante:</Text>
                <Text style={styles.weightValue}>
                  {(currentWeight - user.pesoObjetivo).toFixed(1)} kg
                </Text>
              </View>
            </View>
            <ProgressBar
              progress={weightProgress}
              showPercentage
              label="Progreso del Corte"
            />
          </Card>

          {/* Daily Metrics */}
          <Card>
            <Text style={styles.sectionTitle}>
              {STRINGS.dashboard.daily_metrics}
            </Text>
            
            {/* Water Intake */}
            <View style={styles.metricRow}>
              <View style={styles.metricInfo}>
                <Text style={styles.metricLabel}>
                  {STRINGS.dashboard.water_consumed}
                </Text>
                <Text style={styles.metricValue}>
                  {todayWaterIntake.toFixed(0)} / {recommendedWater.toFixed(0)} ml
                </Text>
              </View>
              <TouchableOpacity
                style={styles.quickButton}
                onPress={() => handleQuickWater(250)}
              >
                <Ionicons name="water" size={20} color={COLORS.white} />
              </TouchableOpacity>
            </View>
            <ProgressBar
              progress={waterProgress}
              fillColor={waterProgress < 0.7 ? COLORS.alert : COLORS.primary}
            />

            {/* Quick Water Buttons */}
            <View style={styles.quickWaterButtons}>
              <TouchableOpacity
                style={styles.quickWaterBtn}
                onPress={() => handleQuickWater(250)}
              >
                <Text style={styles.quickWaterText}>+250ml</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickWaterBtn}
                onPress={() => handleQuickWater(500)}
              >
                <Text style={styles.quickWaterText}>+500ml</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickWaterBtn}
                onPress={() => setShowWaterInput(!showWaterInput)}
              >
                <Text style={styles.quickWaterText}>Otro</Text>
              </TouchableOpacity>
            </View>

            {showWaterInput && (
              <View style={styles.inputSection}>
                <Input
                  value={waterAmount}
                  onChangeText={setWaterAmount}
                  placeholder="Cantidad en ml"
                  keyboardType="numeric"
                  style={styles.quickInput}
                />
                <Button
                  title="Agregar"
                  onPress={handleAddWater}
                  style={styles.quickButton}
                />
              </View>
            )}
          </Card>

          {/* Quick Actions */}
          <Card>
            <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => setShowWeightInput(!showWeightInput)}
              >
                <Ionicons name="scale" size={24} color={COLORS.primary} />
                <Text style={styles.actionButtonText}>
                  {STRINGS.dashboard.register_weight}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate('Calculadora')}
              >
                <Ionicons name="calculator" size={24} color={COLORS.primary} />
                <Text style={styles.actionButtonText}>Calculadora</Text>
              </TouchableOpacity>
            </View>

            {showWeightInput && (
              <View style={styles.inputSection}>
                <Input
                  value={newWeight}
                  onChangeText={setNewWeight}
                  placeholder="Peso actual (kg)"
                  keyboardType="numeric"
                  style={styles.quickInput}
                />
                <Button
                  title="Registrar"
                  onPress={handleAddWeight}
                  style={styles.quickButton}
                />
              </View>
            )}
          </Card>
        </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: COLORS.white,
    fontSize: 16,
    textAlign: 'center',
  },
  header: {
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  disciplineText: {
    fontSize: 16,
    color: COLORS.primary,
    marginTop: 4,
  },
  countdownCard: {
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  countdownContent: {
    alignItems: 'center',
  },
  countdownNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  countdownText: {
    fontSize: 16,
    color: COLORS.white,
    marginTop: 5,
  },
  phaseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  phaseIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  phaseText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginBottom: 15,
  },
  weightInfo: {
    marginBottom: 15,
  },
  weightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  weightLabel: {
    fontSize: 16,
    color: COLORS.darkGray,
  },
  weightValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  metricInfo: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  quickButton: {
    backgroundColor: COLORS.primary,
    padding: 8,
    borderRadius: 20,
    marginLeft: 10,
  },
  quickWaterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  quickWaterBtn: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  quickWaterText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 15,
    marginHorizontal: 5,
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
  },
  actionButtonText: {
    marginTop: 8,
    fontSize: 12,
    color: COLORS.secondary,
    textAlign: 'center',
    fontWeight: '600',
  },
  inputSection: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  quickInput: {
    flex: 1,
    marginRight: 10,
    marginBottom: 0,
  },
});