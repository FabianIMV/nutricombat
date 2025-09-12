import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  Modal,
} from 'react-native';
import { Camera } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { useUser } from '../context/UserContext';
import { COLORS } from '../constants/colors';
import { STRINGS } from '../constants/strings';
import { weightCutCalculations } from '../utils/calculations';
import Card from '../components/Card';
import Button from '../components/Button';

// Mock food database
const MOCK_FOODS = {
  'pollo': {
    name: 'Pechuga de Pollo',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    sodium: 74,
    portionSize: '100g',
    recommendation: 'Excelente para corte de peso. Alto en proteína, bajo en sodio.',
    phase_suitability: {
      preparation: 'Excelente',
      intensive: 'Muy Bueno',
      weigh_in: 'Bueno'
    }
  },
  'arroz': {
    name: 'Arroz Blanco',
    calories: 130,
    protein: 2.7,
    carbs: 28,
    fat: 0.3,
    sodium: 1,
    portionSize: '100g',
    recommendation: 'Moderado durante corte. Reducir en fase intensiva.',
    phase_suitability: {
      preparation: 'Bueno',
      intensive: 'Regular',
      weigh_in: 'Evitar'
    }
  },
  'salmon': {
    name: 'Salmón',
    calories: 208,
    protein: 20,
    carbs: 0,
    fat: 13,
    sodium: 73,
    portionSize: '100g',
    recommendation: 'Muy bueno para corte. Rico en proteína y grasas saludables.',
    phase_suitability: {
      preparation: 'Excelente',
      intensive: 'Bueno',
      weigh_in: 'Moderado'
    }
  },
  'default': {
    name: 'Alimento Genérico',
    calories: 150,
    protein: 8,
    carbs: 15,
    fat: 5,
    sodium: 200,
    portionSize: '100g',
    recommendation: 'Analiza la composición nutricional antes de consumir.',
    phase_suitability: {
      preparation: 'Regular',
      intensive: 'Regular',
      weigh_in: 'Regular'
    }
  }
};

