import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { useUser } from '../context/UserContext';
import { COLORS } from '../constants/colors';
import { STRINGS } from '../constants/strings';
import { weightCutCalculations } from '../utils/calculations';
import Card from '../components/Card';
import Button from '../components/Button';

const DANGER_SYMPTOMS = [
  {
    id: 'dehydration',
    name: 'Deshidratación Severa',
    symptoms: ['Sed extrema', 'Orina oscura o ausente', 'Piel seca'],
    level: 'critical',
    icon: 'water-outline',
  },
  {
    id: 'dizziness',
    name: 'Mareos/Vértigo',
    symptoms: ['Pérdida de equilibrio', 'Sensación de desmayo', 'Visión borrosa'],
    level: 'critical',
    icon: 'warning',
  },
  {
    id: 'nausea',
    name: 'Náuseas/Vómitos',
    symptoms: ['Ganas de vomitar', 'Vómitos frecuentes', 'Malestar estomacal'],
    level: 'critical',
    icon: 'medical',
  },
  {
    id: 'fatigue',
    name: 'Fatiga Extrema',
    symptoms: ['Cansancio excesivo', 'Debilidad muscular', 'Falta de energía'],
    level: 'warning',
    icon: 'battery-dead',
  },
  {
    id: 'confusion',
    name: 'Confusión Mental',
    symptoms: ['Dificultad para concentrarse', 'Desorientación', 'Irritabilidad'],
    level: 'critical',
    icon: 'help-circle',
  },
  {
    id: 'heart',
    name: 'Problemas Cardíacos',
    symptoms: ['Palpitaciones', 'Ritmo cardíaco irregular', 'Dolor en el pecho'],
    level: 'critical',
    icon: 'heart',
  },
];

const EMERGENCY_CONTACTS = [
  {
    name: 'Emergencias (Chile)',
    number: '131',
    type: 'emergency',
  },
  {
    name: 'SAMU',
    number: '131',
    type: 'emergency',
  },
  {
    name: 'Bomberos',
    number: '132',
    type: 'emergency',
  },
];

const RECOVERY_PROTOCOLS = {
  mild: {
    title: 'Protocolo de Recuperación Básica',
    steps: [
      'Detén inmediatamente el corte de peso',
      'Hidrata gradualmente con pequeños sorbos de agua',
      'Consume electrolitos (sales)',
      'Descansa en un lugar fresco',
      'Monitorea síntomas cada 30 minutos',
    ],
    color: '#FFA500',
  },
  severe: {
    title: 'Protocolo de Emergencia',
    steps: [
      'DETÉN TODO el proceso de corte INMEDIATAMENTE',
      'Busca atención médica urgente',
      'Llama a emergencias si es necesario',
      'Hidrata con solución salina si está consciente',
      'Mantén al atleta en reposo',
      'No dejes solo al atleta',
    ],
    color: COLORS.alert,
  },
};

