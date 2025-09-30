import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS } from '../styles/colors';
import { Ionicons } from '@expo/vector-icons';

export default function RecommendationsScreen({ navigation }) {
  const [recommendations] = useState([
    {
      id: 1,
      category: 'Hidratacion',
      priority: 'low',
      icon: 'water',
      iconColor: '#2196F3',
      title: 'Registra tu hidratacion',
      description: 'Recuerda mantenerte hidratado durante el dia. Registra tu consumo de agua',
      action: 'Registrar agua',
    },
    {
      id: 2,
      category: 'Proteinas',
      priority: 'medium',
      icon: 'nutrition',
      iconColor: '#4CAF50',
      title: 'Consume mas proteinas',
      description: 'Las proteinas son esenciales para la recuperacion muscular',
      action: 'Ver recetas',
    },
    {
      id: 3,
      category: 'Sodio',
      priority: 'high',
      icon: 'warning',
      iconColor: '#FF6B6B',
      title: 'Reduce el sodio',
      description: 'Has consumido 380mg de 400mg permitidos. Evita alimentos procesados',
      action: 'Ver alternativas',
    },
    {
      id: 4,
      category: 'Ejercicio',
      priority: 'low',
      icon: 'barbell',
      iconColor: '#FF9800',
      title: 'Sesion de entrenamiento',
      description: 'Entrena en 2 horas. Recuerda consumir pre-workout',
      action: 'Ver rutina',
    },
    {
      id: 5,
      category: 'Descanso',
      priority: 'medium',
      icon: 'moon',
      iconColor: '#9C27B0',
      title: 'Hora de dormir',
      description: 'Para recuperacion optima, duerme entre 22:00 y 06:00',
      action: 'Configurar alarma',
    },
  ]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#FF6B6B';
      case 'medium': return '#FF9800';
      case 'low': return '#4CAF50';
      default: return COLORS.secondary;
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return '';
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.secondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Recomendaciones</Text>
      </View>

      {/* Priority Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Resumen de Prioridades</Text>
        <View style={styles.priorityGrid}>
          <View style={styles.priorityItem}>
            <View style={[styles.priorityBadge, { backgroundColor: '#FF6B6B' }]}>
              <Text style={styles.priorityCount}>1</Text>
            </View>
            <Text style={styles.priorityLabel}>Alta</Text>
          </View>
          <View style={styles.priorityItem}>
            <View style={[styles.priorityBadge, { backgroundColor: '#FF9800' }]}>
              <Text style={styles.priorityCount}>2</Text>
            </View>
            <Text style={styles.priorityLabel}>Media</Text>
          </View>
          <View style={styles.priorityItem}>
            <View style={[styles.priorityBadge, { backgroundColor: '#4CAF50' }]}>
              <Text style={styles.priorityCount}>2</Text>
            </View>
            <Text style={styles.priorityLabel}>Baja</Text>
          </View>
        </View>
      </View>

      {/* Recommendations List */}
      <View style={styles.recommendationsSection}>
        <Text style={styles.sectionTitle}>Tus Recomendaciones</Text>

        {recommendations.map((rec) => (
          <View key={rec.id} style={styles.recommendationCard}>
            <View style={styles.cardHeader}>
              <View style={styles.iconContainer}>
                <View style={[styles.iconCircle, { backgroundColor: rec.iconColor }]}>
                  <Ionicons name={rec.icon} size={24} color="white" />
                </View>
              </View>
              <View style={styles.headerTextContainer}>
                <View style={styles.titleRow}>
                  <Text style={styles.categoryLabel}>{rec.category}</Text>
                  <View style={[styles.priorityTag, { backgroundColor: getPriorityColor(rec.priority) }]}>
                    <Text style={styles.priorityText}>{getPriorityLabel(rec.priority)}</Text>
                  </View>
                </View>
                <Text style={styles.recTitle}>{rec.title}</Text>
              </View>
            </View>

            <Text style={styles.recDescription}>{rec.description}</Text>

            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>{rec.action}</Text>
              <Ionicons name="arrow-forward" size={18} color="white" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Tips Section */}
      <View style={styles.tipsSection}>
        <Text style={styles.sectionTitle}>Consejos del Dia</Text>
        <View style={styles.tipCard}>
          <Ionicons name="bulb" size={24} color={COLORS.secondary} style={styles.tipIcon} />
          <View style={styles.tipContent}>
            <Text style={styles.tipText}>
              Consume alimentos ricos en potasio para contrarrestar la retencion de liquidos causada por el sodio
            </Text>
          </View>
        </View>
        <View style={styles.tipCard}>
          <Ionicons name="bulb" size={24} color={COLORS.secondary} style={styles.tipIcon} />
          <View style={styles.tipContent}>
            <Text style={styles.tipText}>
              Distribuye tu consumo de proteinas a lo largo del dia para maximizar la sintesis muscular
            </Text>
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
  summaryCard: {
    backgroundColor: COLORS.accent,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    padding: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  priorityGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  priorityItem: {
    alignItems: 'center',
  },
  priorityBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  priorityCount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  priorityLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  recommendationsSection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
  },
  recommendationCard: {
    backgroundColor: COLORS.accent,
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  iconContainer: {
    marginRight: 15,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  priorityTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 11,
    color: 'white',
    fontWeight: 'bold',
  },
  recTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  recDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 15,
  },
  actionButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    marginRight: 8,
  },
  tipsSection: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  tipCard: {
    backgroundColor: COLORS.accent,
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.secondary,
  },
  tipIcon: {
    marginRight: 15,
    marginTop: 2,
  },
  tipContent: {
    flex: 1,
  },
  tipText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 20,
  },
});
