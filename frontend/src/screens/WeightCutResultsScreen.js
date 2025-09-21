import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { COLORS } from '../styles/colors';

const { width } = Dimensions.get('window');

export default function WeightCutResultsScreen({ route, navigation }) {
  const { analysisResult, formData } = route.params;
  const [activeTab, setActiveTab] = useState('overview');

  const handleNewAnalysis = () => {
    navigation.goBack();
  };

  const renderOverviewTab = () => (
    <View style={styles.tabContent}>
      {/* Plan Summary - First */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📊 Resumen del Plan</Text>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryIcon}>⚖️</Text>
            <Text style={styles.summaryLabel}>Peso a perder</Text>
            <Text style={styles.summaryValue}>{analysisResult.actionPlan.summary.totalWeightToCutKg} kg</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryIcon}>🔥</Text>
            <Text style={styles.summaryLabel}>TDEE estimado</Text>
            <Text style={styles.summaryValue}>{analysisResult.actionPlan.summary.estimatedTDEE}</Text>
            <Text style={styles.summaryUnit}>calorías</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryIcon}>🎯</Text>
            <Text style={styles.summaryLabel}>Déficit objetivo</Text>
            <Text style={styles.summaryValue}>{analysisResult.actionPlan.summary.targetDeficitCalories}</Text>
            <Text style={styles.summaryUnit}>cal/día</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryIcon}>📅</Text>
            <Text style={styles.summaryLabel}>Duración</Text>
            <Text style={styles.summaryValue}>{formData.daysToCut}</Text>
            <Text style={styles.summaryUnit}>días</Text>
          </View>
        </View>
      </View>

      {/* Risk Analysis - Enhanced */}
      <View style={styles.riskCard}>
        <View style={styles.riskHeader}>
          <Text style={styles.riskBadge}>{getRiskIcon(analysisResult.riskAnalysis.riskCode)}</Text>
          <View style={styles.riskTitleContainer}>
            <Text style={styles.riskLevel}>{getRiskLabel(analysisResult.riskAnalysis.riskCode)}</Text>
            <Text style={styles.riskSubtitle}>Nivel de Riesgo</Text>
          </View>
        </View>
        <View style={[styles.riskIndicator, { backgroundColor: getRiskColor(analysisResult.riskAnalysis.riskCode) }]} />
        <Text style={styles.riskTitle}>{analysisResult.riskAnalysis.title}</Text>
        <Text style={styles.riskDescription}>{analysisResult.riskAnalysis.description}</Text>
      </View>

      {/* Analysis Info */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🤖 Información del Análisis</Text>
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>🎯</Text>
            <Text style={styles.infoLabel}>Confianza</Text>
            <Text style={styles.infoValue}>{analysisResult.analysisConfidence}%</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>🧠</Text>
            <Text style={styles.infoLabel}>Modelo IA</Text>
            <Text style={styles.infoValue}>{getModelLabel(analysisResult.modelUsed)}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderNutritionTab = () => (
    <View style={styles.tabContent}>
      {analysisResult.actionPlan.nutritionPlan.map((phase, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.phaseTitle}>{phase.phase}</Text>
          <View style={styles.nutritionGrid}>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionLabel}>Calorías</Text>
              <Text style={styles.nutritionValue}>{phase.calories}</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionLabel}>Proteínas</Text>
              <Text style={styles.nutritionValue}>{phase.macronutrients.proteinGrams}g</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionLabel}>Carbohidratos</Text>
              <Text style={styles.nutritionValue}>{phase.macronutrients.carbGrams}g</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionLabel}>Grasas</Text>
              <Text style={styles.nutritionValue}>{phase.macronutrients.fatGrams}g</Text>
            </View>
          </View>
          <Text style={styles.phaseInstructions}>{phase.instructions}</Text>
        </View>
      ))}
    </View>
  );

  const renderHydrationTab = () => (
    <View style={styles.tabContent}>
      {analysisResult.actionPlan.hydrationPlan.map((phase, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.phaseTitle}>{phase.phase}</Text>
          <View style={styles.hydrationHeader}>
            <Text style={styles.hydrationAmount}>{phase.dailyIntakeLiters}L</Text>
            <Text style={styles.hydrationLabel}>por día</Text>
          </View>
          <Text style={styles.phaseInstructions}>{phase.instructions}</Text>
        </View>
      ))}
    </View>
  );

  const renderCardioTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Plan de Cardio</Text>

        <View style={styles.cardioInfo}>
          <Text style={styles.cardioLabel}>Actividad:</Text>
          <Text style={styles.cardioValue}>{analysisResult.actionPlan.cardioPlan.session.activity}</Text>
        </View>

        <View style={styles.cardioInfo}>
          <Text style={styles.cardioLabel}>Duración:</Text>
          <Text style={styles.cardioValue}>{analysisResult.actionPlan.cardioPlan.session.durationMinutes} minutos</Text>
        </View>

        <View style={styles.cardioInfo}>
          <Text style={styles.cardioLabel}>Intensidad:</Text>
          <Text style={styles.cardioValue}>{analysisResult.actionPlan.cardioPlan.session.intensity}</Text>
        </View>

        <View style={styles.cardioInfo}>
          <Text style={styles.cardioLabel}>Traje de sauna:</Text>
          <Text style={styles.cardioValue}>{analysisResult.actionPlan.cardioPlan.saunaSuitRequired ? 'Requerido' : 'No requerido'}</Text>
        </View>

        <Text style={styles.sectionTitle}>Horarios recomendados:</Text>
        <Text style={styles.phaseInstructions}>{analysisResult.actionPlan.cardioPlan.timing}</Text>

        <Text style={styles.sectionTitle}>Instrucciones:</Text>
        <Text style={styles.phaseInstructions}>{analysisResult.actionPlan.cardioPlan.instructions}</Text>
      </View>
    </View>
  );

  const renderRecommendationsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recomendaciones Específicas del Deporte</Text>
        {analysisResult.actionPlan.sportSpecificRecommendations.map((recommendation, index) => (
          <View key={index} style={styles.recommendationItem}>
            <Text style={styles.recommendationText}>{recommendation}</Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.disclaimerTitle}>Descargo de Responsabilidad</Text>
        <Text style={styles.disclaimerText}>{analysisResult.actionPlan.disclaimer}</Text>
      </View>
    </View>
  );

  const getRiskColor = (riskCode) => {
    switch (riskCode) {
      case 'LOW': return '#4CAF50';
      case 'MODERATE': return '#FF9800';
      case 'AGGRESSIVE': return '#FF5722';
      case 'DANGEROUS': return '#F44336';
      default: return COLORS.accent;
    }
  };

  const getRiskIcon = (riskCode) => {
    switch (riskCode) {
      case 'LOW': return '✅';
      case 'MODERATE': return '⚠️';
      case 'AGGRESSIVE': return '🔴';
      case 'DANGEROUS': return '💀';
      default: return '❓';
    }
  };

  const getRiskLabel = (riskCode) => {
    switch (riskCode) {
      case 'LOW': return 'Bajo Riesgo';
      case 'MODERATE': return 'Riesgo Moderado';
      case 'AGGRESSIVE': return 'Riesgo Agresivo';
      case 'DANGEROUS': return 'Riesgo Peligroso';
      default: return riskCode;
    }
  };

  const getModelLabel = (modelUsed) => {
    if (modelUsed.includes('flash')) return 'Gemini Flash';
    if (modelUsed.includes('pro')) return 'Gemini Pro';
    return modelUsed;
  };

  const tabs = [
    { key: 'overview', label: 'Resumen' },
    { key: 'nutrition', label: 'Nutrición' },
    { key: 'hydration', label: 'Hidratación' },
    { key: 'cardio', label: 'Cardio' },
    { key: 'recommendations', label: 'Consejos' },
  ];

  return (
    <View style={styles.container}>
      {/* Tab Navigation */}
      <View style={styles.tabBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabContainer}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.activeTab]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Tab Content */}
      <ScrollView style={styles.scrollContent}>
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'nutrition' && renderNutritionTab()}
        {activeTab === 'hydration' && renderHydrationTab()}
        {activeTab === 'cardio' && renderCardioTab()}
        {activeTab === 'recommendations' && renderRecommendationsTab()}

        <TouchableOpacity style={styles.newAnalysisButton} onPress={handleNewAnalysis}>
          <Text style={styles.newAnalysisButtonText}>Nuevo Análisis</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  tabBar: {
    backgroundColor: COLORS.accent,
    height: 60,
    justifyContent: 'center',
  },
  tabContainer: {
    paddingHorizontal: 15,
    alignItems: 'center',
    minWidth: width,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 16,
    backgroundColor: 'transparent',
    minWidth: 70,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: COLORS.secondary,
  },
  tabText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  scrollContent: {
    flex: 1,
  },
  tabContent: {
    padding: 20,
  },
  card: {
    backgroundColor: COLORS.accent,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
  },
  riskCard: {
    backgroundColor: COLORS.accent,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  riskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  riskBadge: {
    fontSize: 32,
    marginRight: 15,
  },
  riskTitleContainer: {
    flex: 1,
  },
  riskLevel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  riskSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  riskIndicator: {
    height: 4,
    borderRadius: 2,
    marginBottom: 15,
  },
  riskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
    lineHeight: 22,
  },
  riskDescription: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryItem: {
    width: '48%',
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.secondary + '20',
  },
  summaryIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 6,
    textAlign: 'center',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginBottom: 2,
  },
  summaryUnit: {
    fontSize: 10,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.secondary + '20',
  },
  infoIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 6,
    textAlign: 'center',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
  },
  phaseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginBottom: 15,
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  nutritionItem: {
    width: '48%',
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    alignItems: 'center',
  },
  nutritionLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  nutritionValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  phaseInstructions: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  hydrationHeader: {
    alignItems: 'center',
    marginBottom: 15,
  },
  hydrationAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  hydrationLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginTop: 15,
    marginBottom: 10,
  },
  cardioInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
  },
  cardioLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  cardioValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
    textAlign: 'right',
  },
  recommendationItem: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.secondary,
  },
  recommendationText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  disclaimerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.error,
    marginBottom: 10,
  },
  disclaimerText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  newAnalysisButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: 15,
    padding: 18,
    alignItems: 'center',
    margin: 20,
    marginTop: 10,
  },
  newAnalysisButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});