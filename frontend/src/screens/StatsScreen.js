import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { COLORS } from '../styles/colors';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function StatsScreen({ navigation }) {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const weeklyData = {
    weight: [73.5, 73.2, 73.1, 73.0, 72.8, 72.9, 73.1],
    calories: [2100, 2200, 1950, 2150, 2100, 2050, 2200],
    water: [2.5, 2.8, 3.0, 2.7, 2.9, 3.2, 2.6],
    days: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'],
  };

  const stats = {
    avgWeight: 73.1,
    weightChange: -0.4,
    avgCalories: 2107,
    caloriesChange: 50,
    avgWater: 2.8,
    waterChange: 0.3,
    compliance: 85,
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.secondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Estadisticas</Text>
      </View>

      {/* Period Selector */}
      <View style={styles.periodSelector}>
        <TouchableOpacity
          style={[styles.periodButton, selectedPeriod === 'week' && styles.periodButtonActive]}
          onPress={() => setSelectedPeriod('week')}
        >
          <Text style={[styles.periodText, selectedPeriod === 'week' && styles.periodTextActive]}>
            Semana
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.periodButton, selectedPeriod === 'month' && styles.periodButtonActive]}
          onPress={() => setSelectedPeriod('month')}
        >
          <Text style={[styles.periodText, selectedPeriod === 'month' && styles.periodTextActive]}>
            Mes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.periodButton, selectedPeriod === 'year' && styles.periodButtonActive]}
          onPress={() => setSelectedPeriod('year')}
        >
          <Text style={[styles.periodText, selectedPeriod === 'year' && styles.periodTextActive]}>
            Año
          </Text>
        </TouchableOpacity>
      </View>

      {/* Overview Cards */}
      <View style={styles.overviewSection}>
        <Text style={styles.sectionTitle}>Resumen General</Text>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#4CAF50' }]}>
              <Ionicons name="trending-down" size={24} color="white" />
            </View>
            <Text style={styles.statValue}>{stats.avgWeight} kg</Text>
            <Text style={styles.statLabel}>Peso Promedio</Text>
            <View style={styles.changeContainer}>
              <Ionicons name="arrow-down" size={14} color="#4CAF50" />
              <Text style={styles.changePositive}>{Math.abs(stats.weightChange)} kg</Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#FF9800' }]}>
              <Ionicons name="flame" size={24} color="white" />
            </View>
            <Text style={styles.statValue}>{stats.avgCalories}</Text>
            <Text style={styles.statLabel}>Calorias Diarias</Text>
            <View style={styles.changeContainer}>
              <Ionicons name="arrow-up" size={14} color="#FF6B6B" />
              <Text style={styles.changeNegative}>{stats.caloriesChange} cal</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#2196F3' }]}>
              <Ionicons name="water" size={24} color="white" />
            </View>
            <Text style={styles.statValue}>{stats.avgWater} L</Text>
            <Text style={styles.statLabel}>Hidratacion</Text>
            <View style={styles.changeContainer}>
              <Ionicons name="arrow-up" size={14} color="#4CAF50" />
              <Text style={styles.changePositive}>{stats.waterChange} L</Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#9C27B0' }]}>
              <Ionicons name="checkmark-circle" size={24} color="white" />
            </View>
            <Text style={styles.statValue}>{stats.compliance}%</Text>
            <Text style={styles.statLabel}>Cumplimiento</Text>
            <View style={styles.changeContainer}>
              <Ionicons name="checkmark" size={14} color="#4CAF50" />
              <Text style={styles.changePositive}>Excelente</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Weight Chart */}
      <View style={styles.chartSection}>
        <Text style={styles.sectionTitle}>Progreso de Peso</Text>
        <View style={styles.chartCard}>
          <View style={styles.chartContainer}>
            {weeklyData.weight.map((value, index) => {
              const maxWeight = Math.max(...weeklyData.weight);
              const minWeight = Math.min(...weeklyData.weight);
              const range = maxWeight - minWeight || 1;
              const height = ((value - minWeight) / range) * 120 + 20;

              return (
                <View key={index} style={styles.barContainer}>
                  <Text style={styles.barValue}>{value}</Text>
                  <View style={styles.barWrapper}>
                    <View style={[styles.bar, { height, backgroundColor: COLORS.secondary }]} />
                  </View>
                  <Text style={styles.barLabel}>{weeklyData.days[index]}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>

      {/* Calories Chart */}
      <View style={styles.chartSection}>
        <Text style={styles.sectionTitle}>Ingesta Calorica</Text>
        <View style={styles.chartCard}>
          <View style={styles.chartContainer}>
            {weeklyData.calories.map((value, index) => {
              const maxCal = Math.max(...weeklyData.calories);
              const minCal = Math.min(...weeklyData.calories);
              const range = maxCal - minCal || 1;
              const height = ((value - minCal) / range) * 120 + 20;

              return (
                <View key={index} style={styles.barContainer}>
                  <Text style={styles.barValue}>{value}</Text>
                  <View style={styles.barWrapper}>
                    <View style={[styles.bar, { height, backgroundColor: '#FF9800' }]} />
                  </View>
                  <Text style={styles.barLabel}>{weeklyData.days[index]}</Text>
                </View>
              );
            })}
          </View>
          <View style={styles.targetLine}>
            <View style={styles.dashedLine} />
            <Text style={styles.targetLabel}>Meta: 2200 cal</Text>
          </View>
        </View>
      </View>

      {/* Achievements */}
      <View style={styles.achievementsSection}>
        <Text style={styles.sectionTitle}>Logros Recientes</Text>

        <View style={styles.achievementCard}>
          <View style={[styles.achievementIcon, { backgroundColor: '#FFD700' }]}>
            <Ionicons name="trophy" size={28} color="white" />
          </View>
          <View style={styles.achievementContent}>
            <Text style={styles.achievementTitle}>7 dias consecutivos</Text>
            <Text style={styles.achievementDescription}>Mantuviste tu plan alimenticio</Text>
          </View>
        </View>

        <View style={styles.achievementCard}>
          <View style={[styles.achievementIcon, { backgroundColor: '#4CAF50' }]}>
            <Ionicons name="water" size={28} color="white" />
          </View>
          <View style={styles.achievementContent}>
            <Text style={styles.achievementTitle}>Meta de hidratacion</Text>
            <Text style={styles.achievementDescription}>Alcanzaste 3L durante 5 dias</Text>
          </View>
        </View>

        <View style={styles.achievementCard}>
          <View style={[styles.achievementIcon, { backgroundColor: '#2196F3' }]}>
            <Ionicons name="trending-down" size={28} color="white" />
          </View>
          <View style={styles.achievementContent}>
            <Text style={styles.achievementTitle}>Perdida de peso</Text>
            <Text style={styles.achievementDescription}>Redujiste 2kg este mes</Text>
          </View>
        </View>
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  periodSelector: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: COLORS.accent,
    borderRadius: 15,
    padding: 5,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  periodButtonActive: {
    backgroundColor: COLORS.secondary,
  },
  periodText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  periodTextActive: {
    color: 'white',
  },
  overviewSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.accent,
    borderRadius: 20,
    padding: 18,
    alignItems: 'center',
  },
  statIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changePositive: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4CAF50',
    marginLeft: 4,
  },
  changeNegative: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF6B6B',
    marginLeft: 4,
  },
  chartSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  chartCard: {
    backgroundColor: COLORS.accent,
    borderRadius: 20,
    padding: 20,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 180,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
  },
  barValue: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginBottom: 5,
    fontWeight: '600',
  },
  barWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  bar: {
    width: '70%',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  barLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 8,
    fontWeight: '500',
  },
  targetLine: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: COLORS.primary,
    alignItems: 'center',
  },
  dashedLine: {
    width: '100%',
    height: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
    marginBottom: 5,
  },
  targetLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  achievementsSection: {
    paddingHorizontal: 20,
  },
  achievementCard: {
    backgroundColor: COLORS.accent,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  achievementIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 5,
  },
  achievementDescription: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  bottomSpacing: {
    height: 20,
  },
});
