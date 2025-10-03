import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  Image,
  RefreshControl
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { readAsStringAsync } from 'expo-file-system/legacy';
import { COLORS } from '../styles/colors';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ScannerScreen({ navigation }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    setSelectedImage(null);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted' || cameraStatus.status !== 'granted') {
      Alert.alert(
        'Permisos requeridos',
        'Necesitamos permisos de cámara y galería para analizar alimentos'
      );
      return false;
    }
    return true;
  };

  const convertToBase64 = async (uri) => {
    try {
      const base64 = await readAsStringAsync(uri, {
        encoding: 'base64',
      });

      const sizeInBytes = (base64.length * 3) / 4;
      const sizeInMB = sizeInBytes / (1024 * 1024);

      if (sizeInMB > 4.5) {
        Alert.alert(
          'Imagen muy grande',
          'La imagen no puede superar los 4.5MB. Por favor selecciona una imagen más pequeña.'
        );
        return null;
      }

      return base64;
    } catch (error) {
      console.error('Error converting to base64:', error);
      Alert.alert('Error', 'No se pudo procesar la imagen');
      return null;
    }
  };

  const analyzeNutrition = async (base64Image, imageUri) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        'https://vgx997rty0.execute-api.us-east-1.amazonaws.com/prod/api/nutrition/analyze',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gemini-2.5-pro',
            image: base64Image,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Navigate to results screen with data
      navigation.navigate('NutritionResults', {
        analysisResult: result,
        selectedImage: imageUri
      });
    } catch (error) {
      console.error('Error analyzing nutrition:', error);
      Alert.alert(
        'Error de análisis',
        'No se pudo analizar la imagen. Intenta nuevamente.'
      );
    } finally {
      setIsLoading(false);
      setSelectedImage(null);
    }
  };

  const takePhoto = async () => {
    console.log('takePhoto button pressed');
    try {
      const hasPermission = await requestPermissions();
      console.log('Camera permission:', hasPermission);
      if (!hasPermission) return;

      console.log('Launching camera...');
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: 'Images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      console.log('Camera result:', result);

      if (!result.canceled && result.assets && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        console.log('Image captured:', imageUri);
        setSelectedImage(imageUri);

        const base64 = await convertToBase64(imageUri);
        if (base64) {
          await analyzeNutrition(base64, imageUri);
        }
      }
    } catch (error) {
      console.error('Error in takePhoto:', error);
      Alert.alert('Error', 'No se pudo acceder a la cámara');
    }
  };

  const pickImage = async () => {
    console.log('pickImage button pressed');
    try {
      const hasPermission = await requestPermissions();
      console.log('Gallery permission:', hasPermission);
      if (!hasPermission) return;

      console.log('Launching gallery...');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'Images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      console.log('Gallery result:', result);

      if (!result.canceled && result.assets && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        console.log('Image selected:', imageUri);
        setSelectedImage(imageUri);

        const base64 = await convertToBase64(imageUri);
        if (base64) {
          await analyzeNutrition(base64, imageUri);
        }
      }
    } catch (error) {
      console.error('Error in pickImage:', error);
      Alert.alert('Error', 'No se pudo acceder a la galería');
    }
  };


  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[COLORS.secondary]}
          tintColor={COLORS.secondary}
        />
      }
    >
      <View style={styles.content}>
        {refreshing && (
          <View style={styles.loadingHeader}>
            <ActivityIndicator size="small" color={COLORS.secondary} />
            <Text style={styles.loadingText}>Limpiando interfaz...</Text>
          </View>
        )}
        <Text style={styles.title}>Análisis Nutricional</Text>
        <Text style={styles.subtitle}>Toma o selecciona una foto de tu comida</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={takePhoto}
            activeOpacity={0.7}
          >
            <Text style={styles.primaryButtonText}>Tomar Foto</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={pickImage}
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryButtonText}>Seleccionar Imagen</Text>
          </TouchableOpacity>

        </View>


        {isLoading && (
          <View style={styles.fullScreenLoading}>
            <LoadingSpinner
              useDynamicMessages={true}
              subtitle="Analizando composición nutricional"
              messageInterval={2000}
              showTitle={false}
            />
          </View>
        )}

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
    alignItems: 'center',
  },
  fullScreenLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.primary,
    zIndex: 1000,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 20,
    gap: 15,
  },
  primaryButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  primaryButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.secondary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: COLORS.secondary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  loader: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  loaderText: {
    fontSize: 24,
  },
  loadingText: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  loadingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginBottom: 15,
  },
});