export default function AlertasScreen({ navigation }) {
  const { user, weightHistory, todayWaterIntake } = useUser();
  
  const [checkedSymptoms, setCheckedSymptoms] = useState([]);
  const [riskLevel, setRiskLevel] = useState('low');
  const [showEmergencyContacts, setShowEmergencyContacts] = useState(false);

  useEffect(() => {
    calculateRiskLevel();
  }, [checkedSymptoms, user, weightHistory, todayWaterIntake]);

  const calculateRiskLevel = () => {
    let risk = 'low';
    
    // Check selected symptoms
    const criticalSymptoms = checkedSymptoms.filter(id => 
      DANGER_SYMPTOMS.find(s => s.id === id)?.level === 'critical'
    );
    
    if (criticalSymptoms.length >= 2) {
      risk = 'critical';
    } else if (criticalSymptoms.length >= 1 || checkedSymptoms.length >= 3) {
      risk = 'high';
    } else if (checkedSymptoms.length >= 1) {
      risk = 'moderate';
    }

    // Additional risk factors based on data
    if (user) {
      const daysRemaining = weightCutCalculations.getDaysRemaining(user.fechaCompetencia);
      const currentWeight = weightHistory.length > 0 
        ? weightHistory[weightHistory.length - 1].weight 
        : user.pesoActual;
      
      const totalCut = user.pesoActual - user.pesoObjetivo;
      const progressCut = user.pesoActual - currentWeight;
      const remainingCut = currentWeight - user.pesoObjetivo;
      
      // Risk from rapid weight loss
      if (daysRemaining <= 1 && remainingCut > totalCut * 0.3) {
        risk = risk === 'low' ? 'moderate' : risk;
      }
      
      // Risk from dehydration
      const recommendedWater = weightCutCalculations.getWaterRecommendation(
        weightCutCalculations.getCurrentPhase(daysRemaining),
        currentWeight
      );
      
      if (todayWaterIntake < recommendedWater * 0.5) {
        risk = risk === 'low' ? 'moderate' : risk;
      }
      
      // Risk from extreme cutting
      if (totalCut / user.pesoActual > 0.08) {
        risk = 'high';
      }
    }

    setRiskLevel(risk);
  };

  const toggleSymptom = (symptomId) => {
    setCheckedSymptoms(prev => {
      if (prev.includes(symptomId)) {
        return prev.filter(id => id !== symptomId);
      } else {
        return [...prev, symptomId];
      }
    });
  };

  const callEmergency = (number) => {
    Alert.alert(
      'Llamar Emergencias',
      `¿Llamar a ${number}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Llamar', 
          onPress: () => Linking.openURL(`tel:${number}`) 
        },
      ]
    );
  };

  const getRiskColor = () => {
    switch (riskLevel) {
      case 'critical': return COLORS.alert;
      case 'high': return '#FF4444';
      case 'moderate': return '#FFA500';
      default: return COLORS.success;
    }
  };

  const getRiskText = () => {
    switch (riskLevel) {
      case 'critical': return 'CRÍTICO - Buscar atención médica inmediata';
      case 'high': return 'ALTO - Detener corte y evaluar síntomas';
      case 'moderate': return 'MODERADO - Monitorear de cerca';
      default: return 'BAJO - Continuar con precaución';
    }
  };

  const getProtocol = () => {
    return riskLevel === 'critical' || riskLevel === 'high' 
      ? RECOVERY_PROTOCOLS.severe 
      : RECOVERY_PROTOCOLS.mild;
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
          {/* Risk Level Alert */}
          <Card style={[styles.riskCard, { borderColor: getRiskColor() }]}>
            <View style={styles.riskHeader}>
              <Ionicons 
                name={riskLevel === 'critical' ? 'alert-circle' : 'warning'} 
                size={32} 
                color={getRiskColor()} 
              />
              <View style={styles.riskInfo}>
                <Text style={styles.riskTitle}>Nivel de Riesgo</Text>
                <Text style={[styles.riskLevel, { color: getRiskColor() }]}>
                  {getRiskText()}
                </Text>
              </View>
            </View>
          </Card>

          {/* Symptoms Checklist */}
          <Card>
            <Text style={styles.sectionTitle}>
              {STRINGS.alerts.symptoms_check}
            </Text>
            <Text style={styles.instructionText}>
              Marca los síntomas que estás experimentando:
            </Text>

            {DANGER_SYMPTOMS.map((symptom) => (
              <TouchableOpacity
                key={symptom.id}
                style={[
                  styles.symptomItem,
                  checkedSymptoms.includes(symptom.id) && styles.symptomItemChecked,
                  symptom.level === 'critical' && styles.symptomCritical,
                ]}
                onPress={() => toggleSymptom(symptom.id)}
              >
                <View style={styles.symptomHeader}>
                  <Ionicons 
                    name={symptom.icon} 
                    size={20} 
                    color={
                      checkedSymptoms.includes(symptom.id) 
                        ? COLORS.white 
                        : symptom.level === 'critical' 
                          ? COLORS.alert 
                          : COLORS.primary
                    } 
                  />
                  <Text style={[
                    styles.symptomName,
                    checkedSymptoms.includes(symptom.id) && styles.symptomNameChecked
                  ]}>
                    {symptom.name}
                  </Text>
                  <Ionicons
                    name={checkedSymptoms.includes(symptom.id) ? 'checkmark-circle' : 'ellipse-outline'}
                    size={20}
                    color={checkedSymptoms.includes(symptom.id) ? COLORS.white : COLORS.darkGray}
                  />
                </View>
                
                <View style={styles.symptomDetails}>
                  {symptom.symptoms.map((detail, index) => (
                    <Text key={index} style={[
                      styles.symptomDetail,
                      checkedSymptoms.includes(symptom.id) && styles.symptomDetailChecked
                    ]}>
                      • {detail}
                    </Text>
                  ))}
                </View>
              </TouchableOpacity>
            ))}
          </Card>

          {/* Recovery Protocol */}
          {checkedSymptoms.length > 0 && (
            <Card style={[styles.protocolCard, { borderColor: getProtocol().color }]}>
              <View style={styles.protocolHeader}>
                <Ionicons name="medical" size={24} color={getProtocol().color} />
                <Text style={[styles.protocolTitle, { color: getProtocol().color }]}>
                  {getProtocol().title}
                </Text>
              </View>

              {getProtocol().steps.map((step, index) => (
                <View key={index} style={styles.protocolStep}>
                  <View style={[styles.stepNumber, { backgroundColor: getProtocol().color }]}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              ))}
            </Card>
          )}

          {/* Emergency Contacts */}
          <Card>
            <View style={styles.emergencyHeader}>
              <Text style={styles.sectionTitle}>
                {STRINGS.alerts.emergency_contact}
              </Text>
              <TouchableOpacity
                onPress={() => setShowEmergencyContacts(!showEmergencyContacts)}
              >
                <Ionicons
                  name={showEmergencyContacts ? 'chevron-up' : 'chevron-down'}
                  size={24}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
            </View>

            {showEmergencyContacts && (
              <View style={styles.emergencyContacts}>
                {EMERGENCY_CONTACTS.map((contact, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.emergencyContact}
                    onPress={() => callEmergency(contact.number)}
                  >
                    <View style={styles.contactInfo}>
                      <Ionicons name="call" size={20} color={COLORS.alert} />
                      <Text style={styles.contactName}>{contact.name}</Text>
                    </View>
                    <Text style={styles.contactNumber}>{contact.number}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </Card>

          {/* Action Buttons */}
          <Card>
            <View style={styles.actionButtons}>
              {(riskLevel === 'critical' || riskLevel === 'high') && (
                <Button
                  title={STRINGS.alerts.seek_medical}
                  onPress={() => callEmergency('131')}
                  variant="alert"
                  style={styles.actionButton}
                />
              )}
              
              <Button
                title={STRINGS.alerts.stop_cut}
                onPress={() => {
                  Alert.alert(
                    'Detener Corte de Peso',
                    '¿Estás seguro de que quieres detener el corte de peso? Esto es recomendable si experimentas síntomas peligrosos.',
                    [
                      { text: 'Cancelar', style: 'cancel' },
                      { 
                        text: 'Detener Corte', 
                        style: 'destructive',
                        onPress: () => {
                          // Here you would implement stopping the cut
                          Alert.alert('Corte Detenido', 'Has detenido el corte de peso. Hidrata inmediatamente y busca asistencia médica si es necesario.');
                          navigation.navigate('Dashboard');
                        }
                      },
                    ]
                  );
                }}
                variant={riskLevel === 'critical' ? 'alert' : 'secondary'}
                style={styles.actionButton}
              />

              <Button
                title="Volver al Dashboard"
                onPress={() => navigation.goBack()}
                variant="outline"
                style={styles.actionButton}
              />
            </View>
          </Card>

          {/* Educational Info */}
          <Card style={styles.educationalCard}>
            <Text style={styles.educationalTitle}>⚠️ Recordatorio Importante</Text>
            <Text style={styles.educationalText}>
              El corte de peso puede ser peligroso. Siempre:
            </Text>
            <Text style={styles.educationalPoint}>• Consulta con profesionales médicos</Text>
            <Text style={styles.educationalPoint}>• No excedas el 8% de tu peso corporal</Text>
            <Text style={styles.educationalPoint}>• Hidrata adecuadamente después del pesaje</Text>
            <Text style={styles.educationalPoint}>• Detén el proceso si experimentas síntomas graves</Text>
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
  riskCard: {
    borderWidth: 3,
    marginBottom: 20,
  },
  riskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  riskInfo: {
    marginLeft: 15,
    flex: 1,
  },
  riskTitle: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  riskLevel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginBottom: 15,
  },
  instructionText: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginBottom: 20,
  },
  symptomItem: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  symptomItemChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  symptomCritical: {
    borderColor: COLORS.alert,
    borderWidth: 1,
  },
  symptomHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  symptomName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.secondary,
    flex: 1,
    marginLeft: 10,
  },
  symptomNameChecked: {
    color: COLORS.white,
  },
  symptomDetails: {
    marginLeft: 30,
  },
  symptomDetail: {
    fontSize: 12,
    color: COLORS.darkGray,
    marginBottom: 2,
  },
  symptomDetailChecked: {
    color: COLORS.white,
  },
  protocolCard: {
    borderWidth: 2,
    marginBottom: 20,
  },
  protocolHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  protocolTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  protocolStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.secondary,
    lineHeight: 20,
  },
  emergencyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emergencyContacts: {
    marginTop: 15,
  },
  emergencyContact: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginLeft: 10,
  },
  contactNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.alert,
  },
  actionButtons: {
    marginTop: 10,
  },
  actionButton: {
    marginBottom: 10,
  },
  educationalCard: {
    backgroundColor: COLORS.primary + '10',
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginBottom: 20,
  },
  educationalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginBottom: 10,
  },
  educationalText: {
    fontSize: 14,
    color: COLORS.secondary,
    marginBottom: 8,
  },
  educationalPoint: {
    fontSize: 12,
    color: COLORS.secondary,
    marginBottom: 4,
  },
});