import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../styles/colors';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard Informativo</Text>
      </View>

      {/* Tiempo Restante Card */}
      <View style={styles.timeCard}>
        <Icon name="time-outline" size={24} color="white" style={styles.cardIcon} />
        <Text style={styles.timeLabel}>TIEMPO RESTANTE</Text>
        <Text style={styles.timeValue}>3 DÍAS 14H</Text>
        <Text style={styles.timeSubtext}>hasta pesaje oficial</Text>
      </View>

      {/* Fase Actual Card */}
      <View style={styles.phaseCard}>
        <View style={styles.phaseContent}>
          <Icon name="flash" size={20} color="#FFA500" />
          <Text style={styles.phaseTitle}>FASE: CORTE INTENSIVO</Text>
        </View>
        <Text style={styles.phaseSubtitle}>Restricción de sodio y carbohidratos activa</Text>
      </View>

      {/* Progreso de Peso */}
      <View style={styles.weightCard}>
        <Text style={styles.sectionTitle}>Progreso de Peso</Text>
        <View style={styles.weightProgress}>
          <Text style={styles.weightCurrent}>73.1kg</Text>
          <Icon name="arrow-forward" size={20} color={COLORS.secondary} />
          <Text style={styles.weightTarget}>70.0kg</Text>
        </View>
        <Text style={styles.weightRemaining}>Faltan: 3.1kg</Text>

        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '60%' }]} />
          </View>
          <Text style={styles.progressPercent}>60%</Text>
        </View>
      </View>

      {/* Métricas Row */}
      <View style={styles.metricsRow}>
        <View style={styles.metricCard}>
          <Text style={styles.metricTitle}>Sodio Hoy</Text>
          <Text style={styles.metricValue}>280mg</Text>
          <View style={styles.metricStatus}>
            <Icon name="checkmark-circle" size={16} color="#4CAF50" />
            <Text style={styles.metricLimit}>/400mg límite</Text>
          </View>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricTitle}>Hidratación</Text>
          <Text style={styles.metricValue}>1.8L</Text>
          <View style={styles.metricStatus}>
            <Icon name="warning" size={16} color="#FF9800" />
            <Text style={styles.metricLimit}>/2L límite</Text>
          </View>
        </View>
      </View>

      {/* Alerta Crítica */}
      <View style={styles.alertCard}>
        <View style={styles.alertContent}>
          <Icon name="warning" size={20} color="white" />
          <Text style={styles.alertTitle}>ALERTA CRÍTICA</Text>
        </View>
        <Text style={styles.alertText}>Reduce sodio desde HOY. Máximo 300mg/día</Text>
      </View>

      {/* Acciones Rápidas */}
      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity style={[styles.actionButton, styles.actionGreen]}>
            <Icon name="scale-outline" size={24} color="white" />
            <Text style={styles.actionText}>Peso</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.actionGreen]}>
            <Icon name="water-outline" size={24} color="white" />
            <Text style={styles.actionText}>+250ml</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.actionGreen]}>
            <Icon name="camera-outline" size={24} color="white" />
            <Text style={styles.actionText}>Comida</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.actionRed]}>
            <Icon name="warning-outline" size={24} color="white" />
            <Text style={styles.actionText}>Urgencia</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  timeCard: {
    backgroundColor: '#FF6B6B',
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  cardIcon: {
    marginBottom: 5,
  },
  timeLabel: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  timeValue: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  timeSubtext: {
    color: 'white',
    fontSize: 14,
    opacity: 0.9,
  },
  phaseCard: {
    backgroundColor: COLORS.accent,
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 15,
    padding: 20,
    borderWidth: 2,
    borderColor: '#FFA500',
  },
  phaseContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  phaseTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  phaseSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  weightCard: {
    backgroundColor: COLORS.accent,
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 15,
    padding: 20,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  weightProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  weightCurrent: {
    color: COLORS.secondary,
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 10,
  },
  weightTarget: {
    color: COLORS.secondary,
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  weightRemaining: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 4,
    marginRight: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.secondary,
    borderRadius: 4,
  },
  progressPercent: {
    color: COLORS.secondary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  metricsRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 15,
    gap: 10,
  },
  metricCard: {
    flex: 1,
    backgroundColor: COLORS.accent,
    borderRadius: 15,
    padding: 15,
  },
  metricTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  metricValue: {
    color: COLORS.secondary,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  metricStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricLimit: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginLeft: 5,
  },
  alertCard: {
    backgroundColor: '#FF6B6B',
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 15,
    padding: 20,
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  alertTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  alertText: {
    color: 'white',
    fontSize: 14,
  },
  actionsSection: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  actionGreen: {
    backgroundColor: COLORS.secondary,
  },
  actionRed: {
    backgroundColor: '#FF6B6B',
  },
  actionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 5,
    textAlign: 'center',
  },
});