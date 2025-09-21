import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity
} from 'react-native';
import { COLORS } from '../styles/colors';

export default function NutritionResultsScreen({ route, navigation }) {
  const { analysisResult, selectedImage } = route.params;

  const handleNewAnalysis = () => {
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Resultado del Análisis</Text>

        {selectedImage && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
          </View>
        )}

        <View style={styles.resultCard}>
          <Text style={styles.foodName}>{analysisResult.nombre}</Text>
          <Text style={styles.confidence}>
            Confianza: {analysisResult.confianza_analisis}%
          </Text>
        </View>

        <View style={styles.nutritionGrid}>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionLabel}>Calorías</Text>
            <Text style={styles.nutritionValue}>{analysisResult.calorias}</Text>
          </View>

          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionLabel}>Peso (g)</Text>
            <Text style={styles.nutritionValue}>{analysisResult.peso_estimado_gramos}</Text>
          </View>
        </View>

        <View style={styles.macrosContainer}>
          <Text style={styles.macrosTitle}>Macronutrientes</Text>

          <View style={styles.macroItem}>
            <Text style={styles.macroLabel}>Carbohidratos:</Text>
            <Text style={styles.macroValue}>{analysisResult.macronutrientes.carbohidratos}g</Text>
          </View>

          <View style={styles.macroItem}>
            <Text style={styles.macroLabel}>Proteínas:</Text>
            <Text style={styles.macroValue}>{analysisResult.macronutrientes.proteinas}g</Text>
          </View>

          <View style={styles.macroItem}>
            <Text style={styles.macroLabel}>Grasas:</Text>
            <Text style={styles.macroValue}>{analysisResult.macronutrientes.grasas}g</Text>
          </View>
        </View>

        {analysisResult.ingredientes && analysisResult.ingredientes.length > 0 && (
          <View style={styles.ingredientsContainer}>
            <Text style={styles.ingredientsTitle}>Ingredientes detectados</Text>
            {analysisResult.ingredientes.map((ingredient, index) => (
              <Text key={index} style={styles.ingredient}>- {ingredient}</Text>
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.newAnalysisButton} onPress={handleNewAnalysis}>
          <Text style={styles.newAnalysisButtonText}>Analizar otra imagen</Text>
        </TouchableOpacity>
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  selectedImage: {
    width: 250,
    height: 250,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: COLORS.secondary,
  },
  resultCard: {
    backgroundColor: COLORS.accent,
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  foodName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  confidence: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  nutritionItem: {
    backgroundColor: COLORS.accent,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    minWidth: 120,
  },
  nutritionLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  nutritionValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  macrosContainer: {
    backgroundColor: COLORS.accent,
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  macrosTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
    textAlign: 'center',
  },
  macroItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
  },
  macroLabel: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  macroValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  ingredientsContainer: {
    backgroundColor: COLORS.accent,
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  ingredientsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
    textAlign: 'center',
  },
  ingredient: {
    fontSize: 16,
    color: COLORS.textSecondary,
    paddingVertical: 4,
  },
  newAnalysisButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  newAnalysisButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});