export default function ScannerScreen({ navigation }) {
  const { user, addFoodEntry } = useUser();
  
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const mockFoodAnalysis = (imagePath) => {
    // Simulate AI analysis delay
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock analysis - randomly select a food or default
        const foods = Object.keys(MOCK_FOODS).filter(key => key !== 'default');
        const randomFood = foods[Math.floor(Math.random() * foods.length)];
        const selectedFood = MOCK_FOODS[randomFood] || MOCK_FOODS['default'];
        
        resolve({
          ...selectedFood,
          confidence: Math.floor(Math.random() * 30) + 70, // 70-99%
          imagePath,
          analysisDate: new Date().toISOString(),
        });
      }, 2000);
    });
  };

  const getCurrentPhase = () => {
    if (!user) return 'preparation';
    const daysRemaining = weightCutCalculations.getDaysRemaining(user.fechaCompetencia);
    return weightCutCalculations.getCurrentPhase(daysRemaining);
  };

  const getRecommendationColor = (phase, suitability) => {
    const colors = {
      'Excelente': COLORS.success,
      'Muy Bueno': COLORS.primary,
      'Bueno': '#FFA500',
      'Regular': COLORS.alert,
      'Evitar': COLORS.alert,
    };
    return colors[suitability] || COLORS.darkGray;
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        setIsAnalyzing(true);
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        
        setCapturedImage(photo.uri);
        
        // Mock analysis
        const result = await mockFoodAnalysis(photo.uri);
        setAnalysisResult(result);
        setShowResult(true);
        
      } catch (error) {
        Alert.alert('Error', 'No se pudo tomar la foto');
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const retakePicture = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
    setShowResult(false);
  };

  const addToDiet = async () => {
    if (!analysisResult) return;
    
    const foodEntry = {
      name: analysisResult.name,
      calories: analysisResult.calories,
      protein: analysisResult.protein,
      carbs: analysisResult.carbs,
      fat: analysisResult.fat,
      sodium: analysisResult.sodium,
      portion: analysisResult.portionSize,
      imagePath: analysisResult.imagePath,
      confidence: analysisResult.confidence,
    };
    
    const success = await addFoodEntry(foodEntry);
    
    if (success) {
      Alert.alert(
        'Éxito',
        'Alimento agregado a tu registro diario',
        [{ text: 'OK', onPress: () => retakePicture() }]
      );
    } else {
      Alert.alert('Error', 'No se pudo agregar el alimento');
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.centered}>
        <Text style={styles.permissionText}>Solicitando permiso de cámara...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <LinearGradient
        colors={[COLORS.background, COLORS.secondary]}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.centered}>
            <Ionicons name="camera-off" size={64} color={COLORS.white} />
            <Text style={styles.permissionText}>
              Necesitamos acceso a la cámara para escanear alimentos
            </Text>
            <Button
              title="Configurar Permisos"
              onPress={() => Alert.alert('Permisos', 'Ve a Configuración > Permisos > Cámara')}
              style={styles.permissionButton}
            />
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const currentPhase = getCurrentPhase();
  const phaseSuitability = analysisResult?.phase_suitability?.[currentPhase] || 'Regular';

  return (
    <LinearGradient
      colors={[COLORS.background, COLORS.secondary]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Camera View */}
        <View style={styles.cameraContainer}>
          <Camera 
            style={styles.camera} 
            type={type}
            ref={cameraRef}
          >
            <View style={styles.cameraOverlay}>
              <View style={styles.topOverlay}>
                <Text style={styles.overlayText}>
                  {STRINGS.scanner.title}
                </Text>
                <TouchableOpacity
                  style={styles.flipButton}
                  onPress={() => {
                    setType(
                      type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back
                    );
                  }}
                >
                  <Ionicons name="camera-reverse" size={24} color={COLORS.white} />
                </TouchableOpacity>
              </View>

              <View style={styles.scanningFrame}>
                <View style={styles.frameCorner} />
                <View style={[styles.frameCorner, styles.frameCornerTopRight]} />
                <View style={[styles.frameCorner, styles.frameCornerBottomLeft]} />
                <View style={[styles.frameCorner, styles.frameCornerBottomRight]} />
              </View>

              <View style={styles.bottomOverlay}>
                <Text style={styles.instructionText}>
                  Enfoca el alimento en el cuadro
                </Text>
                
                <TouchableOpacity
                  style={[styles.captureButton, isAnalyzing && styles.captureButtonDisabled]}
                  onPress={takePicture}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <Text style={styles.captureButtonText}>Analizando...</Text>
                  ) : (
                    <Ionicons name="camera" size={32} color={COLORS.white} />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </Camera>
        </View>

        {/* Results Modal */}
        <Modal
          visible={showResult}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <LinearGradient
            colors={[COLORS.background, COLORS.secondary]}
            style={styles.modalContainer}
          >
            <SafeAreaView style={styles.modalSafeArea}>
              <ScrollView style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>
                    {STRINGS.scanner.nutrition_info}
                  </Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={retakePicture}
                  >
                    <Ionicons name="close" size={24} color={COLORS.white} />
                  </TouchableOpacity>
                </View>

                {capturedImage && (
                  <Image source={{ uri: capturedImage }} style={styles.capturedImage} />
                )}

                {analysisResult && (
                  <>
                    <Card>
                      <View style={styles.foodHeader}>
                        <Text style={styles.foodName}>{analysisResult.name}</Text>
                        <Text style={styles.confidence}>
                          Confianza: {analysisResult.confidence}%
                        </Text>
                      </View>
                      
                      <Text style={styles.portionText}>
                        Por {analysisResult.portionSize}
                      </Text>
                    </Card>

                    {/* Nutrition Facts */}
                    <Card>
                      <Text style={styles.sectionTitle}>Información Nutricional</Text>
                      
                      <View style={styles.nutritionGrid}>
                        <View style={styles.nutritionItem}>
                          <Text style={styles.nutritionLabel}>Calorías</Text>
                          <Text style={styles.nutritionValue}>
                            {analysisResult.calories} kcal
                          </Text>
                        </View>
                        
                        <View style={styles.nutritionItem}>
                          <Text style={styles.nutritionLabel}>Proteína</Text>
                          <Text style={styles.nutritionValue}>
                            {analysisResult.protein}g
                          </Text>
                        </View>
                        
                        <View style={styles.nutritionItem}>
                          <Text style={styles.nutritionLabel}>Carbohidratos</Text>
                          <Text style={styles.nutritionValue}>
                            {analysisResult.carbs}g
                          </Text>
                        </View>
                        
                        <View style={styles.nutritionItem}>
                          <Text style={styles.nutritionLabel}>Grasa</Text>
                          <Text style={styles.nutritionValue}>
                            {analysisResult.fat}g
                          </Text>
                        </View>
                        
                        <View style={styles.nutritionItem}>
                          <Text style={styles.nutritionLabel}>Sodio</Text>
                          <Text style={styles.nutritionValue}>
                            {analysisResult.sodium}mg
                          </Text>
                        </View>
                      </View>
                    </Card>

                    {/* Recommendation */}
                    <Card>
                      <Text style={styles.sectionTitle}>
                        {STRINGS.scanner.recommendation}
                      </Text>
                      
                      <View style={styles.phaseInfo}>
                        <Text style={styles.currentPhaseText}>
                          Fase Actual: {currentPhase === 'preparation' ? 'Preparación' : 
                                      currentPhase === 'intensive' ? 'Intensiva' : 'Pesaje'}
                        </Text>
                        <View style={[
                          styles.suitabilityBadge,
                          { backgroundColor: getRecommendationColor(currentPhase, phaseSuitability) }
                        ]}>
                          <Text style={styles.suitabilityText}>
                            {phaseSuitability}
                          </Text>
                        </View>
                      </View>
                      
                      <Text style={styles.recommendationText}>
                        {analysisResult.recommendation}
                      </Text>
                    </Card>

                    {/* Action Buttons */}
                    <View style={styles.actionButtons}>
                      <Button
                        title={STRINGS.scanner.add_to_diet}
                        onPress={addToDiet}
                        style={styles.addButton}
                      />
                      
                      <Button
                        title="Tomar Otra Foto"
                        onPress={retakePicture}
                        variant="outline"
                        style={styles.retakeButton}
                      />
                    </View>
                  </>
                )}
              </ScrollView>
            </SafeAreaView>
          </LinearGradient>
        </Modal>
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    color: COLORS.white,
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
  permissionButton: {
    marginTop: 20,
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  topOverlay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  overlayText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  flipButton: {
    padding: 10,
  },
  scanningFrame: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  frameCorner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: COLORS.primary,
    top: '30%',
    left: '20%',
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  frameCornerTopRight: {
    left: '50%',
    borderTopWidth: 4,
    borderLeftWidth: 0,
    borderRightWidth: 4,
  },
  frameCornerBottomLeft: {
    top: '50%',
    borderTopWidth: 0,
    borderBottomWidth: 4,
  },
  frameCornerBottomRight: {
    top: '50%',
    left: '50%',
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 4,
    borderBottomWidth: 4,
  },
  bottomOverlay: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: 30,
    alignItems: 'center',
  },
  instructionText: {
    color: COLORS.white,
    fontSize: 14,
    marginBottom: 20,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: COLORS.white,
  },
  captureButtonDisabled: {
    backgroundColor: COLORS.darkGray,
  },
  captureButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
  },
  modalSafeArea: {
    flex: 1,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  capturedImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
  },
  foodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  foodName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.secondary,
    flex: 1,
  },
  confidence: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  portionText: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginBottom: 15,
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  nutritionItem: {
    width: '48%',
    backgroundColor: COLORS.lightGray,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  nutritionLabel: {
    fontSize: 12,
    color: COLORS.darkGray,
    marginBottom: 5,
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  phaseInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  currentPhaseText: {
    fontSize: 14,
    color: COLORS.secondary,
  },
  suitabilityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  suitabilityText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  recommendationText: {
    fontSize: 14,
    color: COLORS.secondary,
    lineHeight: 20,
  },
  actionButtons: {
    marginTop: 20,
    marginBottom: 40,
  },
  addButton: {
    marginBottom: 10,
  },
  retakeButton: {
    marginTop: 5,
  },
});