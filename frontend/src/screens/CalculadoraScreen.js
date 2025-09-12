import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { useUser } from '../context/UserContext';
import { COLORS } from '../constants/colors';
import { STRINGS } from '../constants/strings';
import { weightCutCalculations } from '../utils/calculations';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';

export default function CalculadoraScreen({ navigation }) {
  const { user } = useUser();
  
  const [formData, setFormData] = useState({
    pesoActual: '',
    pesoObjetivo: '',
    diasRestantes: '',
  });

  const [cutPlan, setCutPlan] = useState(null);
  const [isCalculated, setIsCalculated] = useState(false);

  useEffect(() => {
    if (user) {
      const daysRemaining = weightCutCalculations.getDaysRemaining(user.fechaCompetencia);
      setFormData({
        pesoActual: user.pesoActual?.toString() || '',
        pesoObjetivo: user.pesoObjetivo?.toString() || '',
        diasRestantes: daysRemaining.toString(),
      });
    }
  }, [user]);

  const validateInputs = () => {
    const peso = parseFloat(formData.pesoActual);
    const objetivo = parseFloat(formData.pesoObjetivo);
    const dias = parseInt(formData.diasRestantes);

    if (isNaN(peso) || peso <= 0) {
      Alert.alert('Error', 'Ingresa un peso actual válido');
      return false;
    }

    if (isNaN(objetivo) || objetivo <= 0) {
      Alert.alert('Error', 'Ingresa un peso objetivo válido');
      return false;
    }

    if (isNaN(dias) || dias <= 0) {
      Alert.alert('Error', 'Ingresa días restantes válidos');
      return false;
    }

    if (objetivo >= peso) {
      Alert.alert('Error', 'El peso objetivo debe ser menor al actual');
      return false;
    }

    if (!weightCutCalculations.isSafeCut(peso, objetivo)) {
      const maxSafe = weightCutCalculations.getMaxSafeCut(peso);
      Alert.alert(
        STRINGS.calculator.warning,
        `${STRINGS.calculator.max_cut_warning} (máximo: ${maxSafe.toFixed(1)}kg)`
      );
      return false;
    }

    return true;
  };

  const calculatePlan = () => {
    if (!validateInputs()) return;

    const peso = parseFloat(formData.pesoActual);
    const objetivo = parseFloat(formData.pesoObjetivo);
    const dias = parseInt(formData.diasRestantes);

    const plan = weightCutCalculations.calculateCutPlan(peso, objetivo, dias);
    setCutPlan(plan);
    setIsCalculated(true);
  };

  const resetCalculator = () => {
    setCutPlan(null);
    setIsCalculated(false);
  };

  const renderPhaseCard = (phaseKey, phaseData, title, icon, color) => {
    if (phaseData.days === 0) return null;

    return (
      <Card key={phaseKey} style={styles.phaseCard}>
        <View style={styles.phaseHeader}>
          <View style={styles.phaseIconContainer}>
            <Ionicons name={icon} size={24} color={color} />
          </View>
          <View style={styles.phaseInfo}>
            <Text style={[styles.phaseTitle, { color }]}>{title}</Text>
            <Text style={styles.phaseDuration}>{phaseData.days} días</Text>
          </View>
        </View>
        
        <View style={styles.phaseDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Peso a perder:</Text>
            <Text style={styles.detailValue}>
              {phaseData.weightCut.toFixed(1)} kg
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Por día:</Text>
            <Text style={styles.detailValue}>
              {phaseData.dailyTarget.toFixed(2)} kg/día
            </Text>
          </View>
          
          <Text style={styles.phaseDescription}>
            {phaseData.description}
          </Text>
        </View>
      </Card>
    );
  };

  const getSafetyLevel = (totalCut, currentWeight) => {
    const percentage = (totalCut / currentWeight) * 100;
    
    if (percentage <= 3) {
      return { level: 'Muy Seguro', color: COLORS.success, icon: 'checkmark-circle' };
    } else if (percentage <= 5) {
      return { level: 'Seguro', color: COLORS.primary, icon: 'checkmark-circle-outline' };
    } else if (percentage <= 8) {
      return { level: 'Precaución', color: '#FFA500', icon: 'warning' };
    } else {
      return { level: 'Peligroso', color: COLORS.alert, icon: 'alert-circle' };
    }
  };

  return (
    <LinearGradient
      colors={[COLORS.background, COLORS.secondary]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          <Card>
            <Text style={styles.title}>{STRINGS.calculator.title}</Text>
            
            <Input
              label={STRINGS.calculator.current_weight}
              value={formData.pesoActual}
              onChangeText={(text) => setFormData(prev => ({ ...prev, pesoActual: text }))}
              placeholder="75.5"
              keyboardType="numeric"
            />

            <Input
              label={STRINGS.calculator.target_weight}
              value={formData.pesoObjetivo}
              onChangeText={(text) => setFormData(prev => ({ ...prev, pesoObjetivo: text }))}
              placeholder="70.0"
              keyboardType="numeric"
            />

            <Input
              label={STRINGS.calculator.days_remaining}
              value={formData.diasRestantes}
              onChangeText={(text) => setFormData(prev => ({ ...prev, diasRestantes: text }))}
              placeholder="14"
              keyboardType="numeric"
            />

            <View style={styles.buttonContainer}>
              <Button
                title={STRINGS.calculator.calculate}
                onPress={calculatePlan}
                style={styles.calculateButton}
              />
              
              {isCalculated && (
                <Button
                  title="Nuevo Cálculo"
                  onPress={resetCalculator}
                  variant="outline"
                  style={styles.resetButton}
                />
              )}
            </View>
          </Card>

          {cutPlan && (
            <>
              {/* Safety Assessment */}
              {(() => {
                const safety = getSafetyLevel(cutPlan.totalCut, parseFloat(formData.pesoActual));
                return (
                  <Card style={[styles.safetyCard, { borderColor: safety.color }]}>
                    <View style={styles.safetyHeader}>
                      <Ionicons name={safety.icon} size={24} color={safety.color} />
                      <Text style={[styles.safetyTitle, { color: safety.color }]}>
                        Nivel de Seguridad: {safety.level}
                      </Text>
                    </View>
                    
                    <View style={styles.safetyDetails}>
                      <Text style={styles.safetyText}>
                        Total a perder: {cutPlan.totalCut.toFixed(1)} kg
                      </Text>
                      <Text style={styles.safetyText}>
                        Porcentaje del peso corporal: {((cutPlan.totalCut / parseFloat(formData.pesoActual)) * 100).toFixed(1)}%
                      </Text>
                      <Text style={styles.safetyText}>
                        Promedio diario: {cutPlan.dailyTarget.toFixed(2)} kg/día
                      </Text>
                    </View>
                  </Card>
                );
              })()}

              {/* Phase Plans */}
              <View style={styles.phaseContainer}>
                <Text style={styles.sectionTitle}>Plan por Fases</Text>
                
                {renderPhaseCard(
                  'preparation',
                  cutPlan.phases.preparation,
                  STRINGS.calculator.phase_1,
                  'fitness',
                  COLORS.success
                )}
                
                {renderPhaseCard(
                  'intensive',
                  cutPlan.phases.intensive,
                  STRINGS.calculator.phase_2,
                  'flame',
                  '#FFA500'
                )}
                
                {renderPhaseCard(
                  'weighIn',
                  cutPlan.phases.weighIn,
                  STRINGS.calculator.phase_3,
                  'scale',
                  COLORS.alert
                )}
              </View>

              {/* Recommendations */}
              <Card style={styles.recommendationsCard}>
                <Text style={styles.sectionTitle}>Recomendaciones Generales</Text>
                
                <View style={styles.recommendation}>
                  <Ionicons name="water" size={20} color={COLORS.primary} />
                  <Text style={styles.recommendationText}>
                    Mantén hidratación adecuada según la fase
                  </Text>
                </View>
                
                <View style={styles.recommendation}>
                  <Ionicons name="restaurant" size={20} color={COLORS.primary} />
                  <Text style={styles.recommendationText}>
                    Controla el sodio especialmente en fase intensiva
                  </Text>
                </View>
                
                <View style={styles.recommendation}>
                  <Ionicons name="fitness" size={20} color={COLORS.primary} />
                  <Text style={styles.recommendationText}>
                    Mantén entrenamiento pero reduce intensidad en fase 2-3
                  </Text>
                </View>
                
                <View style={styles.recommendation}>
                  <Ionicons name="medical" size={20} color={COLORS.primary} />
                  <Text style={styles.recommendationText}>
                    Monitorea síntomas y busca ayuda si es necesario
                  </Text>
                </View>
              </Card>

              {/* Action Buttons */}
              <Card>
                <View style={styles.actionButtons}>
                  <Button
                    title="Ver Alertas de Seguridad"
                    onPress={() => navigation.navigate('Alertas')}
                    variant="alert"
                    style={styles.actionButton}
                  />
                  
                  <Button
                    title="Volver al Dashboard"
                    onPress={() => navigation.goBack()}
                    style={styles.actionButton}
                  />
                </View>
              </Card>
            </>
          )}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.secondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 20,
  },
  calculateButton: {
    marginBottom: 10,
  },
  resetButton: {
    marginTop: 5,
  },
  safetyCard: {
    borderWidth: 2,
    marginTop: 10,
  },
  safetyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  safetyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  safetyDetails: {
    backgroundColor: COLORS.lightGray,
    padding: 15,
    borderRadius: 8,
  },
  safetyText: {
    fontSize: 14,
    color: COLORS.secondary,
    marginBottom: 5,
  },
  phaseContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 15,
    textAlign: 'center',
  },
  phaseCard: {
    marginBottom: 15,
  },
  phaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  phaseIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phaseInfo: {
    marginLeft: 15,
    flex: 1,
  },
  phaseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  phaseDuration: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginTop: 2,
  },
  phaseDetails: {
    backgroundColor: COLORS.lightGray,
    padding: 15,
    borderRadius: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  phaseDescription: {
    fontSize: 12,
    color: COLORS.darkGray,
    marginTop: 10,
    fontStyle: 'italic',
  },
  recommendationsCard: {
    marginTop: 20,
  },
  recommendation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  recommendationText: {
    fontSize: 14,
    color: COLORS.secondary,
    marginLeft: 10,
    flex: 1,
  },
  actionButtons: {
    marginTop: 10,
  },
  actionButton: {
    marginBottom: 10,
  },
});