import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { COLORS } from '../styles/colors';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function NutritionTrackingScreen({ navigation }) {
  const [meals] = useState([
    { id: 1, name: 'Desayuno', calories: 450, protein: 25, carbs: 45, fats: 12, time: '08:00' },
    { id: 2, name: 'Almuerzo', calories: 620, protein: 42, carbs: 58, fats: 18, time: '13:30' },
    { id: 3, name: 'Cena', calories: 380, protein: 28, carbs: 32, fats: 14, time: '19:00' },
  ]);

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const targetCalories = 2200;
  const remainingCalories = targetCalories - totalCalories;
  const progressPercentage = (totalCalories / targetCalories) * 100;

  const totalProtein = meals.reduce((sum, meal) => sum + meal.protein, 0);
  const totalCarbs = meals.reduce((sum, meal) => sum + meal.carbs, 0);
  const totalFats = meals.reduce((sum, meal) => sum + meal.fats, 0);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.secondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Seguimiento Nutricional</Text>
      </View>

      {/* Daily Summary Card */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Resumen Diario</Text>
        <View style={styles.caloriesContainer}>
          <View style={styles.caloriesCircle}>
            <Text style={styles.caloriesValue}>{totalCalories}</Text>
            <Text style={styles.caloriesLabel}>de {targetCalories}</Text>
            <Text style={styles.caloriesUnit}>calorias</Text>
          </View>
        </View>

        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${Math.min(progressPercentage, 100)}%` }]} />
          </View>
        </View>

        <View style={styles.remainingContainer}>
          <Text style={remainingCalories >= 0 ? styles.remainingText : styles.exceededText}>
            {remainingCalories >= 0 ? `Quedan ${remainingCalories} cal` : `Excedido por ${Math.abs(remainingCalories)} cal`}
          </Text>
        </View>
      </View>

      {/* Macros Card */}
      <View style={styles.macrosCard}>
        <Text style={styles.sectionTitle}>Macronutrientes</Text>
        <View style={styles.macrosGrid}>
          <View style={styles.macroItem}>
            <View style={[styles.macroIcon, { backgroundColor: '#4CAF50' }]}>
              <Ionicons name="fitness" size={24} color="white" />
            </View>
            <Text style={styles.macroValue}>{totalProtein}g</Text>
            <Text style={styles.macroLabel}>Proteinas</Text>
          </View>

          <View style={styles.macroItem}>
            <View style={[styles.macroIcon, { backgroundColor: '#FF9800' }]}>
              <Ionicons name="flame" size={24} color="white" />
            </View>
            <Text style={styles.macroValue}>{totalCarbs}g</Text>
            <Text style={styles.macroLabel}>Carbohidratos</Text>
          </View>

          <View style={styles.macroItem}>
            <View style={[styles.macroIcon, { backgroundColor: '#2196F3' }]}>
              <Ionicons name="water" size={24} color="white" />
            </View>
            <Text style={styles.macroValue}>{totalFats}g</Text>
            <Text style={styles.macroLabel}>Grasas</Text>
          </View>
        </View>
      </View>

      {/* Meals List */}
      <View style={styles.mealsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Comidas Registradas</Text>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add-circle" size={28} color={COLORS.secondary} />
          </TouchableOpacity>
        </View>

        {meals.map((meal) => (
          <View key={meal.id} style={styles.mealCard}>
            <View style={styles.mealHeader}>
              <View>
                <Text style={styles.mealName}>{meal.name}</Text>
                <Text style={styles.mealTime}>{meal.time}</Text>
              </View>
              <Text style={styles.mealCalories}>{meal.calories} cal</Text>
            </View>

            <View style={styles.mealMacros}>
              <View style={styles.mealMacroItem}>
                <Text style={styles.mealMacroValue}>P: {meal.protein}g</Text>
              </View>
              <View style={styles.mealMacroItem}>
                <Text style={styles.mealMacroValue}>C: {meal.carbs}g</Text>
              </View>
              <View style={styles.mealMacroItem}>
                <Text style={styles.mealMacroValue}>G: {meal.fats}g</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.editMealButton}>
              <Text style={styles.editMealText}>Editar</Text>
            </TouchableOpacity>
          </View>
        ))}
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
    marginBottom: 15,
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 20,
  },
  caloriesContainer: {
    marginBottom: 20,
  },
  caloriesCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 8,
    borderColor: COLORS.secondary,
  },
  caloriesValue: {
    fontSize: 42,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  caloriesLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 5,
  },
  caloriesUnit: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  progressBarContainer: {
    width: '100%',
    marginBottom: 10,
  },
  progressBar: {
    height: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.secondary,
    borderRadius: 6,
  },
  remainingContainer: {
    marginTop: 5,
  },
  remainingText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  exceededText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B6B',
  },
  macrosCard: {
    backgroundColor: COLORS.accent,
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 20,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
  },
  macrosGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroItem: {
    flex: 1,
    alignItems: 'center',
  },
  macroIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  macroValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 5,
  },
  macroLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  mealsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  addButton: {
    padding: 5,
  },
  mealCard: {
    backgroundColor: COLORS.accent,
    borderRadius: 15,
    padding: 20,
    marginBottom: 12,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  mealName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 5,
  },
  mealTime: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  mealCalories: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  mealMacros: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
    paddingVertical: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
  },
  mealMacroItem: {
    alignItems: 'center',
  },
  mealMacroValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  editMealButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  editMealText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 20,
  },
});
